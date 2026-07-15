import Hero from "@components/Hero";
import Manifesto from "@components/Manifesto";
import Stats from "@components/Stats";
import Gateways from "@components/Gateways";
import PlacementFeed from "@components/PlacementFeed";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Stats />
      <Gateways />
      <PlacementFeed />
    </>
  );
}
