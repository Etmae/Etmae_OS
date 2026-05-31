import { WindowsSignIn } from "../Pages/WindowsSignIn";

export function meta() {
  return [
    { title: "Etmae Virtual OS — Sign In" },
    {
      name: "description",
      content: "Sign into Etmae's immersive virtual desktop portfolio experience.",
    },
    { name: "robots", content: "noindex,follow" },
    { property: "og:title", content: "Etmae Virtual OS Sign In" },
    {
      property: "og:description",
      content: "Authenticate to access the interactive portfolio desktop, apps, and project showcase.",
    },
  ];
}

export default function SignInRoute() {
  return (
    <>
      <h1 className="sr-only">Etmae Sign In</h1>
      <WindowsSignIn />
    </>
  );
}
