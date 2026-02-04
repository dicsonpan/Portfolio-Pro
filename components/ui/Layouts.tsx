
import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Monitor, LogIn, LogOut, User } from 'lucide-react';
import { authService } from '../../services/authService';

// Logo Component
// Design: A geometric monogram combining 'N' and 'F'.
// Updated: 'N' (Next) is White. 'F' (Folio) bars are Green (#10b981).
const Logo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background: Dark rounded square (Zinc-900/950) */}
    <rect width="40" height="40" rx="8" fill="#18181b"/>
    
    {/* N Shape (White): Represents "Next" */}
    {/* Left Vertical Stem (Shared with F) */}
    <path d="M10 10H14V30H10Z" fill="white"/>
    {/* Diagonal and Right Vertical Stem */}
    <path d="M14 10L26 26V10H30V30H26L14 14V10Z" fill="white"/>
    
    {/* F Shape (Green): Represents "Folio" */}
    {/* Only the horizontal bars are green, overlaying the N */}
    <path d="M14 10H24V14H14Z M14 19H22V23H14Z" fill="#10b981"/> 
  </svg>
);

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
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    authService.getUser().then(setUser);
    const { data: { subscription } } = authService.getClient().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    navigate('/');
  };

  if (hidden) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-zinc-800 print:hidden">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-4">
             <Link to="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
               <Logo />
               <span>Next<span className="text-primary">Folio</span></span>
             </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {user ? (
                 <>
                   {/* Logged In State */}
                   <span className="text-zinc-500 text-xs truncate max-w-[150px]">{user.email}</span>
                   {location.pathname.startsWith('/admin') ? (
                       <Link to={`/p/${user.id}`} target="_blank" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                         <Monitor size={16} /> View My Site
                       </Link>
                   ) : (
                       <Link to="/admin" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                         <LayoutDashboard size={16} /> Dashboard
                       </Link>
                   )}
                   <button onClick={handleSignOut} className="text-zinc-400 hover:text-red-400 px-3 py-2 transition-colors">
                      <LogOut size={18} />
                   </button>
                 </>
              ) : (
                <>
                  {/* Public / Logged Out State */}
                  <Link to="/auth" className="text-zinc-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Features
                  </Link>
                  <Link to="/auth" className="ml-4 bg-primary hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2">
                    <LogIn size={14} /> Login / Register
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
        <p>&copy; {new Date().getFullYear()} NextFolio. All rights reserved.</p>
      </Container>
    </footer>
  );
};
