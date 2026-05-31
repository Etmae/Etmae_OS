import { Windows11Lockscreen } from "./WindowsLockscreen";

export function meta() {
  return [
    { title: "Etmae Virtual OS — Lock Screen" },
    {
      name: "description",
      content: "Enter the interactive lock screen for Etmae's desktop-style portfolio experience.",
    },
    { name: "robots", content: "noindex,follow" },
  ];
}

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Etmae Virtual OS Lock Screen</h1>
      <Windows11Lockscreen />
    </>
  );
}
