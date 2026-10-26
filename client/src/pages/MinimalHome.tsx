import { useEffect, useRef, useState } from "react";

type Panel = "assistant" | "install" | null;

function StatusDialog({ panel, close }: { panel: Panel; close: () => void }) {
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!panel) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("button")?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled)");
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
    };

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
      <section ref={dialogRef} className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button className="dialog-close" type="button" onClick={close}>Close</button>
        {panel === "install" ? (
          <>
            <h2 id="dialog-title">Installer unavailable</h2>
            <p>Bernard isn’t available to download yet.</p>
            <button className="unavailable-button" type="button" disabled>Download unavailable</button>
          </>
        ) : (
          <>
            <h2 id="dialog-title">Assistant offline</h2>
            <p>The Gemini 4 local assistant isn’t connected here, so this website can’t launch it.</p>
          </>
        )}
      </section>
    </div>
  );
}

export default function MinimalHome() {
  const [panel, setPanel] = useState<Panel>(null);
  const closePanel = () => setPanel(null);

  return (
    <main className="page">
      <section className="scene" aria-label="Bernard">
        <img
          className="scene-image"
          src="/images/bernard-balloon-mountains.png"
          alt="Hot-air balloons above coral-red mountains, with Bernard written across the image."
          fetchPriority="high"
        />
        <div className="controls" aria-label="Bernard controls">
          <button className="assistant-button" type="button" onClick={() => setPanel("assistant")} aria-haspopup="dialog" aria-label="Open assistant preview">
            <span className="avatar-dot" aria-hidden="true" />
            <span>Assistant</span>
          </button>
          <button className="install-button" type="button" onClick={() => setPanel("install")} aria-haspopup="dialog">
            Install Bernard
          </button>
        </div>
      </section>
      <section className="product-info" aria-labelledby="product-title">
        <div className="product-heading">
          <p className="eyebrow">DESKTOP ASSISTANT</p>
          <h1 id="product-title">Bernard for desktop</h1>
        </div>
        <div className="product-copy">
          <p>Bernard is being developed as a local assistant for use across desktop apps.</p>
          <dl className="status-list">
            <div><dt>DESKTOP APP</dt><dd>Not available yet</dd></div>
            <div><dt>GEMINI 4</dt><dd>Local connection not active</dd></div>
          </dl>
        </div>
      </section>
      <StatusDialog panel={panel} close={closePanel} />
    </main>
  );
}
