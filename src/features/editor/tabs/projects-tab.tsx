import { ProjectsEditor } from "./projects-editor"
import { VolunteerEditor } from "./volunteer-editor"
import { Separator } from "@/components/ui/separator"

export function ProjectsTab() {
  return (
    <div className="space-y-5">
      <ProjectsEditor />
      <Separator />
      <VolunteerEditor />
    </div>
  )
}
