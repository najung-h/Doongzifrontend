import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './src/pages/HomePage';
import ChatbotPage from './src/pages/ChatbotPage';
import ChecklistPage from './src/pages/ChecklistPage';
import ScanPage from './src/pages/ScanPage';
import MyPage from './src/pages/MyPage';
import SearchPage from './src/pages/SearchPage';
import './src/styles/globals.css';

function AppContent() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/checklist" element={<ChecklistPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}