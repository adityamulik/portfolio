"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";

export function PdfViewer({ src, title }: { src: string; title: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const fileUrl = src.split("#")[0];

  useEffect(() => {
    const host = hostRef.current;
    const scroller = scrollerRef.current;
    if (!host || !scroller) {
      return;
    }

    let cancelled = false;
    let pdfDoc: PDFDocumentProxy | null = null;
    let task: PDFDocumentLoadingTask | undefined;
    let renderGen = 0;
    let lastWidth = 0;

    async function renderPages(width: number) {
      if (!pdfDoc || cancelled || width < 48) {
        return;
      }
      const gen = ++renderGen;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvases: HTMLCanvasElement[] = [];

      for (let n = 1; n <= pdfDoc.numPages; n += 1) {
        const page = await pdfDoc.getPage(n);
        if (cancelled || gen !== renderGen) {
          return;
        }
        const unscaled = page.getViewport({ scale: 1 });
        const scale = width / unscaled.width;
        const viewport = page.getViewport({ scale: scale * dpr });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        canvas.className = "mb-3 block bg-white shadow-sm last:mb-0";
        canvas.setAttribute("aria-label", `${title}, page ${n}`);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          continue;
        }
        await page.render({ canvasContext: ctx, canvas, viewport }).promise;
        canvases.push(canvas);
      }

      if (cancelled || gen !== renderGen || !hostRef.current) {
        return;
      }
      hostRef.current.replaceChildren(...canvases);
      setStatus("ready");
    }

    setStatus("loading");
    host.replaceChildren();

    const observer = new ResizeObserver((entries) => {
      const nextWidth = Math.floor(entries[0]?.contentRect.width ?? 0);
      if (!nextWidth || Math.abs(nextWidth - lastWidth) < 4) {
        return;
      }
      lastWidth = nextWidth;
      void renderPages(nextWidth);
    });
    observer.observe(scroller);

    void import("pdfjs-dist")
      .then(async (pdfjs) => {
        if (cancelled) {
          return;
        }
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        task = pdfjs.getDocument({
          url: fileUrl,
          useSystemFonts: true,
          useWasm: false,
        });
        const pdf = await task.promise;
        if (cancelled) {
          return;
        }
        pdfDoc = pdf;
        lastWidth = Math.floor(scroller.clientWidth);
        await renderPages(lastWidth);
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
      observer.disconnect();
      void task?.destroy();
    };
  }, [fileUrl, title]);

  return (
    <div
      ref={scrollerRef}
      className="min-h-0 flex-1 overflow-y-scroll overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
    >
      {status === "loading" ? (
        <p className="px-5 py-8 text-sm text-ink-muted">Loading document…</p>
      ) : null}
      {status === "error" ? (
        <p className="px-5 py-8 text-sm text-ink-muted">
          This document could not be shown here.{" "}
          <a
            href={fileUrl}
            className="text-accent underline decoration-accent/30 underline-offset-4"
          >
            Download the PDF
          </a>
          .
        </p>
      ) : null}
      <div ref={hostRef} className="bg-ink/5 p-2 sm:p-4" />
    </div>
  );
}
