import { HeaderShell } from "@/components/layout/header-shell";
import { Logo } from "@/components/layout/logo";
import { MainNav } from "@/components/layout/main-nav";
import { mainNav } from "@/lib/site";

export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="mx-auto flex h-(--header-height) w-full max-w-grid items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* 28px in the 56px mobile bar, 32px in the 64px desktop bar: half the bar height. */}
        <Logo variant="adaptive" height={32} imageClassName="h-7 lg:h-8" />
        <MainNav items={mainNav} />
      </div>
    </HeaderShell>
  );
}
