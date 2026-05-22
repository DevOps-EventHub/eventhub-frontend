import { useEffect, useState } from 'react';
import './styles.css';
import './App.css';
import { AppHeader } from './components/AppHeader.jsx';
import { AppFooter } from './components/AppFooter.jsx';
import { useAuth } from './hooks/useAuth.js';
import { LoginPage } from './pages/LoginPage.jsx';
import { DiscoverPage } from './pages/DiscoverPage.jsx';
import { SavedEventsPage } from './pages/SavedEventsPage.jsx';
import { ManageEventsPage } from './pages/ManageEventsPage.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { user, checking, restoreSession, signIn, signOut } = useAuth();

  useEffect(() => { restoreSession(); }, []);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  if (checking) return <section className="estado">Validating session...</section>;
  if (!user) return <div className="aplicacao"><LoginPage onLogin={signIn} /></div>;

  return (
    <div className="aplicacao">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={isAdmin} user={user} onLogout={signOut} onCreateEvent={() => setOpenCreateModal(true)} />
      {activeTab === 'discover' && <DiscoverPage isAdmin={isAdmin} openCreateModal={openCreateModal} onOpenCreateModalChange={setOpenCreateModal} />}
      {activeTab === 'manage' && <ManageEventsPage isAdmin={isAdmin} />}
      {activeTab === 'saved' && <SavedEventsPage isAdmin={isAdmin} />}
      <AppFooter />
    </div>
  );
}
