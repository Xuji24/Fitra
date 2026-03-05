import Navbar from "@/components/navbar";
import HeroSection from "./component/hero-section";
import WhyJoinUs from "./component/why-join-us";
import Community from "./component/community";
import Sponsor from "./component/sponsor";
import CTASection from "./component/cta-section";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div>
      <Navbar />
      <HeroSection isLoggedIn={isLoggedIn} />
      <WhyJoinUs />
      <Community />
      <Sponsor />
      <CTASection isLoggedIn={isLoggedIn} />
    </div>
  );
}