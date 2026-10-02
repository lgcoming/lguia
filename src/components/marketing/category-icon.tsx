import { Bot, MonitorSmartphone, Search, Workflow, type LucideIcon } from "lucide-react";

import type { CategoryIconKey } from "@/types/catalog";

const icons: Record<CategoryIconKey, LucideIcon> = {
  web: MonitorSmartphone,
  automation: Workflow,
  ai: Bot,
  search: Search,
};

export function CategoryIcon({ icon, className }: { icon: CategoryIconKey; className?: string }) {
  const Icon = icons[icon];
  return <Icon aria-hidden="true" className={className} />;
}
