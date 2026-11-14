import type { Metadata } from "next";

import { HomeView, homeMetadata } from "@/views/home/home-view";

export const metadata: Metadata = homeMetadata("en");

export default function Page() {
  return <HomeView locale="en" />;
}
