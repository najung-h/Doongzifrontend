import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import ChecklistPage from './pages/ChecklistPage';
import ScanPage from './pages/ScanPage';
import MyPage from './pages/MyPage';
import SearchPage from './pages/SearchPage';
import { FloatingChatButton } from './components/FloatingChatButton';
import './styles/globals.css';

function AppContent() {
  const location = useLocation();
  const hideChatButton = location.pathname === '/chatbot';

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      
      {/* Floating Chat Button - hidden on chatbot page */}
      {!hideChatButton && <FloatingChatButton hasNotification={true} />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
