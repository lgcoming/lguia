import type { Metadata } from "next";

import { getDictionary } from "@/i18n/dictionaries";
import { NotFoundView } from "@/views/not-found/not-found-view";

export const metadata: Metadata = {
  title: getDictionary("es").notFound.metaTitle,
};

export default function NotFound() {
  return <NotFoundView locale="es" />;
}
