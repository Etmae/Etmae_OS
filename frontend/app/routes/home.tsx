import { Windows11Lockscreen } from "../Pages/WindowsLockscreen";

export function meta() {
  return [
    { title: "Etmae Virtual OS — Lock Screen" },
    {
      name: "description",
      content: "Enter the interactive lock screen for Etmae's desktop-style portfolio experience.",
    },
    { property: "og:title", content: "Etmae Virtual OS Lock Screen" },
    {
      property: "og:description",
      content: "Unlock the portfolio environment and access the immersive Windows-inspired desktop experience.",
    },
  ];
}

export default function Home() {
  return <Windows11Lockscreen />;
}















