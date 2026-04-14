/**
 * Opens a new window with the CV rendered cleanly on A4 and triggers
 * the browser's native print dialog. User picks "Save as PDF" for a
 * vector PDF with selectable text and perfect layout fidelity.
 */
export function printCvPdf(
  element: HTMLElement,
  options?: { hiddenTextLeft?: string; hiddenTextRight?: string; templateId?: number },
): void {
  const win = window.open("", "_blank", "width=900,height=1200")
  if (!win) {
    throw new Error("Popup blocked — please allow popups to export via print.")
  }

  const headMarkup = Array.from(
    document.querySelectorAll("link[rel='stylesheet'], style"),
  )
    .map((el) => el.outerHTML)
    .join("\n")

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  const hiddenLeft = options?.hiddenTextLeft?.trim()
  const hiddenRight = options?.hiddenTextRight?.trim()
  const hiddenMarkup = `
${hiddenLeft ? `<div class="cv-hidden-text cv-hidden-top-left">${escape(hiddenLeft)}</div>` : ""}
${hiddenRight ? `<div class="cv-hidden-text cv-hidden-top-right">${escape(hiddenRight)}</div>` : ""}`

  win.document.open()
  win.document.write(`<!DOCTYPE html>
<html lang="${document.documentElement.lang || "en"}">
<head>
<meta charset="utf-8">
<title>CV</title>
${headMarkup}
<style>
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; background: white; }
  body { display: flex; justify-content: center; }
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  #cv-print-root {
    position: relative;
    box-shadow: none !important;
    transform: none !important;
    width: 210mm !important;
    height: 297mm !important;
  }
  #cv-print-root > div {
    transform: none !important;
  }
  .cv-hidden-text {
    position: absolute;
    font-size: 8px;
    line-height: 1.2;
    word-wrap: break-word;
    overflow-wrap: break-word;
    color: transparent !important;
    background: transparent !important;
    pointer-events: none;
    user-select: text;
    z-index: 9999;
  }
  .cv-hidden-top-left { top: 0; left: 0; text-align: left; width: ${options?.templateId === 1 ? "72mm" : "99mm"}; }
  .cv-hidden-top-right { top: 0; right: 0; text-align: right; width: ${options?.templateId === 1 ? "136mm" : "99mm"}; }
</style>
</head>
<body>${element.outerHTML.replace(/id="cv-print-root"[^>]*>/, (m) => m + hiddenMarkup)}</body>
</html>`)
  win.document.close()

  const triggerPrint = () => {
    win.focus()
    win.print()
  }

  if (win.document.readyState === "complete") {
    setTimeout(triggerPrint, 400)
  } else {
    win.addEventListener("load", () => setTimeout(triggerPrint, 400))
  }
}
