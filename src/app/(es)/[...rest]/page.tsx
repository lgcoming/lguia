import { notFound } from "next/navigation";

/**
 * Catches every URL that no other route of this language matches and renders its
 * not-found.tsx inside the right root layout, with a 404 status (SPEC-009).
 */
export default function UnmatchedPage() {
  notFound();
}
