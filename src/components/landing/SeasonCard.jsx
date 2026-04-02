import { motion } from 'framer-motion';

export default function SeasonCard({ season }) {
  const baseColor = season.extremeColor || '#ffffff';
  const accentColor = season.dailyColor || season.extremeColor || '#ffffff';
  
  const gradientBackground = {
    background: `linear-gradient(135deg, ${baseColor}cc, ${accentColor}99, ${baseColor}66)`
  };


  return (
    <div className="glass-card w-[340px] h-[420px] flex-shrink-0 flex flex-col p-6 mx-4 relative group">
      <div className="z-10 mt-auto">
        <h3 className="text-2xl font-bold text-navy mb-1">{season.name}</h3>
        <p className="text-muted text-lg">{season.nameCN}</p>
      </div>
      
      {/* Abstract visual area - mimicking an elegant fluid shape or gradient blur */}
      <div className="absolute inset-0 top-0 left-0 w-full h-[60%] opacity-80 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-t-[24px]">
        <div 
          className="absolute inset-0 blur-[40px] scale-150 transform translate-y-[-20%] group-hover:translate-y-[-10%] transition-transform duration-700 ease-out" 
          style={gradientBackground} 
        />
      </div>
    </div>
  );
}
