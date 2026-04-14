import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Section, SectionHeader } from "./section"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel, type EditorLabelKey } from "@/lib/editor-labels"

type Faq = { qKey: EditorLabelKey; aKey: EditorLabelKey }

const FAQS: Faq[] = [
  { qKey: "landing_faq_free_q", aKey: "landing_faq_free_a" },
  { qKey: "landing_faq_data_q", aKey: "landing_faq_data_a" },
  { qKey: "landing_faq_german_q", aKey: "landing_faq_german_a" },
  { qKey: "landing_faq_ats_q", aKey: "landing_faq_ats_a" },
  { qKey: "landing_faq_offline_q", aKey: "landing_faq_offline_a" },
  { qKey: "landing_faq_formats_q", aKey: "landing_faq_formats_a" },
  { qKey: "landing_faq_devices_q", aKey: "landing_faq_devices_a" },
  { qKey: "landing_faq_multiple_q", aKey: "landing_faq_multiple_a" },
]

export function FaqSection() {
  const locale = useLocale()

  return (
    <Section id="faq">
      <SectionHeader
        eyebrow={editorLabel("landing_faqEyebrow", locale)}
        title={editorLabel("landing_faqTitle", locale)}
      />

      <div className="mx-auto max-w-3xl">
        <Accordion
          type="single"
          collapsible
          className="rounded-2xl border border-border/70 bg-card/80 px-5 shadow-sm md:px-6"
        >
          {FAQS.map((faq, i) => (
            <AccordionItem key={faq.qKey} value={`item-${i}`}>
              <AccordionTrigger className="text-base font-semibold">
                {editorLabel(faq.qKey, locale)}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {editorLabel(faq.aKey, locale)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  )
}
