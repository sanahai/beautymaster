import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCards from "@/components/ServiceCards";
import Features from "@/components/Features";
import StatBanner from "@/components/StatBanner";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServiceCards />
        <Features />
        <StatBanner />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
