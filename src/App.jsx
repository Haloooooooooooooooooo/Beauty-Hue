import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPanel from './components/auth/LoginPanel';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <LoginPanel isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <Routes>
          <Route path="/" element={<LandingPage onOpenLogin={() => setIsLoginOpen(true)} />} />
          <Route path="/test" element={<TestPage onOpenLogin={() => setIsLoginOpen(true)} />} />
          <Route path="/result" element={<ResultPage onOpenLogin={() => setIsLoginOpen(true)} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
