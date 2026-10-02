import type { PlanPricing } from "@/types/catalog";

const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEuro(amount: number): string {
  return euro.format(amount);
}

export function formatPlanPrice(pricing: PlanPricing): string {
  return pricing.kind === "from" ? `Desde ${formatEuro(pricing.amount)}` : pricing.label;
}
