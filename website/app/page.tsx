import Image from "next/image";
import Link from "next/link";
import VirtualMeChat from "@/app/components/VirtualMeChat";

type CareerStep = {
  period: string;
  role: string;
  company: string;
  summary: string;
  impact: string[];
};

type ProfileLink = {
  label: string;
  href: string;
  icon?: "outdoor";
};

const pillars = [
  {
    title: "Data Thinking",
    text: "I turn ambiguity into structured analysis using statistics, clear hypotheses, and transparent decision logic.",
  },
  {
    title: "Agentic Workflow Design",
    text: "I build AI-assisted systems that automate repetitive work while keeping human judgment in the loop.",
  },
  {
    title: "Business Translation",
    text: "I bridge technical execution and business outcomes so teams can move from intuition to measurable proof.",
  },
];

const careerJourney: CareerStep[] = [
  {
    period: "2022 - Present",
    role: "AI & Data Science, Automation Workflows",
    company: "InsightX Labs",
    summary:
      "Designing and shipping AI-assisted tools for support, recruitment, SEO analytics, and multilingual data pipelines.",
    impact: [
      "Built internal automation for scraping, processing, and distributing multilingual datasets.",
      "Developed a KPI-driven SEO analytics agent aligned with NLP and EEAT principles.",
      "Currently developing a data cleaning and preprocessing assistant for analytics workflows.",
    ],
  },
  {
    period: "2013 - 2025",
    role: "Digital Marketing & SEO Consultant",
    company: "ContentCraft",
    summary:
      "Led data-informed SEO strategy combining analytics, experimentation, and automation to scale organic growth.",
    impact: [
      "Produced +50k organic sessions per month in 24 months.",
      "Shipped 100+ optimized articles validated through statistical testing.",
      "Scaled NLP-based content operations with AI automation and custom dashboards.",
    ],
  },
  {
    period: "2011 - 2025",
    role: "Travel Content Creator",
    company: "Bien Voyager",
    summary:
      "Built and operated high-reach travel media properties while leading end-to-end content and campaign delivery.",
    impact: [
      "Reached 500,000+ yearly blog visitors.",
      "Grew personal social footprint to 200,000+ followers.",
      "Delivered campaign work for 10+ tourism boards and brands including GoPro.",
    ],
  },
  {
    period: "2021 - 2024",
    role: "Web3 Community & Social Leadership",
    company: "Multiple Projects",
    summary:
      "Managed social, growth, and community programs across Web3 initiatives, launches, and conference ecosystems.",
    impact: [
      "Grew a French crypto/NFT community to 2,800+ members.",
      "Supported event and project growth through structured content systems and analytics.",
      "Led cross-functional teams for campaign planning, execution, and optimization.",
    ],
  },
];

const portfolioTracks = [
  {
    title: "AI Automation Case Studies",
    state: "In Preparation",
    description:
      "Production snapshots of workflow automation, agent orchestration, and operational tooling.",
    link: "#",
  },
  {
    title: "Data Science Notebooks",
    state: "In Preparation",
    description:
      "Exploratory analysis, model experiments, and practical statistical problem-solving portfolios.",
    link: "#",
  },
  {
    title: "Consulting Impact Stories",
    state: "In Preparation",
    description:
      "Selected examples connecting strategy, execution, and measurable growth outcomes.",
    link: "#",
  },
];

const profileLinks: ProfileLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/piotrkroczak",
  },
  {
    label: "GitHub",
    href: "https://github.com/piotrkroczak-ai",
  },
  {
    label: "Travel Website",
    href: "https://www.bien-voyager.com",
  },
  {
    label: "Outdoor Website",
    href: "https://www.1001-pas.fr",
    icon: "outdoor",
  },
  {
    label: "Email",
    href: "/contact",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <div className="ambient-layer" aria-hidden="true" />

      <header className="top-nav">
        <a href="#home" className="brand-mark">
          PK
        </a>
        <nav>
          <ul className="nav-links">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#journey">Career Journey</a>
            </li>
            <li>
              <a href="#portfolio">Portfolio</a>
            </li>
            <li>
              <a href="#virtual-piotr">Virtual Piotr</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header>

      <section className="hero reveal" id="home">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-tag">Poznan, Poland</p>
            <h1>Piotr Kroczak</h1>
            <p className="hero-subtitle">
              Transitioning toward agentic coding and data science by combining
              Python, statistics, and machine learning with a strong marketing
              and growth background.
            </p>

            <div className="hero-actions">
              <Link className="btn-primary" href="/contact">
                Let&apos;s Collaborate
              </Link>
              <a
                className="btn-secondary"
                href="https://www.linkedin.com/in/piotrkroczak"
                target="_blank"
                rel="noopener noreferrer"
              >
                View LinkedIn
              </a>
            </div>
          </div>

          <aside className="hero-profile">
            <div className="profile-ring" aria-hidden="true" />
            <div className="profile-photo-wrap">
              <div className="profile-photo">
                <Image
                  src="/picture.png"
                  alt="Portrait of Piotr Kroczak"
                  fill
                  priority
                  sizes="(max-width: 980px) 210px, 260px"
                />
              </div>
            </div>
            <p>AI & Data Science | Agentic Workflow Design | Data Automation</p>
          </aside>
        </div>

        <div className="hero-metrics">
          <article>
            <span>14+ years</span>
            <p>Digital strategy, SEO, and content systems experience</p>
          </article>
          <article>
            <span>50k+</span>
            <p>Organic monthly sessions added in a 24-month initiative</p>
          </article>
          <article>
            <span>500k+</span>
            <p>Yearly visitors reached through owned travel media projects</p>
          </article>
        </div>
      </section>

      <section className="panel reveal reveal-delay-1" id="about">
        <div className="section-head">
          <p>About Me</p>
          <h2>Enterprise discipline with explorer energy.</h2>
        </div>

        <div className="about-grid">
          <article className="about-story">
            <p>
              My career began in content and social strategy, where I learned
              to ship quickly and understand audience behavior in real-world
              conditions.
            </p>
            <p>
              Over time, I moved from intuition-driven decisions to measurable,
              evidence-based approaches. That shift led me deeper into data
              analysis, statistics, and machine learning.
            </p>
            <p>
              Today, I focus on building practical AI and automation workflows
              that solve concrete business problems while staying clear,
              reliable, and scalable.
            </p>
          </article>

          <div className="pillar-grid">
            {pillars.map((pillar, index) => (
              <article
                className="pillar-card reveal"
                key={pillar.title}
                style={{ animationDelay: `${index * 120 + 220}ms` }}
              >
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel reveal reveal-delay-2" id="journey">
        <div className="section-head">
          <p>Career Journey</p>
          <h2>From digital growth to AI-driven decision systems.</h2>
        </div>

        <div className="timeline">
          {careerJourney.map((step, index) => (
            <article
              className="timeline-item reveal"
              key={`${step.company}-${step.period}`}
              style={{ animationDelay: `${index * 120 + 300}ms` }}
            >
              <p className="timeline-period">{step.period}</p>
              <h3>{step.role}</h3>
              <h4>{step.company}</h4>
              <p>{step.summary}</p>
              <ul>
                {step.impact.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="panel reveal reveal-delay-3" id="portfolio">
        <div className="section-head">
          <p>Portfolio</p>
          <h2>Structured space for future flagship work.</h2>
        </div>

        <div className="portfolio-grid">
          {portfolioTracks.map((track, index) => (
            <article
              className="portfolio-card reveal"
              key={track.title}
              style={{ animationDelay: `${index * 140 + 350}ms` }}
            >
              <span>{track.state}</span>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <a href={track.link} aria-disabled="true">
                Collection opening soon
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="panel reveal reveal-delay-3" id="virtual-piotr">
        <div className="section-head">
          <p>AI Assistant</p>
          <h2>Chat with Virtual Piotr.</h2>
        </div>
        <VirtualMeChat />
      </section>

      <section className="contact-strip reveal reveal-delay-3" id="contact">
        <div>
          <p className="contact-kicker">Connect</p>
          <h2>Open to collaboration, consulting, and data-focused projects.</h2>
        </div>

        <div className="contact-links">
          {profileLinks.map((item) => {
            const isExternal = item.href.startsWith("http");
            const linkContent = (
              <>
                {item.icon === "outdoor" ? (
                  <Image
                    src="/outdoor-icon.svg"
                    alt=""
                    aria-hidden="true"
                    width={18}
                    height={18}
                    className="contact-link-icon"
                  />
                ) : null}
                <span>{item.label}</span>
              </>
            );

            if (isExternal) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkContent}
                </a>
              );
            }

            return (
              <Link key={item.label} href={item.href}>
                {linkContent}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
