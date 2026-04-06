import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onOpenLogin }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = user?.email?.charAt(0).toUpperCase() || '';

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <nav className="relative z-10 flex w-full items-center justify-between px-10 py-8">
      <div
        onClick={() => navigate('/')}
        className="absolute left-3 -top-6 cursor-pointer transition-opacity hover:opacity-80"
      >
        <img
          src="/branding/logo.png"
          alt="Beauty Hue"
          className="h-[132px] w-auto object-contain md:h-[176px]"
        />
      </div>

      <div className="ml-auto">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DC2626] text-lg font-bold text-white shadow-md transition-transform hover:scale-105"
            >
              {initial}
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-14 w-48 overflow-hidden rounded-xl border border-white/60 bg-white/95 shadow-xl backdrop-blur-xl">
                <div className="border-b border-navy/10 px-4 py-3">
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-navy transition-colors hover:bg-kraft/30"
                >
                  个人中心
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-navy transition-colors hover:bg-kraft/30"
                >
                  历史报告
                </button>
                <div className="border-t border-navy/10" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onOpenLogin} className="glass-btn px-8">
            登录
          </button>
        )}
      </div>
    </nav>
  );
}
