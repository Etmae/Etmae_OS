import { useNavigate } from "react-router-dom";
import { ContactPage } from "../apps/portfolio/ContactPage";

export function meta() {
  return [
    { title: "Etmae — Contact" },
    {
      name: "description",
      content: "Send a message to Etmae through the portfolio contact page and discuss your next software project.",
    },
    { name: "robots", content: "noindex,follow" },
    { property: "og:title", content: "Contact Etmae" },
    {
      property: "og:description",
      content: "Reach out to hire Etmae for full-stack development, interactive portfolio experiences, and engineering support.",
    },
  ];
}

function FullContactRoute() {
  const navigate = useNavigate();

  const handleNavigate = (section: string) => {
    if (section === 'home') {
      navigate('/hero');
    } else {
      navigate('/hero');
    }
  };

  return (
    <>
      <h1 className="sr-only">Contact Etmae</h1>
      <ContactPage theme="dark" onNavigate={handleNavigate} />
    </>
  );
}

export default FullContactRoute;