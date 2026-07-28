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

export default function Companies() {
  return (
    <>
      <Navbar />
      <EnterpriseHero />
      <TalentTelemetry />
      <PlatformCapabilities />
      <HiringFlow />
      <Certifications />
      <ClientStories />
      <EnterpriseEconomics />
      <EnterpriseFAQ />
      <ContactTerminal mode="enterprise" />
      <Footer />
    </>
  );
}
