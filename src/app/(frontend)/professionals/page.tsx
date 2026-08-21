import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import ProfessionalHero from "@components/ProfessionalHero";
import MarketTelemetry from "@components/MarketTelemetry";
import CareerClimb from "@components/CareerClimb";
import AdvocacyProtocol from "@components/AdvocacyProtocol";
import HistoricalTelemetry from "@components/HistoricalTelemetry";
import VideoTelemetry from "@components/VideoTelemetry";
import SystemDocumentation from "@components/SystemDocumentation";
import PricingReferral from "@components/PricingReferral";
import ContactTerminal from "@components/ContactTerminal";
import Footer from "@components/Footer";
import {
  getTestimonialVideos,
  getFaqsContent,
  getSiteSettingsContent,
  getTrackRecordContent,
} from "@/lib/content";
import { metadataFromSettings } from "@/lib/seo";
import { JsonLd, faqSchema } from "@/lib/structuredData";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent();
  return metadataFromSettings(settings.seo, {
    title: "For Professionals · find & hire",
    description:
      "Get verified once, then get routed to roles that match your actual skills — no job-board spray, no recruiter noise.",
    path: "/professionals",
  });
}

export default async function Professionals() {
  const [videos, faqs, settings, trackRecord] = await Promise.all([
    getTestimonialVideos(),
    getFaqsContent("professionals"),
    getSiteSettingsContent(),
    getTrackRecordContent(),
  ]);

  return (
    <>
      <Navbar ctaLabel={settings.navCtaLabel} />
      <ProfessionalHero />
      <MarketTelemetry />
      <CareerClimb />
      <AdvocacyProtocol />
      <HistoricalTelemetry
        stats={trackRecord.stats}
        growth={trackRecord.growth}
      />
      <VideoTelemetry items={videos} />
      <PricingReferral />
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      <SystemDocumentation items={faqs} />
      <ContactTerminal />
      <Footer settings={settings} />
    </>
  );
}
