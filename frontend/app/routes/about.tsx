import { Link } from "react-router-dom";

export function meta() {
  return [
    { title: "Etmae — Full Stack Developer | Portfolio Landing Page" },
    {
      name: "description",
      content: "Meet Etmae, a full stack developer who builds immersive React and TypeScript portfolio experiences with interactive OS-style design.",
    },
    { name: "robots", content: "index,follow" },
    { property: "og:title", content: "Etmae — Full Stack Developer" },
    {
      property: "og:description",
      content: "Discover Etmae's projects, skills, and contact details on a crawlable SEO-optimized landing page.",
    },
  ];
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://etmae.pages.dev" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://etmae.pages.dev/about" },
  ],
};

export default function AboutLanding() {
  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-8 sm:px-10 lg:px-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Etmae — Full Stack Developer & Software Engineer
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
          I build immersive web experiences with React, TypeScript, FastAPI, Django, and modern UI systems. This landing page is a crawlable version of my portfolio that highlights projects, skills, and contact details in plain HTML.
        </p>

        <div className="mt-12 space-y-10">
          <section>
            <h2 className="text-2xl font-semibold">Featured portfolio projects</h2>
            <p className="mt-3 text-slate-300">
              Browse a few of the key projects I’ve designed and developed for fashion, agriculture, software, and ecommerce.
            </p>
            <ul className="mt-6 space-y-4 list-disc pl-5 text-slate-200">
              <li>
                <strong>Looms & Aura</strong> — luxury fashion e-commerce, editorial design, and immersive shopping experiences.
              </li>
              <li>
                <strong>Agrotech</strong> — agricultural agency platform with farm management and sustainable supply workflows.
              </li>
              <li>
                <strong>Etmae Virtual OS</strong> — Windows-inspired portfolio shell, interactive desktop, and project showcase.
              </li>
              <li>
                <strong>SQUADRON</strong> — high-performance simulation UI with real-time motion and telemetry-driven visuals.
              </li>
              <li>
                <strong>GOC Agency</strong> — full-stack online store with product configurators and modern ecommerce interaction.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">What I do</h2>
            <p className="mt-3 text-slate-300">
              I create production-ready apps that feel polished, scalable, and easy to use. My work focuses on React-driven interfaces, server-side APIs, accessible web patterns, and immersive portfolio presentation.
            </p>
            <ul className="mt-6 space-y-3 text-slate-200">
              <li>React + TypeScript frontend architecture</li>
              <li>FastAPI and Django backend systems</li>
              <li>Interactive portfolio design and OS-inspired UI</li>
              <li>SEO-friendly landing pages and crawlable web content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="mt-3 text-slate-300">
              Want to collaborate on a product, app, or creative web experience? Reach out through the contact page or launch the interactive portfolio below.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="/hero"
                className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm font-semibold text-white transition hover:border-green-400/30 hover:bg-white/10"
              >
                View interactive portfolio
              </a>
              <a
                href="/fullcontact"
                className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm font-semibold text-white transition hover:border-green-400/30 hover:bg-white/10"
              >
                Contact page
              </a>
              <a
                href="/sitemap-content.html"
                className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm font-semibold text-white transition hover:border-green-400/30 hover:bg-white/10"
              >
                View static SEO landing page
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
