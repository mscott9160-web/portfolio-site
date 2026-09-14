import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MermaidDiagram from "../MermaidDiagram";

type Project = {
  title: string;
  category: string;
  problem: string;
  decision: string;
  stack: string;
  repo: string;
  status: string;
  metadataTitle: string;
  diagram: string;
  diagramLabel: string;
  caption?: string;
  alsoBuilt?: string[];
  failSafe?: string[];
};

const projects: Record<string, Project> = {
  arbiter: {
    title: "Arbiter",
    category: "01 / AI Infrastructure",
    problem: "Most teams adopting LLMs have no per-request view of what they are spending. Cost shows up as a monthly invoice with no breakdown by tenant, feature, or model, and by then the decisions that drove it are weeks old. Arbiter treats inference spend as something to be measured at the point of use and recorded in a ledger, the same way a financial system would.",
    decision: "A Java 21 Spring Boot gateway sits in front of inference. Each request is classified for complexity by a Python FastAPI sidecar, routed to a model tier, checked against a tenant-scoped exact cache and an opt-in semantic cache, and then recorded as a ledger entry with its computed cost. The two services communicate over a versioned HTTP contract defined in OpenAPI, with ledger events validated against a JSON Schema. Cost calculation is fail-closed: an unknown model raises an error rather than defaulting to zero.",
    stack: "Java 21 · Spring Boot · Python · FastAPI · PostgreSQL (pgvector) · Redis · OpenAPI · JSON Schema",
    repo: "https://github.com/mscott9160-web/arbiter",
    status: "Early stage. The completion provider is a stub and embeddings are deterministic placeholders; the routing, caching, cost, and ledger paths are implemented and tested.",
    metadataTitle: "Arbiter — AI inference routing & cost attribution | Myles B. Scott",
    diagramLabel: "Arbiter request path architecture",
    diagram: `flowchart TD
      C[Client request] --> G[Spring Boot Gateway]
      G --> CL[FastAPI Classifier<br/>complexity tier]
      CL --> R{Route to model tier}
      R --> EX[(Exact cache<br/>Redis, tenant-scoped)]
      R --> SEM[(Semantic cache<br/>pgvector, opt-in)]
      EX --> P[Completion provider]
      SEM --> P
      P --> M[Cost attribution<br/>BigDecimal, fail-closed]
      M --> L[(PostgreSQL ledger<br/>async, idempotent write)]`,
    failSafe: [
      "Unknown model → error, never a zero-cost record",
      "Classifier unavailable → 503",
      "Unsafe semantic-cache candidate → bypass cache",
    ],
    alsoBuilt: [
      "Tenant-scoped cache namespaces so one tenant's entries cannot serve another's",
      "A semantic cache deny-list with recorded reasons for each exclusion, plus a threshold evaluation for cache-poisoning risk",
      "Store-owned idempotency on the ledger writer, so a retried write cannot create a duplicate entry",
      "27 tests across the gateway, plus a Python suite for the classifier",
    ],
  },
  "cash-flow-simulator": {
    title: "Cash Flow Simulator",
    category: "02 / Fintech",
    problem: "Monthly budgets hide timing risk. Cash Flow Simulator projects daily balances over 90 days and identifies the events behind negative-balance days.",
    decision: "Keep financial rules in a pure-Python projection and optimizer core, then expose one versioned API contract to both the React web client and Expo mobile client.",
    stack: "Python · FastAPI · Pydantic · React · TypeScript · PostgreSQL · Expo",
    repo: "https://github.com/mscott9160-web/cash-flow-simulator",
    status: "Core workflows implemented; production infrastructure remains in progress.",
    metadataTitle: "Cash Flow Simulator — daily projection & schedule optimizer | Myles B. Scott",
    diagramLabel: "Cash Flow Simulator layering",
    diagram: `flowchart TD
      W[React / Vite web client] --> API[FastAPI /api/v1<br/>versioned contract]
      M[Expo mobile client] --> API
      API --> CORE
      subgraph CORE[Pure domain core - no framework or DB imports]
        REC[Recurrence rules<br/>biweekly vs semi-monthly]
        BD[Business-day policy<br/>weekends, federal holidays]
        PROJ[90-day projection fold]
        OPT[Constrained optimizer<br/>movable obligations only]
      end
      CORE --> DB[(PostgreSQL / SQLite<br/>Alembic migrations)]`,
  },
  "fade-society": {
    title: "Fade Society",
    category: "03 / Marketplace",
    problem: "A barber marketplace needs distinct experiences for customers, barbers, studio owners, and platform administrators, while preventing two customers from claiming the same appointment.",
    decision: "Double-booking is a concurrency problem, not a UI problem. The prototype models booking state transitions explicitly and enforces conflict prevention in typed domain logic against local state. The production path is designed rather than running: a PostgreSQL schema with a transactional booking routine and an idempotency key, so a retried request cannot create a duplicate appointment. Repository interfaces separate the domain from storage specifically so that swap is a backend change, not a rewrite.",
    stack: "TypeScript · React Native · Expo · Supabase · PostgreSQL",
    repo: "https://github.com/mscott9160-web/fade-society",
    status: "Demo and architecture foundation, not a live production marketplace.",
    metadataTitle: "Fade Society — multi-role booking platform | Myles B. Scott",
    diagramLabel: "Fade Society booking state machine",
    caption: "Transitions are enforced in typed domain logic against local state. The designed production path moves enforcement to a transactional database routine with an idempotency key.",
    diagram: `stateDiagram-v2
      [*] --> Pending
      Pending --> Confirmed
      Pending --> Cancelled
      Pending --> Declined
      Pending --> Failed
      Confirmed --> Completed
      Confirmed --> Cancelled
      Cancelled --> Confirmed`,
  },
  "sneaker-signal": {
    title: "Sneaker Signal",
    category: "04 / Data",
    problem: "How do you represent conflicting release information from sources with unequal credibility? Sneaker release information is scattered across brand calendars, retailer pages, raffles, and editorial coverage, with uneven confidence and freshness.",
    decision: "Treat source quality as part of the data model through source hierarchy, verification states, editorial status, and row-level security over Supabase.",
    stack: "React · TypeScript · Vite · Supabase · PostgreSQL",
    repo: "https://github.com/mscott9160-web/sneaker-signal",
    status: "Product prototype and production-oriented data foundation.",
    metadataTitle: "Sneaker Signal — release data provenance | Myles B. Scott",
    diagramLabel: "Sneaker Signal source hierarchy and verification states",
    caption: "Row-level security keeps release records scoped to the intended data boundary; verification still depends on source provenance and status.",
    diagram: `flowchart LR
      A[Brand / retailer<br/>official] --> REC[Release record]
      B[Verified aggregator] --> REC
      C[Community report] --> REC
      REC --> V{Verification state}
      V --> CF[Confirmed]
      V --> RS[Restock]
      V --> TN[Tentative]
      V --> CX[Cancelled]
      CF --> TRUST[Counts as verified]
      RS --> TRUST
      TN --> UNV[Not verified]
      CX --> UNV`,
  },
};

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) return {};
  const openingSentence = project.problem.split(". ")[0];
  const description = openingSentence.length > 160
    ? `${openingSentence.slice(0, 157).trimEnd()}...`
    : openingSentence;
  return {
    title: project.metadataTitle,
    description,
    openGraph: { title: project.metadataTitle, description },
    twitter: { title: project.metadataTitle, description },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();

  return (
    <main>
      <nav className="nav shell"><Link className="wordmark" href="/">MB<span>.</span>S</Link><div className="nav-links"><Link href="/#work">Work</Link><Link href="/#about">About</Link><Link href="/#contact">Contact</Link></div><a className="nav-cta" href="mailto:mscott9160@outlook.com">Let&apos;s talk <span>↗</span></a></nav>
      <section className="work-section shell"><p className="eyebrow">{project.category}</p><h1>{project.title}</h1><p className="lede">{project.problem}</p><div className="about-section detail-section"><div><h2>The decision that<br /><em>mattered.</em></h2></div><div className="about-copy"><p>{project.decision}</p><MermaidDiagram chart={project.diagram} label={project.diagramLabel} />{project.caption && <p className="diagram-caption">{project.caption}</p>}{project.failSafe && <div className="detail-callout"><p className="eyebrow">Fail-safe behavior</p><ul>{project.failSafe.map((item) => <li key={item}>{item}</li>)}</ul></div>}{project.alsoBuilt && <div className="also-built"><h3>Also built</h3><ul>{project.alsoBuilt.map((item) => <li key={item}>{item}</li>)}</ul></div>}<div className="detail-meta"><span>{project.stack}</span><span>{project.status}</span></div><div className="hero-actions"><a className="button button-primary" href={project.repo} target="_blank" rel="noreferrer">View code <span>↗</span></a><Link className="button button-outline" href="/#work">Back to work <span>↗</span></Link></div></div></div></section>
    </main>
  );
}
