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

export default async function Companies() {
  const [certs, faqs, quotes, settings] = await Promise.all([
    getCertificationsContent(),
    getFaqsContent("companies"),
    getTestimonialQuotes(),
    getSiteSettingsContent(),
  ]);

  return (
    <>
      <Navbar />
      <EnterpriseHero />
      <TalentTelemetry />
      <PlatformCapabilities />
      <HiringFlow />
      <Certifications items={certs} />
      <ClientStories items={quotes} />
      <EnterpriseEconomics />
      <EnterpriseFAQ items={faqs} />
      <ContactTerminal mode="enterprise" />
      <Footer settings={settings} />
    </>
  );
}
