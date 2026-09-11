import Link from "next/link";
import { notFound } from "next/navigation";

type Project = {
  title: string;
  category: string;
  problem: string;
  decision: string;
  stack: string;
  repo: string;
  status: string;
};

const projects: Record<string, Project> = {
  "cash-flow-simulator": {
    title: "Cash Flow Simulator",
    category: "01 / Fintech",
    problem: "Monthly budgets hide timing risk. Cash Flow Simulator projects daily balances over 90 days and identifies the events behind negative-balance days.",
    decision: "Keep financial rules in a pure-Python projection and optimizer core, then expose one versioned API contract to both the React web client and Expo mobile client.",
    stack: "Python · FastAPI · Pydantic · React · TypeScript · PostgreSQL · Expo",
    repo: "https://github.com/mscott9160-web/cash-flow-simulator",
    status: "Core workflows implemented; production infrastructure remains in progress.",
  },
  "fade-society": {
    title: "Fade Society",
    category: "02 / Marketplace",
    problem: "A barber marketplace needs distinct experiences for customers, barbers, studio owners, and platform administrators, while preventing two customers from claiming the same appointment.",
    decision: "Model booking state transitions explicitly and put server-ready writes behind a transactional PostgreSQL RPC with idempotency protection.",
    stack: "TypeScript · React Native · Expo · Supabase · PostgreSQL",
    repo: "https://github.com/mscott9160-web/fade-society",
    status: "Demo and architecture foundation, not a live production marketplace.",
  },
  "sneaker-signal": {
    title: "Sneaker Signal",
    category: "03 / Data",
    problem: "Sneaker release information is scattered across brand calendars, retailer pages, raffles, and editorial coverage, with uneven confidence and freshness.",
    decision: "Treat source quality as part of the data model through source hierarchy, verification states, editorial status, and row-level security over Supabase.",
    stack: "React · TypeScript · Vite · Supabase · PostgreSQL",
    repo: "https://github.com/mscott9160-web/sneaker-signal",
    status: "Product prototype and production-oriented data foundation.",
  },
};

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();

  return (
    <main>
      <nav className="nav shell"><Link className="wordmark" href="/">MB<span>.</span>S</Link><div className="nav-links"><Link href="/#work">Work</Link><Link href="/#about">About</Link><Link href="/#contact">Contact</Link></div><a className="nav-cta" href="mailto:mscott9160@outlook.com">Let&apos;s talk <span>↗</span></a></nav>
      <section className="work-section shell"><p className="eyebrow">{project.category}</p><h1>{project.title}</h1><p className="lede">{project.problem}</p><div className="about-section"><div><h2>The decision that<br /><em>mattered.</em></h2></div><div className="about-copy"><p>{project.decision}</p><div className="skills"><span>{project.stack}</span><span>{project.status}</span></div><div className="hero-actions"><a className="button button-primary" href={project.repo} target="_blank" rel="noreferrer">View code <span>↗</span></a><Link className="button button-outline" href="/#work">Back to work <span>↗</span></Link></div></div></div></section>
    </main>
  );
}
