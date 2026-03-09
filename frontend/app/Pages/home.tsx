import { Windows11Lockscreen } from "./WindowsLockscreen";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  // return <Windows11Lockscreen />;
  return(
    <>
    <Windows11Lockscreen />
    </>
  )
}
