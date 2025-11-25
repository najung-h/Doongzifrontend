import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import ChecklistPage from './pages/ChecklistPage';
import ScanPage from './pages/ScanPage';
import MyPage from './pages/MyPage';
import SearchPage from './pages/SearchPage';

function AppContent() {
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
