import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import NailArtTiers from "@/components/NailArtTiers";
import Gallery from "@/components/Gallery";
import RemovalRepair from "@/components/RemovalRepair";
import BookingPolicies from "@/components/BookingPolicies";
import FirstTimePerk from "@/components/FirstTimePerk";
import BookingWizard from "@/components/BookingWizard";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <NailArtTiers />
        <Gallery />
        <RemovalRepair />
        <BookingPolicies />
        <FirstTimePerk />
        <BookingWizard />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
