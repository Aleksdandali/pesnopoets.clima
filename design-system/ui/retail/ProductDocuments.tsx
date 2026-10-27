"use client";
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, FileText, Scan, X, ZoomIn } from "lucide-react";

const documents = [
  { id: "energy", title: "Енергиен етикет", detail: "Airy 12 · стр. 2 от документа · PDF, 1,5 MB", url: "/design-system/airy-12/energy-labels.pdf", page: 2 },
  { id: "manual", title: "Ръководство за употреба", detail: "На български · вътрешно тяло · PDF, 24 MB", url: "/design-system/airy-12/user-manual-bg.pdf", page: 1 },
];
export default function ProductDocuments({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<(typeof documents)[number] | null>(null);
  const [page, setPage] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const viewer = useRef<HTMLDialogElement>(null);
  return <section className={`pd-documents ${compact ? "pd-documents-compact" : ""}`} aria-label="Документи за Gree Airy 12">
    <h2>Документи за модела</h2>
    {!compact && <p>Официални документи на GREE за GWH12AVCXD-K6DNA1A.</p>}
    <div className="pd-document-list">{documents.map(doc => <button key={doc.id} onClick={() => { setActive(doc); setPage(1); setZoomed(false); viewer.current?.showModal(); }}><FileText size={23} /><span><strong>{doc.title}</strong><small>{doc.detail}</small></span><ArrowUpRight size={18} /></button>)}</div>
    <dialog className="pd-document-viewer" ref={viewer} aria-label={active?.title ?? "Документ"} onClose={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) viewer.current?.close(); }}>
      {active && <div className="pd-document-content"><header><div><strong>{active.title}</strong><span>Gree Airy 12</span></div><div className="pd-document-actions"><button aria-label={zoomed ? "Покажи цялата страница" : "Увеличи документа"} aria-pressed={zoomed} title={zoomed ? "Цяла страница" : "Увеличи"} onClick={() => setZoomed(value => !value)}>{zoomed ? <Scan size={21} /> : <ZoomIn size={21} />}</button><button aria-label="Затвори документа" onClick={() => viewer.current?.close()}><X /></button></div></header>
        <div className={`pd-document-body ${zoomed ? "is-zoomed" : ""}`}>{active.id === "energy" ? <img src="/design-system/airy-12/energy-airy-12.png" alt="Енергиен етикет на GWH12AVCXD-K6DNA1A, страница 2 от оригиналния документ на GREE" width={778} height={1100} /> : <img src={`/design-system/airy-12/manual/page-${String(page).padStart(2, "0")}.png`} alt={`Ръководство за Gree Airy на български, страница ${page} от 33`} width={988} height={1400} />}</div>
        {active.id === "manual" && <nav className="pd-document-pages" aria-label="Страници на ръководството"><button disabled={page === 1} aria-label="Предишна страница" onClick={() => setPage(value => value - 1)}><ChevronLeft size={20} /></button><label>Страница <select aria-label="Страница на ръководството" value={page} onChange={event => setPage(Number(event.target.value))}>{Array.from({length:33},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select> от 33</label><button disabled={page === 33} aria-label="Следваща страница" onClick={() => setPage(value => value + 1)}><ChevronRight size={20} /></button></nav>}
        <footer><a href={`${active.url}#page=${active.page}`} target="_blank" rel="noopener noreferrer">Отвори PDF <ArrowUpRight size={17} /></a><a href={active.url} download><Download size={17} /> Изтегли</a></footer>
      </div>}
    </dialog>
  </section>;
}
