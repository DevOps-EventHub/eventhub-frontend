import { Plus } from 'lucide-react';
import PropTypes from 'prop-types';

function getInitial(name) {
  const trimmed = (name ?? '').trim();
  if (!trimmed) return 'U';
  return trimmed.charAt(0).toUpperCase();
}

export function AppHeader({ activeTab, onTabChange, isAdmin, user, onLogout, onCreateEvent }) {
  return (
    <header className="topo">
      <button type="button" className="marca" onClick={() => onTabChange('discover')}>EventHub</button>
      <nav aria-label="Navegacao principal">
        <button type="button" className={activeTab === 'discover' ? 'ativo' : ''} onClick={() => onTabChange('discover')}>Descobrir</button>
        <button type="button" className={activeTab === 'manage' ? 'ativo' : ''} onClick={() => onTabChange('manage')}>Gerenciar</button>
      </nav>
      <div className="acoes-topo">
        {isAdmin && activeTab === 'discover' && <button className="botao-criar" onClick={onCreateEvent}><Plus size={18} />Criar Evento</button>}
        <button className="botao-sair" onClick={onLogout}>Sair</button>
        <div className="avatar" aria-label="Perfil do usuario">{getInitial(user?.name)}</div>
      </div>
    </header>
  );
}

AppHeader.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
  onCreateEvent: PropTypes.func.isRequired,
};

AppHeader.defaultProps = {
  user: null,
};
