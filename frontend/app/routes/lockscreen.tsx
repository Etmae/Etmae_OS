import { Windows11Lockscreen } from "../Pages/WindowsLockscreen";

export function meta() {
  return [
    { title: "Etmae Virtual OS — Lock Screen" },
    {
      name: "description",
      content: "Enter the interactive lock screen for Etmae's portfolio operating system experience.",
    },
    { name: "robots", content: "noindex,follow" },
    { property: "og:title", content: "Etmae Virtual OS Lock Screen" },
    {
      property: "og:description",
      content: "Unlock the portfolio environment and view interactive apps, projects, and contact options.",
    },
  ];
}

export default function LockscreenRoute() {
  return (
    <>
      <h1 className="sr-only">Etmae Lock Screen</h1>
      <Windows11Lockscreen />
    </>
  );
}
