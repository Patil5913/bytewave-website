import Navbar from "@components/Navbar";
import Hero from "@components/Hero";
import Manifesto from "@components/Manifesto";
import AgentIntro from "@components/AgentIntro";
import Stats from "@components/Stats";
import Gateways from "@components/Gateways";
import ScrollStory from "@components/ScrollStory";
import PlacementFeed from "@components/PlacementFeed";
import Insights from "@components/Insights";
import CallToAction from "@components/CallToAction";
import Footer from "@components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Manifesto />
      <AgentIntro />
      <Stats />
      <Gateways />
      <ScrollStory />
      <PlacementFeed />
      <Insights />
      <CallToAction />
      <Footer />
    </>
  );
}
