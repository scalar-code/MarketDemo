import { CartProvider } from "@/components/Cart";
import CTA from "@/components/CTA";
import Cursor from "@/components/Cursor";
import Flavors from "@/components/Flavors";
import Footer from "@/components/Footer";
import Grain from "@/components/Grain";
import HeroStory from "@/components/HeroStory";
import Ingredients from "@/components/Ingredients";
import Manifesto from "@/components/Manifesto";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import Products from "@/components/Products";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <CartProvider>
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <HeroStory />
        <Marquee />
        <Manifesto />
        <Products />
        <Flavors />
        <Stats />
        <Ingredients />
        <Marquee reverse tone="dark" />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <Grain />
    </CartProvider>
  );
}
