import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/ui/Layouts';
import PublicView from './pages/PublicView';
import AdminView from './pages/AdminView';

const App: React.FC = () => {
  const [isScreenshotMode, setScreenshotMode] = useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50 font-sans selection:bg-primary/30">
        <Navbar hidden={isScreenshotMode} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<PublicView setScreenshotMode={setScreenshotMode} isScreenshotMode={isScreenshotMode} />} />
            <Route path="/admin" element={<AdminView />} />
          </Routes>
        </div>
        <Footer hidden={isScreenshotMode} />
      </div>
    </HashRouter>
  );
};

export default App;