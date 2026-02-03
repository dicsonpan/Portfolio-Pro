
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/ui/Layouts';
import PublicView from './pages/PublicView';
import AdminView from './pages/AdminView';
import Auth from './pages/Auth';
import { authService } from './services/authService';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<any>(null);

   React.useEffect(() => {
     authService.getUser().then(u => {
       setUser(u);
       setLoading(false);
     });
   }, []);

   if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;
   if (!user) return <Navigate to="/auth" replace />;

   return <>{children}</>;
};

const App: React.FC = () => {
  const [isScreenshotMode, setScreenshotMode] = useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50 font-sans selection:bg-primary/30">
        <Navbar hidden={isScreenshotMode} />
        <div className="flex-grow">
          <Routes>
            {/* Root displays the 'Site Resume' (Default) */}
            <Route path="/" element={<PublicView setScreenshotMode={setScreenshotMode} isScreenshotMode={isScreenshotMode} />} />
            
            {/* User path for specific resumes e.g. /p/dicsonpan */}
            <Route path="/p/:username" element={<PublicView setScreenshotMode={setScreenshotMode} isScreenshotMode={isScreenshotMode} />} />
            
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminView />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <Footer hidden={isScreenshotMode} />
      </div>
    </HashRouter>
  );
};

export default App;