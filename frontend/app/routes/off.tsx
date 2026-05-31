import { PowerOff } from '../components/common/off';

export function meta() {
  return [
    { title: "Etmae Virtual OS — Power Off" },
    {
      name: "description",
      content: "Shut down the interactive portfolio desktop and return to the sign-in experience.",
    },
    { name: "robots", content: "noindex,follow" },
    { property: "og:title", content: "Etmae Virtual OS Power Off" },
    {
      property: "og:description",
      content: "Power off the portfolio environment and return to the entry screen for Etmae's immersive OS experience.",
    },
  ];
}

export default function PowerOffRoute() {
  return (
    <>
      <h1 className="sr-only">Etmae Power Off</h1>
      <PowerOff />
    </>
  );
}