import { CalendarDays, MapPin, Pencil } from 'lucide-react';
import PropTypes from 'prop-types';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function EventCard({
  mode = 'discover',
  event,
  imageUrl,
  footerLabel,
  onPrimaryAction,
  primaryActionLabel,
  onEdit,
}) {
  const showImageSection = mode === 'discover' || mode === 'saved';

  return (
    <article className="cartao-evento">
      {showImageSection && (
        <div className="imagem-evento">
          {imageUrl && <img src={imageUrl} alt={event.title} />}
          {event.status && <span className="selo-status">{event.status}</span>}
          {onEdit && (
            <button
              type="button"
              className="botao-editar"
              aria-label="Editar evento"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil size={18} />
            </button>
          )}
        </div>
      )}

      <div className="conteudo-evento">
        <div className="linha-meta">
          {event.category && <span className="etiqueta">{event.category}</span>}
          <span className="meta">
            <CalendarDays size={14} />
            {formatDate(event.startAt)}
          </span>
        </div>

        <h2>{event.title}</h2>
        {event.description && <p>{event.description}</p>}

        <span className="local">
          <MapPin size={16} />
          {event.location}
        </span>

        <div className="rodape-cartao">
          <strong>{footerLabel}</strong>
          <button onClick={onPrimaryAction}>{primaryActionLabel}</button>
        </div>
      </div>
    </article>
  );
}

EventCard.propTypes = {
  mode: PropTypes.oneOf(['discover', 'saved']),
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    location: PropTypes.string.isRequired,
    startAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    status: PropTypes.string,
  }).isRequired,
  imageUrl: PropTypes.string,
  footerLabel: PropTypes.string.isRequired,
  onPrimaryAction: PropTypes.func.isRequired,
  primaryActionLabel: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
};

EventCard.defaultProps = {
  mode: 'discover',
  imageUrl: '',
  onEdit: undefined,
};
