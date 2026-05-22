import { Plus } from 'lucide-react';

function getInitial(name) {
  const trimmed = (name ?? '').trim();
  if (!trimmed) return 'U';
  return trimmed.charAt(0).toUpperCase();
}

export function AppHeader({ activeTab, onTabChange, isAdmin, user, onLogout, onCreateEvent }) {
  return (
    <header className="topo">
      <a className="marca" href="#">EventHub</a>
      <nav aria-label="Navegacao principal">
        <a className={activeTab === 'discover' ? 'ativo' : ''} href="#" onClick={() => onTabChange('discover')}>Descobrir</a>
        <a className={activeTab === 'manage' ? 'ativo' : ''} href="#" onClick={() => onTabChange('manage')}>Gerenciar</a>
      </nav>
      <div className="acoes-topo">
        {isAdmin && activeTab === 'discover' && <button className="botao-criar" onClick={onCreateEvent}><Plus size={18} />Criar Evento</button>}
        <button className="botao-sair" onClick={onLogout}>Sair</button>
        <div className="avatar" aria-label="Perfil do usuario">{getInitial(user?.name)}</div>
      </div>
    </header>
  );
}
