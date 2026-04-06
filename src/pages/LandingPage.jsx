import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/landing/HeroSection';
import CardCarousel from '../components/landing/CardCarousel';

export default function LandingPage({ onOpenLogin }) {
  return (
    <div className="bg-kraft min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[1600px] h-screen flex flex-col relative overflow-hidden">
        <Navbar onOpenLogin={onOpenLogin} />
        
        <div className="flex-1 flex flex-row items-center w-full">
          {/* Left part: text area */}
          <div className="w-5/12 h-full flex items-center pr-8 pl-[4vw]">
            <HeroSection />
          </div>

          {/* Right part: sliding carousel */}
          <div className="w-7/12 h-full flex items-center">
            <CardCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
