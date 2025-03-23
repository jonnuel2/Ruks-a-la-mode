import HomeBanners from "./ui/home-banners";
import BestSeller from "./ui/best-seller";
import AboutUs from "./ui/about-us";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <HomeBanners />
      <BestSeller />
      <AboutUs />
    </div>
  );
}
