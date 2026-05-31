import { Windows11Desktop } from "../Pages/WindowsDesktop";

export function meta() {
  return [
    { title: "Etmae Virtual OS — Desktop" },
    {
      name: "description",
      content: "Explore the interactive desktop and launch portfolio apps, projects, and contact workflows.",
    },
    { name: "robots", content: "noindex,follow" },
    { property: "og:title", content: "Etmae Virtual OS Desktop" },
    {
      property: "og:description",
      content: "Navigate the simulated Windows-style portfolio desktop and access project showcases, terminal, paint, and contact tools.",
    },
  ];
}

export default function DesktopRoute() {
  return (
    <>
      <h1 className="sr-only">Etmae Virtual Desktop</h1>
      <Windows11Desktop />
    </>
  );
}