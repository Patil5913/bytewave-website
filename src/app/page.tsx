import Navbar from "@components/Navbar";
import Hero from "@components/Hero";
import Manifesto from "@components/Manifesto";
import Stats from "@components/Stats";
import Gateways from "@components/Gateways";
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
      <div className="snap-container">
        <Stats />
        <Gateways />
        <PlacementFeed />
        <Insights />
        <CallToAction />
      </div>
      <Footer />
    </>
  );
}
