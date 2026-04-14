import { useLocation } from "react-router"
import { useCvStore } from "@/stores/cv-store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import { EyeOff, LayoutGrid, ListOrdered, Palette, Type } from "lucide-react"
import { cn, contrastOnWhite } from "@/lib/utils"
import { TemplateGrid } from "./template-grid"
import { SectionConfigPanel } from "./section-config-panel"
import { editorLabel } from "@/lib/editor-labels"
import { TypographyPanel } from "./typography-panel"
import { ACCENT_PRESETS } from "./appearance-constants"

const TRIGGER_CLASS = "px-5 hover:no-underline [&[data-state=open]]:pb-2"

export function AppearanceCard() {
  const setUi = useCvStore((s) => s.setUi)
  const ui = useCvStore((s) => s.ui)
  const isPro = useLocation().pathname.includes("/pro")

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-md">
      <Accordion type="single" collapsible defaultValue="template">
        {/* ── Template ── */}
        <AccordionItem value="template">
          <AccordionTrigger className={TRIGGER_CLASS}>
            <span className="flex items-center gap-2 text-sm font-medium">
              <LayoutGrid className="size-4 text-muted-foreground" />
              Template
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5">
            <TemplateGrid />
          </AccordionContent>
        </AccordionItem>

        {/* ── Sections ── */}
        <AccordionItem value="sections">
          <AccordionTrigger className={TRIGGER_CLASS}>
            <span className="flex items-center gap-2 text-sm font-medium">
              <ListOrdered className="size-4 text-muted-foreground" />
              {editorLabel("sectionsHeading", ui.locale)}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5">
            <SectionConfigPanel />
          </AccordionContent>
        </AccordionItem>

        {/* ── Colors ── */}
        <AccordionItem value="style">
          <AccordionTrigger className={TRIGGER_CLASS}>
            <span className="flex items-center gap-2 text-sm font-medium">
              <Palette className="size-4 text-muted-foreground" />
              Colors
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 px-5">
            <div>
              <Label className="text-xs text-muted-foreground">Accent color</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {ACCENT_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "size-7 rounded-full border-2 transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring",
                      ui.theme.accent.toLowerCase() === color ? "border-foreground shadow-sm" : "border-transparent",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setUi((u) => ({ ...u, theme: { ...u.theme, accent: color } }))}
                    title={color}
                  />
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input type="color" className="h-8 w-12 cursor-pointer rounded-md border p-0.5" value={ui.theme.accent}
                  onChange={(e) => setUi((u) => ({ ...u, theme: { ...u.theme, accent: e.target.value } }))} />
                <Input className="h-8 flex-1 font-mono text-xs" value={ui.theme.accent}
                  onChange={(e) => setUi((u) => ({ ...u, theme: { ...u.theme, accent: e.target.value } }))} />
              </div>
              {(() => {
                if (!/^#[0-9a-f]{6}$/i.test(ui.theme.accent)) return null
                const ratio = contrastOnWhite(ui.theme.accent)
                if (ratio < 3) return (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {editorLabel("contrastWarnSevere", ui.locale)} ({ratio.toFixed(1)}:1)
                  </p>
                )
                if (ratio < 4.5) return (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {editorLabel("contrastWarnAA", ui.locale)} ({ratio.toFixed(1)}:1)
                  </p>
                )
                return null
              })()}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ── Typography ── */}
        <AccordionItem value="typography">
          <AccordionTrigger className={TRIGGER_CLASS}>
            <span className="flex items-center gap-2 text-sm font-medium">
              <Type className="size-4 text-muted-foreground" />
              Typography
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5">
            <TypographyPanel />
          </AccordionContent>
        </AccordionItem>

        {/* ── Hidden Text (pro only) ── */}
        {isPro && (
        <AccordionItem value="hidden-text" className="border-b-0">
          <AccordionTrigger className={TRIGGER_CLASS}>
            <span className="flex items-center gap-2 text-sm font-medium">
              <EyeOff className="size-4 text-muted-foreground" />
              {editorLabel("hiddenTextHeading", ui.locale)}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 px-5">
            <p className="text-xs text-muted-foreground">{editorLabel("hiddenTextHint", ui.locale)}</p>
            <div>
              <Label className="text-xs text-muted-foreground">{editorLabel("hiddenTextLeft", ui.locale)}</Label>
              <Textarea className="mt-1 text-xs" rows={3} value={ui.hiddenTextLeft}
                onChange={(e) => setUi((u) => ({ ...u, hiddenTextLeft: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{editorLabel("hiddenTextRight", ui.locale)}</Label>
              <Textarea className="mt-1 text-xs" rows={3} value={ui.hiddenTextRight}
                onChange={(e) => setUi((u) => ({ ...u, hiddenTextRight: e.target.value }))} />
            </div>
            <div className="space-y-3 border-t border-border/60 pt-3">
              <p className="text-xs font-medium text-muted-foreground">{editorLabel("pdfMetadataHeading", ui.locale)}</p>
              <div>
                <Label className="text-xs text-muted-foreground">{editorLabel("pdfSubjectLabel", ui.locale)}</Label>
                <Input className="mt-1 h-8 text-xs" value={ui.pdfSubject}
                  onChange={(e) => setUi((u) => ({ ...u, pdfSubject: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{editorLabel("pdfKeywordsLabel", ui.locale)}</Label>
                <Input className="mt-1 h-8 text-xs" value={ui.pdfKeywords}
                  onChange={(e) => setUi((u) => ({ ...u, pdfKeywords: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{editorLabel("pdfCreatorLabel", ui.locale)}</Label>
                <Input className="mt-1 h-8 text-xs" value={ui.pdfCreator}
                  onChange={(e) => setUi((u) => ({ ...u, pdfCreator: e.target.value }))} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
