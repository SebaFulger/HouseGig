import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <MantineProvider>
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
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/listing/:id" element={<ListingDetails />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/upload" element={<Upload />} />
            </Routes>
          </div>
        </div>
        {/* Footer is now handled per-page, not globally */}
      </Router>
    </MantineProvider>
  );
}

export default App;
