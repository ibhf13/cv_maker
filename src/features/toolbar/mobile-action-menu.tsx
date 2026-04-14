import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Download, FileJson, FileText, FolderOpen, Heart, Loader2, Mail, MoreVertical,
  Printer, ShieldCheck, Sparkles, Trash2, Upload,
} from "lucide-react"
import { useDownloadActions } from "./use-download-actions"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel } from "@/lib/editor-labels"
import { ContactDialog } from "@/features/landing/contact-dialog"
import { EndorsementDialog } from "@/features/endorsement/endorsement-dialog"
import { useEndorsement } from "@/features/endorsement/use-endorsement"
import { GITHUB_REPO_URL, SUPPORT_URL } from "@/features/endorsement/endorsement-urls"

type MobileActionMenuProps = {
  printRef: React.RefObject<HTMLDivElement | null>
  isLg: boolean
  onImport: () => void
  onVersions: () => void
  onExample: () => void
  onReset: () => void
}

export function MobileActionMenu({
  printRef, isLg, onImport, onVersions, onExample, onReset,
}: MobileActionMenuProps) {
  const a = useDownloadActions(printRef, isLg)
  const locale = useLocale()
  const [contactOpen, setContactOpen] = useState(false)
  const endorse = useEndorsement({ githubRepoUrl: GITHUB_REPO_URL, supportUrl: SUPPORT_URL })

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-11 shadow-sm"
          aria-label="More actions"
          disabled={a.exportBusy}
        >
          {a.exportBusy ? <Loader2 className="size-4 animate-spin" /> : <MoreVertical className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Download
        </DropdownMenuLabel>
        <DropdownMenuItem disabled={a.pdfBusy} onSelect={() => void a.onPdf()}>
          {a.pdfBusy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          PDF (visual)
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void a.onPrintPdf()}>
          <Printer className="size-4" />
          PDF (print)
        </DropdownMenuItem>
        <DropdownMenuItem disabled={a.atsPdfBusy} onSelect={() => void a.onAtsPdf()}>
          {a.atsPdfBusy ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          PDF (ATS-friendly)
        </DropdownMenuItem>
        <DropdownMenuItem disabled={a.docxBusy} onSelect={() => void a.onDocx()}>
          {a.docxBusy ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
          Word (.docx)
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void a.onJson()}>
          <FileJson className="size-4" />
          JSON
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={onImport}>
          <Upload className="size-4" />
          Import
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onVersions}>
          <FolderOpen className="size-4" />
          Versions
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onExample}>
          <Sparkles className="size-4" />
          Example
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setContactOpen(true)}>
          <Mail className="size-4" />
          {editorLabel("landing_contact_email", locale)}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => endorse.onOpenChange(true)}>
          <Heart className="size-4 text-primary" />
          {editorLabel("endorsementOpen", locale)}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={onReset}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="size-4" />
          Reset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    <EndorsementDialog
      open={endorse.open}
      onOpenChange={endorse.onOpenChange}
      onStar={endorse.onStar}
      onCoffee={endorse.onCoffee}
    />
    </>
  )
}
