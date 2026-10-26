import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Command,
  Download,
  Globe2,
  Layers3,
  LockKeyhole,
  Monitor,
  Sparkles,
  X,
} from "lucide-react";

type Panel = "assistant" | "install" | null;

function BalloonMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 84"
      role="img"
      aria-label="Bernard balloon avatar"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="balloon-fill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffbf92" />
          <stop offset="0.52" stopColor="#f27b62" />
          <stop offset="1" stopColor="#c7494e" />
        </linearGradient>
      </defs>
      <path
        d="M32 3C16 3 6 14 6 29c0 13 11 26 21 36l5 5 5-5c10-10 21-23 21-36C58 14 48 3 32 3Z"
        fill="url(#balloon-fill)"
        stroke="#682e41"
        strokeWidth="2.2"
      />
      <path d="M18 10c-7 8-8 20-3 30M29 5c-3 14-3 35 0 57M41 7c7 12 8 26 4 39" fill="none" stroke="#ffdfbf" strokeOpacity=".46" strokeWidth="2" />
      <path d="m27 69 2 5m8-5-2 5" stroke="#682e41" strokeWidth="1.5" />
      <path d="M27 74h10l-1.4 7h-7.2L27 74Z" fill="#9c4d53" stroke="#682e41" strokeWidth="1.7" />
      <text x="32" y="39" textAnchor="middle" fontFamily="Georgia, serif" fontSize="21" fill="#fff9ed">B</text>
    </svg>
  );
}

function Dialog({ panel, close, openInstall }: { panel: Panel; close: () => void; openInstall: () => void }) {
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!panel) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const focusFrame = window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>(".dialog-close")?.focus());
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("dialog-open");
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("dialog-open");
      previousFocus?.focus();
    };
  }, [panel, close]);

  if (!panel) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section ref={dialogRef} className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button className="dialog-close icon-button" type="button" aria-label="Close dialog" onClick={close}>
          <X size={19} />
        </button>
        {panel === "install" ? (
          <>
            <div className="dialog-mark"><Download size={21} /></div>
            <p className="eyebrow">A little more patience</p>
            <h2 id="dialog-title">Bernard hasn’t landed on your desktop yet.</h2>
            <p className="dialog-copy">
              The Bernard desktop installer isn’t available yet. There’s no download to start today—we’ll keep this page honest until one is ready.
            </p>
            <div className="availability-card">
              <span className="status-dot" />
              <span><strong>Desktop installer</strong><small>Not available yet</small></span>
              <span className="availability-label">COMING SOON</span>
            </div>
            <button className="button button-disabled" type="button" disabled>
              <Download size={16} /> Download not available
            </button>
            <button className="text-link dialog-secondary" type="button" onClick={close}>Back to Bernard <ArrowRight size={15} /></button>
          </>
        ) : (
          <>
            <div className="dialog-assistant-head">
              <div className="mini-avatar"><BalloonMark /></div>
              <div><p className="eyebrow">Bernard preview</p><h2 id="dialog-title">Your assistant, on the horizon.</h2></div>
            </div>
            <div className="assistant-message">
              <span className="message-avatar"><BalloonMark /></span>
              <p>Hi, I’m Bernard. My desktop assistant and local model connection aren’t available in this website preview yet.</p>
            </div>
            <div className="model-status">
              <span className="status-dot status-dot-muted" />
              <div><strong>Gemini 4 local runtime</strong><small>Not connected · desktop app required</small></div>
              <span className="model-state">PREVIEW</span>
            </div>
            <div className="preview-note"><LockKeyhole size={16} /><span>This page does not start a local model or access your computer.</span></div>
            <button className="button button-primary dialog-cta" type="button" onClick={openInstall}>
              Check install availability <ArrowRight size={17} />
            </button>
          </>
        )}
      </section>
    </div>
  );
}

const capabilities = [
  {
    number: "01",
    icon: <Monitor size={19} />,
    title: "At home on your desktop",
    text: "A companion designed for the place you already work—not another tab to keep track of.",
  },
  {
    number: "02",
    icon: <Layers3 size={19} />,
    title: "Made to move with you",
    text: "Bernard’s ambition is simple: be close at hand as you move between apps and everyday tasks.",
  },
  {
    number: "03",
    icon: <Globe2 size={19} />,
    title: "A local-first idea",
    text: "The experience is being shaped around a local assistant. A working desktop runtime is not included in this preview.",
  },
];

export default function Home() {
  const [panel, setPanel] = useState<Panel>(null);
  const [launching, setLaunching] = useState(false);
  const openInstall = () => setPanel("install");
  const closePanel = () => setPanel(null);
  const launchAssistant = () => {
    setLaunching(true);
    window.setTimeout(() => {
      setLaunching(false);
      setPanel("assistant");
    }, 420);
  };

  return (
    <main id="top">
      <section className="hero" aria-label="Bernard desktop assistant">
        <img
          className="hero-art"
          src="/images/bernard-balloon-mountains.png"
          alt="Hot-air balloons drift above a coral-red mountain range beneath the word Bernard."
          fetchPriority="high"
        />
        <div className="hero-shade" aria-hidden="true" />
        <header className="site-header">
          <a className="brand-lockup" href="#top" aria-label="Bernard home">
            <span className="brand-symbol"><BalloonMark /></span>
            <span className="brand-name">BERNARD<span className="brand-period">.</span><small>YOUR DESKTOP COMPANION</small></span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#about">The idea</a>
            <a href="#everywhere">Made for your flow</a>
          </nav>
          <button className="button button-header" type="button" onClick={openInstall}>
            <span>Install Bernard</span><ArrowUpRight size={16} />
          </button>
        </header>
        <div className="hero-kicker"><span className="kicker-line" />A NEW COMPANION FOR THE EVERYDAY</div>
        <div className="hero-bottom">
          <p className="hero-caption"><span className="caption-index">01</span> Your desktop, with a little more possibility.</p>
          <a className="scroll-cue" href="#about" aria-label="Scroll to learn about Bernard"><ArrowDown size={16} /><span>SCROLL TO EXPLORE</span></a>
        </div>
        <button className={`avatar-launch${launching ? " is-launching" : ""}`} type="button" onClick={launchAssistant} disabled={launching} aria-busy={launching} aria-haspopup="dialog" aria-label={launching ? "Opening Bernard preview" : "Open Bernard assistant preview"}>
          <span className="avatar-orb"><BalloonMark /></span>
          <span className="avatar-copy"><strong>{launching ? "Opening Bernard…" : "Meet Bernard"}</strong><small>{launching ? "Opening preview…" : <>Open the preview <ArrowUpRight size={12} /></>}</small></span>
          <span className="avatar-pulse" aria-hidden="true" />
        </button>
      </section>

      <section className="intro-section" id="about">
        <div className="intro-aside"><span className="section-index">A COMPANION, NOT ANOTHER TAB</span><span className="aside-stroke" /></div>
        <div className="intro-content">
          <p className="eyebrow coral-eyebrow"><Sparkles size={14} /> THE BERNARD IDEA</p>
          <h1>A little more help,<br /><em>wherever work takes you.</em></h1>
          <p className="intro-copy">Bernard is an idea for a desktop AI assistant that stays close by—ready for the moments you could use a hand, without pulling you out of your flow.</p>
          <a className="text-link" href="#everywhere">Get to know Bernard <ArrowRight size={16} /></a>
        </div>
        <div className="intro-stamp" aria-hidden="true"><span>MADE FOR</span><strong>THE<br />JOURNEY</strong><i>✳</i></div>
      </section>

      <section className="flow-section" id="everywhere">
        <div className="flow-heading">
          <div>
            <p className="eyebrow light-eyebrow"><span className="kicker-line" /> A SMALLER DISTANCE TO WHAT’S NEXT</p>
            <h2>There, when<br /><em>you need a hand.</em></h2>
          </div>
          <p className="flow-lede">An assistant imagined for your desktop, your apps, your half-formed thoughts—and the many little things that make up a day.</p>
        </div>
        <div className="capability-list">
          {capabilities.map((item) => (
            <article className="capability" key={item.number}>
              <span className="capability-number">{item.number}</span>
              <span className="capability-icon">{item.icon}</span>
              <div className="capability-copy"><h3>{item.title}</h3><p>{item.text}</p></div>
              <span className="capability-check"><Check size={15} /></span>
            </article>
          ))}
        </div>
        <div className="flow-bottom"><span><Command size={15} /> DESIGNED AROUND YOUR FLOW</span><span>THE DESKTOP ASSISTANT IS STILL IN THE WORKS <span className="tiny-star">✳</span></span></div>
      </section>

      <section className="cta-section" id="install">
        <div className="cta-balloon" aria-hidden="true"><BalloonMark /></div>
        <div className="cta-content">
          <p className="eyebrow coral-eyebrow">WHEN THE TIME IS RIGHT</p>
          <h2>Let’s meet on<br /><em>the other side.</em></h2>
          <p>Bernard’s still getting ready for takeoff. The installer and local model connection aren’t available yet.</p>
          <button className="button button-primary" type="button" onClick={openInstall}>Check install availability <ArrowRight size={17} /></button>
        </div>
        <div className="cta-footnote"><span className="status-dot" /> NOT AVAILABLE FOR DOWNLOAD YET</div>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#top"><span className="footer-mark">B</span> BERNARD<span className="brand-period">.</span></a>
        <p>Thoughtfully imagined. Still in the works.</p>
        <span>© 2026 BERNARD STUDIO</span>
      </footer>

      <Dialog panel={panel} close={closePanel} openInstall={openInstall} />
    </main>
  );
}
