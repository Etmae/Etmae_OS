import { projects } from "./project";
import { skills } from "./skills";
import { experience } from "./experience";

export type Intent =
  | "projects"
  | "skills"
  | "experience"
  | "contact"
  | "general";

// Detect what the user is asking about
export function detectIntent(message: string): Intent {
  const msg = message.toLowerCase();

  if (/project|built|made|created|work|app|system/.test(msg)) return "projects";
  if (/skill|know|tech|stack|language|framework/.test(msg)) return "skills";
  if (/experience|background|year|worked|career|about/.test(msg)) return "experience";
  if (/contact|email|reach|hire|available/.test(msg)) return "contact";

  return "general";
}

// Return only relevant context based on intent
export function getContext(intent: Intent): string {
  switch (intent) {
    case "projects":
      // Slim the context to keep prompts small and faster.
      // (Avoid embedding large fields like video URLs.)
      const slimProjects = projects.slice(0, 3).map((p) => ({
        id: p.id,
        number: p.number,
        title: p.title,
        description: p.description,
        techStack: p.techStack,
        features: p.features?.slice(0, 2),
        role: p.role,
        duration: p.duration,
        highlights: p.highlights,
        heroMediaType: p.heroMediaType,
      }));
      return `PROJECTS:\n${JSON.stringify(slimProjects)}`;

    case "skills":
      return `SKILLS:\n${JSON.stringify(skills)}`;

    case "experience":
    case "contact":
      return `DEVELOPER INFO:\n${JSON.stringify(experience)}`;

    case "general":
    default:
      // For general questions, send a light version of everything
      return `
DEVELOPER: ${experience.name} — ${experience.title}
SUMMARY: ${experience.summary}
TOP SKILLS: ${skills.frontend.concat(skills.backend).join(", ")}
PROJECTS: ${projects.map(p => p.title).join(", ")}
AVAILABLE: ${experience.available}
      `.trim();
  }
}