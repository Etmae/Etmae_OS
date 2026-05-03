import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/libs/supabase/server";
import { getCorsHeaders, handleCors } from "@/libs/cors";

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
  "₦200k+",
  "₦300k+",
  "₦500k+",
  "₦1m+",
  "Enterprise",
  "TBD",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_NAME_LEN  = 100;
const MAX_MSG_LEN   = 5_000;
const EMAIL_RE      = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
    code === "08001" ||
    code === "08006" ||
    code === "PGRST301"
  );
}

/** Respond with a 400-level error, CORS headers included for the given origin. */
function bad(message: string, origin: string | null, status = 400) {
  return NextResponse.json(
    { error: message },
    { status, headers: getCorsHeaders(origin) }
  );
}

// ─── Route handlers ──────────────────────────────────────────────────────────

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return handleCors(origin);
}

export async function POST(req: Request) {
  // Grab origin once — every response in this handler must echo it back.
  const origin = req.headers.get("origin");
  const cors   = getCorsHeaders(origin);

  try {
    // ── 1. Parse form data ───────────────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return bad("Malformed request — could not parse form data.", origin);
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
      return bad(`Missing required fields: ${missing.join(", ")}.`, origin);
    }

    // ── 3. Field-level validation ─────────────────────────────────────────────
    if (name.length < 2) {
      return bad("Name must be at least 2 characters.", origin);
    }
    if (name.length > MAX_NAME_LEN) {
      return bad(`Name must not exceed ${MAX_NAME_LEN} characters.`, origin);
    }
    if (!EMAIL_RE.test(email)) {
      return bad("Invalid email address.", origin);
    }
    if (message.length < 10) {
      return bad("Message must be at least 10 characters.", origin);
    }
    if (message.length > MAX_MSG_LEN) {
      return bad(`Message must not exceed ${MAX_MSG_LEN} characters.`, origin);
    }
    if (service && !ALLOWED_SERVICES.includes(service)) {
      return bad("Invalid service selection.", origin);
    }
    if (budget && !ALLOWED_BUDGETS.includes(budget)) {
      return bad("Invalid budget selection.", origin);
    }

    // ── 4. File validation & upload ──────────────────────────────────────────
    let attachment_url: string | null = null;

    if (file && file.size > 0) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return bad(
          "Unsupported file type. Only PDF, DOC, and DOCX files are accepted.",
          origin
        );
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return bad(
          "Unsupported file extension. Allowed extensions: .pdf, .doc, .docx.",
          origin
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return bad("File is too large. Maximum allowed size is 5 MB.", origin);
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
            { status: 503, headers: cors }
          );
        }

        return NextResponse.json(
          {
            error:
              "File upload failed. Please try again or submit without an attachment.",
          },
          { status: 500, headers: cors }
        );
      }

      attachment_url = `contact_attachment/${fileName}`;
    }

    // ── 5. Database insert ───────────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from("contact_messages")
      .insert([{ name, email, service, budget, message, attachment_url }]);

    if (dbError) {
      console.error("[contact/route] DB insert error:", dbError);

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
          { status: 503, headers: cors }
        );
      }

      if (dbError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This message appears to be a duplicate. Please wait before submitting again.",
          },
          { status: 409, headers: cors }
        );
      }

      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500, headers: cors }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message stored successfully." },
      { headers: cors }
    );

  } catch (err) {
    console.error("[contact/route] Unhandled exception:", err);

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred on our end. Please try again later.",
      },
      { status: 500, headers: cors }
    );
  }
}

export async function GET() {
  return new Response("Contact API is working");
}