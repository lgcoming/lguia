import { Check } from "lucide-react";

import { MediaBand } from "@/components/media/media-band";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout-primitives";

const reassurances = [
  "Gratis y sin compromiso",
  "11 preguntas, unos 3 minutos",
  "Resultado al momento",
];

/**
 * Full-viewport video hero. It slides under the translucent header (-mt-13 / pt-13) so the
 * glass bar sits on the footage; the header reads `data-nav-theme="dark"` and turns dark.
 * Text over footage uses white and ash-veil only: silver fails contrast on the bright wave.
 */
export function Hero() {
  return (
    <MediaBand
      labelledBy="hero-titulo"
      video={{
        src: "/media/video/hero-connections.mp4",
        poster: "/media/video/hero-connections-poster.jpg",
      }}
      eager
      overlay="hero"
      className="-mt-13"
    >
      <Container
        width="text"
        className="flex min-h-[max(38rem,100svh)] flex-col items-center justify-center pt-28 pb-24 text-center"
      >
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
    </MediaBand>
  );
}
