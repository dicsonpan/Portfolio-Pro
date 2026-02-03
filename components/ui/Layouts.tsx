import React from 'react';
import { HashLink } from 'react-router-hash-link'; 
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Monitor } from 'lucide-react';

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export const Section: React.FC<{ id?: string; className?: string; children: React.ReactNode }> = ({ id, className = '', children }) => (
  <section id={id} className={`py-12 md:py-20 ${className}`}>
    <Container>
      {children}
    </Container>
  </section>
);

interface NavbarProps {
  hidden?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ hidden = false }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (hidden) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-zinc-800 print:hidden">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
             <Link to="/" className="text-xl font-bold tracking-tighter text-white">
               Portfolio<span className="text-primary">.Pro</span>
             </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAdmin ? (
                 <>
                  <span className="text-zinc-400 text-sm font-medium mr-4">Admin Mode</span>
                  <Link to="/" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                    <Monitor size={16} /> View Site
                  </Link>
                 </>
              ) : (
                <>
                  <a href="#about" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                  <a href="#experience" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Experience</a>
                  <a href="#projects" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Projects</a>
                  <Link to="/admin" className="ml-4 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2">
                    <LayoutDashboard size={14} /> Admin
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export const Footer: React.FC<{hidden?: boolean}> = ({ hidden }) => {
  if (hidden) return null;
  return (
    <footer className="bg-zinc-950 py-12 border-t border-zinc-900 print:hidden">
      <Container className="text-center text-zinc-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Portfolio Pro. All rights reserved.</p>
      </Container>
    </footer>
  );
};