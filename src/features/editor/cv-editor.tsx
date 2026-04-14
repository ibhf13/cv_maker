import { useEffect } from "react"
import { useCvStore } from "@/stores/cv-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  Languages,
  LayoutList,
  SquareUser,
  Text,
  Wrench,
} from "lucide-react"
import type { EditorSectionTab } from "@/types/ui"
import { sectionStatus } from "@/lib/section-status"
import { editorLabel, type EditorLabelKey } from "@/lib/editor-labels"
import {
  PersonalTab,
  SummaryTab,
  ExperienceTab,
  EducationTab,
  SkillsTab,
  LanguagesTab,
  ProjectsTab,
  ExtraTab,
} from "./tabs"
import { PhotoControls } from "./components/photo-controls"
import {
  Card, CardContent,
} from "@/components/ui/card"

const VALID_EDITOR_TABS = [
  "personal",
  "summary",
  "experience",
  "education",
  "skills",
  "languages",
  "projects",
  "extra",
] as const satisfies readonly EditorSectionTab[]

const TAB_LABEL_KEY: Record<EditorSectionTab, EditorLabelKey> = {
  personal: "tabPersonal",
  summary: "tabSummary",
  experience: "tabExperience",
  education: "tabEducation",
  skills: "tabSkills",
  languages: "tabLanguages",
  projects: "tabProjects",
  extra: "tabMore",
}

const TAB_ICON: Record<EditorSectionTab, React.ReactNode> = {
  personal: <SquareUser className="size-4" />,
  summary: <Text className="size-4" />,
  experience: <Briefcase className="size-4" />,
  education: <GraduationCap className="size-4" />,
  skills: <Wrench className="size-4" />,
  languages: <Languages className="size-4" />,
  projects: <FolderKanban className="size-4" />,
  extra: <LayoutList className="size-4" />,
}

const TAB_TRIGGER_CLASS =
  "!h-auto flex-col items-center justify-center rounded-lg px-2 py-2.5 text-sm font-bold transition-all gap-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-border/80 data-[state=active]:border data-[state=inactive]:border data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground/80 data-[state=inactive]:hover:bg-muted/60"

function StatusDot({ tab }: { tab: EditorSectionTab }) {
  const cvData = useCvStore((s) => s.cvData)
  const status = sectionStatus(tab, cvData)
  if (status === "empty") return null
  const label = status === "complete" ? "Complete" : "Partially filled"
  const color = status === "complete" ? "bg-emerald-500" : "bg-amber-500"
  return <span role="img" aria-label={label} title={label} className={`ml-1 inline-block size-1.5 rounded-full ${color}`} />
}

export function CvEditor() {
  const setUi = useCvStore((s) => s.setUi)
  const editorTab = useCvStore((s) => s.ui.editorTab)
  const locale = useCvStore((s) => s.ui.locale)

  const activeTab = VALID_EDITOR_TABS.includes(editorTab) ? editorTab : "personal"

  useEffect(() => {
    if (!VALID_EDITOR_TABS.includes(editorTab)) {
      setUi((u) => ({ ...u, editorTab: "personal" }))
    }
  }, [editorTab, setUi])

  return (
    <div className="max-h-[min(70vh,calc(100vh-9rem))] overflow-y-auto overflow-x-hidden pr-2 lg:max-h-none lg:h-full lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
      <div className="space-y-4 px-4 pb-8 pt-4">
        <Card className="border-border/70 bg-muted/15 shadow-sm">
          <CardContent className="pb-3">
            <PhotoControls />
          </CardContent>
        </Card>
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setUi((u) => ({ ...u, editorTab: v as EditorSectionTab }))
          }
          className="space-y-3"
        >
          <TabsList className="grid !h-auto grid-cols-4 gap-1 rounded-xl bg-muted/40 p-1.5">
            {VALID_EDITOR_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className={TAB_TRIGGER_CLASS}>
                {TAB_ICON[tab]}
                <span className="flex items-center gap-1">
                  {editorLabel(TAB_LABEL_KEY[tab], locale)}
                  <StatusDot tab={tab} />
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="personal" className="mt-4 space-y-3">
            <PersonalTab />
          </TabsContent>
          <TabsContent value="summary" className="mt-4 space-y-3">
            <SummaryTab />
          </TabsContent>
          <TabsContent value="experience" className="mt-4 space-y-3">
            <ExperienceTab />
          </TabsContent>
          <TabsContent value="education" className="mt-4 space-y-3">
            <EducationTab />
          </TabsContent>
          <TabsContent value="skills" className="mt-4 space-y-3">
            <SkillsTab />
          </TabsContent>
          <TabsContent value="languages" className="mt-4 space-y-3">
            <LanguagesTab />
          </TabsContent>
          <TabsContent value="projects" className="mt-4 space-y-3">
            <ProjectsTab />
          </TabsContent>
          <TabsContent value="extra" className="mt-4 space-y-3">
            <ExtraTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
