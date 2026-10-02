import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/layout-primitives";

// Temporary home until the landing page (SPEC-003) is built.
export default function HomePage() {
  return (
    <Section labelledBy="inicio-titulo">
      <h1 id="inicio-titulo" className="text-h1 md:text-display">
        LGuIA
      </h1>
      <p className="mt-4 max-w-xl text-lead text-ink-soft">
        Webs, automatización e IA práctica para pymes y negocios locales.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/diagnostico-digital" size="lg">
          Haz tu diagnóstico digital
        </ButtonLink>
        <ButtonLink href="/servicios" variant="secondary" size="lg">
          Ver servicios
        </ButtonLink>
      </div>
    </Section>
  );
}
