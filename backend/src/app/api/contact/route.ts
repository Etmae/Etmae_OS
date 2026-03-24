import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/libs/supabase/server";
import { corsHeaders, handleCors } from "@/libs/cors";

// ─── Shared constants ────────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];

const ALLOWED_SERVICES = [
  "Frontend",
  "Web Systems",
  "Backend",
  "Full-Stack",
  "DB DESIGN",
];

const ALLOWED_BUDGETS = [
  "$5k+",
  "$10k+",
  "$25k+",
  "$50k+",
  "Enterprise",
  "TBD",
];

const MAX_FILE_SIZE  = 5 * 1024 * 1024; // 5 MB
const MAX_NAME_LEN   = 100;
const MAX_MSG_LEN    = 5_000;
const EMAIL_RE       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Detect whether a Supabase error is a connectivity / "project paused" failure
 * rather than a normal application-level error.
 */
function isConnectivityError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const { message = "", code = "" } = error as Record<string, string>;
  const msg = message.toLowerCase();
  return (
    msg.includes("econnrefused") ||
    msg.includes("connection") ||
    msg.includes("unavailable") ||
    msg.includes("too many connections") ||
    msg.includes("project is paused") ||
    // PostgreSQL connection-failure codes
    code === "08001" ||
    code === "08006" ||
    // PostgREST "service unavailable"
    code === "PGRST301"
  );
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: corsHeaders });
}

// ─── Route handlers ──────────────────────────────────────────────────────────

export async function OPTIONS() {
  return handleCors();
}

export async function POST(req: Request) {
  try {
    // ── 1. Parse form data ───────────────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return bad("Malformed request — could not parse form data.");
    }

    const name    = (formData.get("name")    as string | null)?.trim() ?? "";
    const email   = (formData.get("email")   as string | null)?.trim() ?? "";
    const service = (formData.get("service") as string | null)?.trim() ?? "";
    const budget  = (formData.get("budget")  as string | null)?.trim() ?? "";
    const message = (formData.get("message") as string | null)?.trim() ?? "";
    const file    =  formData.get("file") as File | null;

    // ── 2. Required-field validation ─────────────────────────────────────────
    const missing: string[] = [];
    if (!name)    missing.push("name");
    if (!email)   missing.push("email");
    if (!message) missing.push("message");

    if (missing.length) {
      return bad(`Missing required fields: ${missing.join(", ")}.`);
    }

    // ── 3. Field-level validation ─────────────────────────────────────────────
    if (name.length < 2) {
      return bad("Name must be at least 2 characters.");
    }
    if (name.length > MAX_NAME_LEN) {
      return bad(`Name must not exceed ${MAX_NAME_LEN} characters.`);
    }

    if (!EMAIL_RE.test(email)) {
      return bad("Invalid email address.");
    }

    if (message.length < 10) {
      return bad("Message must be at least 10 characters.");
    }
    if (message.length > MAX_MSG_LEN) {
      return bad(`Message must not exceed ${MAX_MSG_LEN} characters.`);
    }

    if (service && !ALLOWED_SERVICES.includes(service)) {
      return bad("Invalid service selection.");
    }

    if (budget && !ALLOWED_BUDGETS.includes(budget)) {
      return bad("Invalid budget selection.");
    }

    // ── 4. File validation & upload ──────────────────────────────────────────
    let attachment_url: string | null = null;

    if (file && file.size > 0) {
      // MIME type (browser-supplied but still useful as a first gate)
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return bad(
          "Unsupported file type. Only PDF, DOC, and DOCX files are accepted."
        );
      }

      // Extension (server-enforced, not spoofable via file.type)
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return bad(
          "Unsupported file extension. Allowed extensions: .pdf, .doc, .docx."
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return bad("File is too large. Maximum allowed size is 5 MB.");
      }

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("contact_attachment")
        .upload(fileName, file);

      if (uploadError) {
        console.error("[contact/route] Storage upload error:", uploadError);

        if (isConnectivityError(uploadError)) {
          return NextResponse.json(
            {
              error:
                "Our file storage service is temporarily unavailable. " +
                "Please try again in a few minutes, or submit without an attachment.",
            },
            { status: 503, headers: corsHeaders }
          );
        }

        return NextResponse.json(
          {
            error:
              "File upload failed. Please try again or submit without an attachment.",
          },
          { status: 500, headers: corsHeaders }
        );
      }

      // Store the full bucket-qualified path so the record stays valid
      // even if you rename buckets or add sub-folders later.
      attachment_url = `contact_attachment/${fileName}`;
    }

    // ── 5. Database insert ───────────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from("contact_messages")
      .insert([{ name, email, service, budget, message, attachment_url }]);

    if (dbError) {
      console.error("[contact/route] DB insert error:", dbError);

      // Clean up the orphaned file so storage doesn't leak
      if (attachment_url) {
        const fileName = attachment_url.replace("contact_attachment/", "");
        await supabaseAdmin.storage
          .from("contact_attachment")
          .remove([fileName])
          .catch((e) =>
            console.error("[contact/route] Failed to remove orphaned file:", e)
          );
      }

      if (isConnectivityError(dbError)) {
        return NextResponse.json(
          {
            error:
              "The database is temporarily unavailable (the project may be paused). " +
              "Please try again in a few minutes.",
          },
          { status: 503, headers: corsHeaders }
        );
      }

      // Unique-constraint violation
      if (dbError.code === "23505") {
        return NextResponse.json(
          { error: "This message appears to be a duplicate. Please wait before submitting again." },
          { status: 409, headers: corsHeaders }
        );
      }

      // Generic DB failure
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message stored successfully." },
      { headers: corsHeaders }
    );

  } catch (err) {
    console.error("[contact/route] Unhandled exception:", err);

    return NextResponse.json(
      { error: "An unexpected error occurred on our end. Please try again later." },
      { status: 500, headers: corsHeaders }
    );
  }
}


export async function GET() {
  return new Response("Contact API is working");
}