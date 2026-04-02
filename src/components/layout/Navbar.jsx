import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full flex justify-between items-center px-10 py-8 z-10 relative">
      <div 
        onClick={() => navigate('/')} 
        className="text-4xl font-black text-navy tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
      >
        Beauty Hue
      </div>
      <button className="glass-btn px-8">
        Login
      </button>
    </nav>
  );
}
