import Navbar from "@components/Navbar";
import ProfessionalHero from "@components/ProfessionalHero";
import MarketTelemetry from "@components/MarketTelemetry";
import AdvocacyProtocol from "@components/AdvocacyProtocol";
import HistoricalTelemetry from "@components/HistoricalTelemetry";
import VideoTelemetry from "@components/VideoTelemetry";
import SystemDocumentation from "@components/SystemDocumentation";
import PricingReferral from "@components/PricingReferral";
import ContactTerminal from "@components/ContactTerminal";
import Footer from "@components/Footer";

export default function Professionals() {
  return (
    <>
      <Navbar />
      <ProfessionalHero />
      <MarketTelemetry />
      <AdvocacyProtocol />
      <HistoricalTelemetry />
      <VideoTelemetry />
      <SystemDocumentation />
      <PricingReferral />
      <ContactTerminal />
      <Footer />
    </>
  );
}
