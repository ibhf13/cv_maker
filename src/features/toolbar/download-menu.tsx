import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Download, FileJson, FileText, Loader2, Printer, ShieldCheck } from "lucide-react"
import { useDownloadActions } from "./use-download-actions"
import {
  EndorsementDialog, GITHUB_REPO_URL, SUPPORT_URL, useEndorsement,
} from "@/features/endorsement"

type DownloadMenuProps = {
  printRef: React.RefObject<HTMLDivElement | null>
  isLg: boolean
}

export function DownloadMenu({ printRef, isLg }: DownloadMenuProps) {
  const endorsement = useEndorsement({ githubRepoUrl: GITHUB_REPO_URL, supportUrl: SUPPORT_URL })
  const a = useDownloadActions(printRef, isLg, endorsement.recordDownload)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 shadow-sm" disabled={a.exportBusy}>
            {a.exportBusy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            <span className="hidden sm:inline">Download</span>
            <ChevronDown className="size-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
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
        </DropdownMenuContent>
      </DropdownMenu>
      <EndorsementDialog
        open={endorsement.open}
        onOpenChange={endorsement.onOpenChange}
        onStar={endorsement.onStar}
        onCoffee={endorsement.onCoffee}
      />
    </>
  )
}
