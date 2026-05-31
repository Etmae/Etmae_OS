import Terminal from "../apps/terminal/index";

export function meta() {
  return [
    { title: "Etmae Virtual OS — Terminal" },
    {
      name: "description",
      content: "Open the command terminal inside Etmae's interactive portfolio desktop environment.",
    },
    { name: "robots", content: "noindex,follow" },
    { property: "og:title", content: "Etmae Virtual OS Terminal" },
    {
      property: "og:description",
      content: "Run terminal commands and explore the developer-focused application inside the portfolio experience.",
    },
  ];
}

export default function TerminalRoute() {
  return (
    <>
      <h1 className="sr-only">Etmae Terminal</h1>
      <Terminal />
    </>
  );
}
