import { notFound } from "next/navigation";

// Funnel any unmatched top-level path into the (frontend) group's not-found
// boundary so it renders with the site layout + styled 404 (route groups have
// no shared root layout, so Next's default 404 would show otherwise).
export default function CatchAll() {
  notFound();
}
