import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import EnterpriseHero from "@components/EnterpriseHero";
import TalentTelemetry from "@components/TalentTelemetry";
import PlatformCapabilities from "@components/PlatformCapabilities";
import HiringFlow from "@components/HiringFlow";
import Certifications from "@components/Certifications";
import ClientStories from "@components/ClientStories";
import EnterpriseFAQ from "@components/EnterpriseFAQ";
import EnterpriseEconomics from "@components/EnterpriseEconomics";
import ContactTerminal from "@components/ContactTerminal";
import Footer from "@components/Footer";
import {
  getCertificationsContent,
  getFaqsContent,
  getTestimonialQuotes,
  getSiteSettingsContent,
} from "@/lib/content";
import { metadataFromSettings } from "@/lib/seo";
import { JsonLd, faqSchema } from "@/lib/structuredData";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent();
  return metadataFromSettings(settings.seo, {
    title: "For Companies · find & hire",
    description:
      "Hire pre-verified specialists. Every candidate clears a domain assessment and a strategy call before you see the profile.",
    path: "/companies",
  });
}

export default async function Companies() {
  const [certs, faqs, quotes, settings] = await Promise.all([
    getCertificationsContent(),
    getFaqsContent("companies"),
    getTestimonialQuotes(),
    getSiteSettingsContent(),
  ]);

  return (
    <>
      <Navbar ctaLabel={settings.navCtaLabel} />
      <EnterpriseHero />
      <TalentTelemetry />
      <PlatformCapabilities />
      <HiringFlow />
      <Certifications items={certs} />
      <ClientStories items={quotes} />
      <EnterpriseEconomics />
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      <EnterpriseFAQ items={faqs} />
      <ContactTerminal mode="enterprise" />
      <Footer settings={settings} />
    </>
  );
}
