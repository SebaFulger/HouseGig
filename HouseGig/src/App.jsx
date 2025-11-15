import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from "./Header"
// import Footer from "./Footer"
import Explore from "./pages/Explore"
import Profile from "./pages/Profile";
import ListingDetails from "./pages/ListingDetails";
import Collections from "./pages/Collections";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Upload from "./pages/Upload";

function AnimatedRoutes() {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Reset ready state on location change
    setIsReady(false);
    
    // Set a timeout for maximum 1 second wait
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    // Check if page is loaded
    const checkLoad = () => {
      if (document.readyState === 'complete') {
        setIsReady(true);
        clearTimeout(timeout);
      }
    };

    // If already loaded, trigger immediately
    if (document.readyState === 'complete') {
      setIsReady(true);
      clearTimeout(timeout);
    } else {
      // Otherwise wait for load event
      window.addEventListener('load', checkLoad);
    }

    // Use a small delay to ensure content is rendered
    const renderTimeout = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => {
      clearTimeout(timeout);
      clearTimeout(renderTimeout);
      window.removeEventListener('load', checkLoad);
    };
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname + location.search}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 10 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Explore />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <MantineProvider>
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
    </MantineProvider>
  );
}

export default App;
