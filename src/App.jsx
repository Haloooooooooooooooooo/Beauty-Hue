import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPanel from './components/auth/LoginPanel';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import SharePage from './pages/SharePage';
import HistoryPage from './pages/HistoryPage';
import HistoryReportPage from './pages/HistoryReportPage';

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
          <Route path="/share" element={<SharePage onOpenLogin={() => setIsLoginOpen(true)} />} />
          <Route path="/r/:shareId" element={<SharePage onOpenLogin={() => setIsLoginOpen(true)} />} />
          <Route path="/history" element={<HistoryPage onOpenLogin={() => setIsLoginOpen(true)} />} />
          <Route path="/history-report" element={<HistoryReportPage onOpenLogin={() => setIsLoginOpen(true)} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}