import Paint from "../apps/paint/Paint";

export function meta() {
  return [
    { title: "Etmae Virtual OS — Paint App" },
    {
      name: "description",
      content: "Use the Paint app inside Etmae's portfolio operating system to create drawings and explore interactive UI.",
    },
    { name: "robots", content: "noindex,follow" },
    { property: "og:title", content: "Etmae Virtual OS Paint App" },
    {
      property: "og:description",
      content: "Launch the built-in Paint application within the portfolio desktop to sketch and save your creative ideas.",
    },
  ];
}

export default function PaintRoute() {
  return (
    <>
      <h1 className="sr-only">Etmae Paint App</h1>
      <Paint />
    </>
  );
}