import Hero from "@/components/(landing-page)/hero"
import Aboutus from "@/components/(landing-page)/aboutus"
import Navbar from "@/components/(landing-page)/navbar"
import Growth from "@/components/(landing-page)/growth"
import Services from "@/components/(landing-page)/services"

export default function Home() {
  return (
    <div className="bg-[#EADFCF] lg:gap-[5px]">
      <Navbar />
      <Hero />
      <Growth/>
      <Aboutus/>
      <Services/>

    </div>
  )
}
