import { LandingHeader } from "@/features/landing/landing-header"
import { Hero } from "@/features/landing/hero"
import { FeaturesSection } from "@/features/landing/features-section"
import { UseCasesSection } from "@/features/landing/use-cases-section"
import { TemplatesShowcase } from "@/features/landing/templates-showcase"
import { FreeSection } from "@/features/landing/free-section"
import { JsonExampleSection } from "@/features/landing/json-example-section"
import { FaqSection } from "@/features/landing/faq-section"
import { ContactSection } from "@/features/landing/contact-section"
import { FinalCta } from "@/features/landing/final-cta"
import { LandingFooter } from "@/features/landing/landing-footer"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground focus:shadow-md"
      >
        Skip to content
      </a>
      <LandingHeader />
      <main id="main" className="flex-1">
        <Hero />
        <FeaturesSection />
        <TemplatesShowcase />
        <UseCasesSection />
        <FreeSection />
        <JsonExampleSection />
        <FaqSection />
        <ContactSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
