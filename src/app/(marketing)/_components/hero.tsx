import { Check } from "lucide-react";

import { ScrollVideoHero } from "@/components/media/scroll-video-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout-primitives";

const reassurances = [
  "Gratis y sin compromiso",
  "11 preguntas, unos 3 minutos",
  "Resultado al momento",
];

/**
 * Home hero (SPEC-003 §1). On desktop the footage is scrubbed by scroll while the stage stays
 * pinned: the opening stack gives way to the video, then a closing line. Text over footage uses
 * white and ash-veil only: silver fails contrast on the bright wave.
 */
export function Hero() {
  return (
    <ScrollVideoHero
      labelledBy="hero-titulo"
      video={{
        src: "/media/video/hero-connections.mp4",
        poster: "/media/video/hero-connections-poster.jpg",
      }}
      outro={
        <Container width="text" className="text-center">
          <p className="text-[2.5rem] leading-[1.06] font-semibold tracking-[-0.022em] text-balance md:text-display lg:text-display-xl">
            Tu web, tus procesos y la IA, por fin conectados.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-subheading text-ash-veil">
            Diseñamos cada pieza para que trabaje con las demás, sin herramientas sueltas.
          </p>
        </Container>
      }
    >
      <Container width="text" className="pt-28 pb-24 text-center">
        <p className="animate-fade-up text-footnote font-semibold text-ash-veil sm:text-subheading">
          Agencia digital para pymes y negocios locales
        </p>
        <h1
          id="hero-titulo"
          className="mt-4 text-[2.375rem] leading-[1.06] tracking-[-0.022em] text-balance max-[399px]:text-[2rem] max-[399px]:hyphens-auto sm:text-display md:text-[4rem] lg:text-display-xl"
        >
          Webs, automatizaciones e IA que resuelven problemas reales de tu negocio
        </h1>
        <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-body text-ash-veil [animation-delay:120ms] sm:text-subheading">
          Ayudamos a pymes y negocios locales a conseguir más clientes desde su web, ahorrar horas
          en tareas repetitivas y usar la inteligencia artificial solo donde aporta valor.
        </p>
        <div className="mt-10 flex w-full animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:200ms] sm:w-auto sm:flex-row">
          <ButtonLink href="/diagnostico-digital" size="lg" className="w-full sm:w-auto">
            Haz tu diagnóstico digital
          </ButtonLink>
          <ButtonLink href="/servicios" variant="glass" size="lg" className="w-full sm:w-auto">
            Ver servicios
          </ButtonLink>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-footnote text-ash-veil">
          {reassurances.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <Check aria-hidden="true" className="size-4 text-sky-signal" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </ScrollVideoHero>
  );
}
