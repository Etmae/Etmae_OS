import { PortfolioShell } from '../apps/portfolio/PortfolioShell';

export function meta() {
  return [
    { title: "Etmae Portfolio — Interactive OS Experience" },
    {
      name: "description",
      content: "Discover Etmae's interactive portfolio shell, featuring projects, contact, and immersive desktop-inspired navigation.",
    },
    { name: "robots", content: "noindex,follow" },
    { property: "og:title", content: "Etmae Interactive Portfolio" },
    {
      property: "og:description",
      content: "Launch the immersive portfolio experience with rich UI, project showcases, and contact workflows in a desktop-style environment.",
    },
  ];
}

export default function HeroRoute() {
  return (
    <>
      <h1 className="sr-only">Etmae Interactive Portfolio</h1>
      <PortfolioShell />
    </>
  );
}

