import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import Header from "./Header"
// import Footer from "./Footer"
import Explore from "./pages/Explore"
import Profile from "./pages/Profile";
import ListingDetails from "./pages/ListingDetails";
import Collections from "./pages/Collections";
import Collection from "./pages/Collection";
import Messages from "./pages/Messages";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Upload from "./pages/Upload";
import EditListing from "./pages/EditListing";

function AnimatedRoutes() {
  const location = useLocation();

  return (
        <Routes location={location}>
          <Route path="/" element={<Explore />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/listing/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="/collection/:id" element={<ProtectedRoute><Collection /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        </Routes>
  );
}

function App() {
  return (
    <MantineProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Header />
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              <AnimatedRoutes />
            </div>
          </div>
          {/* Footer is now handled per-page, not globally */}
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </MantineProvider>
  );
}

export default App;
