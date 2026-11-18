import { Header } from "@/components/layout/Header";
import { Loader } from "@/components/layout/Loader";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { Marquee, Story } from "@/components/sections/Story";
import { Freshness } from "@/components/sections/Freshness";
import { Menu } from "@/components/sections/Menu";
import { Signatures } from "@/components/sections/Signatures";
import { Cakes } from "@/components/sections/Cakes";
import { Gallery } from "@/components/sections/Gallery";
import { Visit } from "@/components/sections/Visit";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { MotionDirector } from "@/components/motion/MotionDirector";
import { CursorBadge } from "@/components/motion/CursorBadge";
import { ReviewBanner } from "@/lib/review";

export default function Home() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <Header />
      <ReviewBanner />
      <main id="main">
        <Hero />
        <Marquee />
        <Story />
        <Freshness />
        <Signatures />
        <Menu />
        <Cakes />
        <Gallery />
        <Visit />
      </main>
      <Footer />
      <MobileCallBar />
      <CursorBadge />
      <MotionDirector />
    </>
  );
}
