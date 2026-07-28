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
import { getPlacements, getSiteStats, getPosts } from "@/lib/content";

export default async function Home() {
  const [placements, stats, posts] = await Promise.all([
    getPlacements(),
    getSiteStats(),
    getPosts(),
  ]);

  return (
    <>
      <Navbar />
      <Hero />
      <Manifesto />
      <AgentIntro />
      <Stats stats={stats} />
      <Gateways />
      <ScrollStory />
      <PlacementFeed items={placements} />
      <Insights posts={posts} />
      <CallToAction />
      <Footer />
    </>
  );
}
