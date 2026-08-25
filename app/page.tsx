import Hero from "@/components/(landing-page)/hero"
import Solutions from "@/components/(landing-page)/solutions"
import Navbar from "@/components/(landing-page)/navbar"
import Growth from "@/components/(landing-page)/growth"
import Services from "@/components/(landing-page)/services"
import AboutMe from "@/components/(landing-page)/aboutMe"
import Footer from "@/components/(landing-page)/footer"
import { getCurrentUser } from "@/lib/auth"

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="bg-[#EADFCF] lg:gap-[5px]">
      <Navbar isLoggedIn={!!user} />
      <Hero />
      <Growth />
      <Solutions />
      <AboutMe />
      <Services />
      <Footer />
    </div>
  )
}
