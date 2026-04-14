import { useCallback, useRef, useState } from "react";
import { Link } from "react-router";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CvEditor } from "@/features/editor/cv-editor";
import { CvPreview } from "@/features/preview/cv-preview";
import { SaveIndicator } from "@/components/save-indicator";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ResizeHandle } from "@/features/preview/resize-handle";
import { AppearanceCard } from "@/features/editor/appearance/appearance-card";
import { CompletenessBadge } from "@/components/completeness-badge";
import { EmptyStateBanner } from "@/components/empty-state-banner";
import { EditorToolbar } from "@/features/toolbar";
import { EndorsementButton } from "@/features/endorsement";
import { ContactButton } from "@/features/landing/contact-button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function EditorPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [editorWidth, setEditorWidth] = useState(560);
  const gridRef = useRef<HTMLDivElement>(null);
  const handleResize = useCallback((w: number) => setEditorWidth(w), []);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#editor-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground focus:shadow-md">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-card/90 shadow-sm backdrop-blur-lg transition-[box-shadow] duration-300 supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-[1600px] items-center gap-x-3 px-4 py-2.5 md:gap-x-4">
          <div className="min-w-0 shrink-0">
            <Link
              to="/"
              aria-label="CV Maker — back to home"
              className="flex items-center gap-2 rounded-sm transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span aria-hidden className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground font-display text-xs font-bold">
                CV
              </span>
              <h1 className="font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
                CV Maker
              </h1>
            </Link>
          </div>
          <div className="min-w-0 flex-1" />
          <div className="flex items-center gap-1.5">
            <div className="hidden items-center gap-1.5 sm:flex">
              <ContactButton />
              <EndorsementButton />
            </div>
            <LanguageToggle />
            <ThemeToggle />
            <EditorToolbar printRef={printRef} isLg={isLg} />
          </div>
        </div>
      </header>

      <div id="editor-content" className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col gap-5 p-4 pb-8 lg:gap-6 lg:p-6">
        <EmptyStateBanner />
        <div
          ref={gridRef}
          className="flex min-h-0 w-full flex-1 flex-col gap-5 md:flex-row md:items-start md:gap-4 lg:gap-0"
        >
          {/* ── Left: Editor ── */}
          <section
            className="flex min-h-0 flex-col animate-app-panel md:min-h-[calc(100vh-7rem)] lg:h-full"
            style={
              isMd
                ? { width: isLg ? editorWidth : "50%", flexShrink: 0 }
                : undefined
            }
          >
            {isLg ? (
              <Card className="flex h-full min-h-0 flex-1 flex-col overflow-hidden border-border/80 shadow-md">
                <CardHeader className="shrink-0 border-b border-border/60 bg-muted/30">
                  <CardTitle className="text-base">Content</CardTitle>
                  <SaveIndicator />
                  <CardAction>
                    <CompletenessBadge />
                  </CardAction>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
                  <CvEditor />
                </CardContent>
              </Card>
            ) : isMd ? (
              <Card className="overflow-hidden border-border/80 shadow-md">
                <CardHeader className="border-b border-border/60 bg-muted/30 pb-4">
                  <CardTitle className="text-base">Content</CardTitle>
                  <CardAction>
                    <CompletenessBadge />
                  </CardAction>
                </CardHeader>
                <CardContent className="p-0">
                  <CvEditor />
                </CardContent>
              </Card>
            ) : (
              <Tabs
                value={mobileTab}
                onValueChange={(v) => setMobileTab(v as "edit" | "preview")}
              >
                <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl border border-border/80 bg-muted/50 p-1 shadow-inner">
                  <TabsTrigger
                    value="edit"
                    className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Edit
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-4">
                  <Card className="overflow-hidden border-border/80 shadow-md">
                    <CardHeader className="border-b border-border/60 bg-muted/30 pb-4">
                      <CardTitle className="text-base">Content</CardTitle>
                      <CardAction>
                        <CompletenessBadge />
                      </CardAction>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CvEditor />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="preview" className="mt-4 space-y-4">
                  <AppearanceCard />
                  <CvPreview printRef={printRef} />
                </TabsContent>
              </Tabs>
            )}
          </section>

          {/* ── Resize Handle ── */}
          {isLg && (
            <ResizeHandle editorWidth={editorWidth} onResize={handleResize} containerRef={gridRef} />
          )}

          {/* ── Right: Compact Preview (tablet) ── */}
          {isMd && !isLg && (
            <section className="sticky top-[4.5rem] flex min-w-0 flex-1 flex-col gap-4 animate-app-panel">
              <AppearanceCard />
              <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-md">
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2.5">
                  <span className="text-sm font-medium">Preview</span>
                </div>
                <div className="p-2">
                  <CvPreview printRef={printRef} />
                </div>
              </div>
            </section>
          )}

          {/* ── Right: Appearance + Preview ── */}
          {isLg && (
            <section className="sticky top-[4.5rem] flex min-w-0 flex-1 flex-col gap-4 animate-app-panel">
              <AppearanceCard />
              <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-md">
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2.5">
                  <span className="text-sm font-medium">Preview</span>
                  <span className="text-[11px] text-muted-foreground">
                    Scaled to fit — export uses full A4
                  </span>
                </div>
                <div className="p-3">
                  <CvPreview printRef={printRef} />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
