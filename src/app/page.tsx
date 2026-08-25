import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { RunHistory } from "@/components/sections/RunHistory";
import { BossFights } from "@/components/sections/BossFights";
import { Stats } from "@/components/sections/Stats";
import { Inventory } from "@/components/sections/Inventory";
import { Achievements } from "@/components/sections/Achievements";
import { Continue } from "@/components/sections/Continue";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <RunHistory />
      <BossFights />
      <Stats />
      <Inventory />
      <Achievements />
      <Continue />
    </>
  );
}
