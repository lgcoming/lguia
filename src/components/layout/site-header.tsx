import { HeaderShell } from "@/components/layout/header-shell";
import { Logo } from "@/components/layout/logo";
import { MainNav } from "@/components/layout/main-nav";
import { mainNav } from "@/lib/site";

export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="mx-auto flex h-13 w-full max-w-grid items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo variant="adaptive" height={26} />
        <MainNav items={mainNav} />
      </div>
    </HeaderShell>
  );
}
