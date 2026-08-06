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

export const dynamic = "force-dynamic";

export default async function Professionals() {
  const [videos, faqs, settings, trackRecord] = await Promise.all([
    getTestimonialVideos(),
    getFaqsContent("professionals"),
    getSiteSettingsContent(),
    getTrackRecordContent(),
  ]);

  return (
    <>
      <Navbar />
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
      <SystemDocumentation items={faqs} />
      <ContactTerminal />
      <Footer settings={settings} />
    </>
  );
}
