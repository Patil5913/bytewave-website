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
import {
  getPlacements,
  getSiteStats,
  getPosts,
  getHomepageContent,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [placements, stats, posts, home] = await Promise.all([
    getPlacements(),
    getSiteStats(),
    getPosts(),
    getHomepageContent(),
  ]);

  return (
    <>
      <Navbar />
      <Hero content={home} />
      <Manifesto content={home} />
      <AgentIntro content={home} />
      <Stats stats={stats} />
      <Gateways />
      <ScrollStory content={home} />
      <PlacementFeed items={placements} />
      <Insights posts={posts} />
      <CallToAction content={home} />
      <Footer />
    </>
  );
}
