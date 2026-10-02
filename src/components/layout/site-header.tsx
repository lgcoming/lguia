import { Logo } from "@/components/layout/logo";
import { MainNav } from "@/components/layout/main-nav";
import { mainNav } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="relative mx-auto flex h-18 w-full max-w-content items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <MainNav items={mainNav} />
      </div>
    </header>
  );
}
