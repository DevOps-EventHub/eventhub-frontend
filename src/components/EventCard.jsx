import { CalendarDays, MapPin, Pencil } from 'lucide-react';
import PropTypes from 'prop-types';

const categoryFallbackImages = {
  tecnologia: new URL('../assets/events/tech-summit.svg', import.meta.url).href,
  design: new URL('../assets/events/design-workshop.svg', import.meta.url).href,
  networking: new URL('../assets/events/networking-gala.svg', import.meta.url).href,
  financas: new URL('../assets/events/future-cities-expo.svg', import.meta.url).href,
  saude: new URL('../assets/events/wellness-day.svg', import.meta.url).href,
};
const defaultFallbackImage = new URL('../assets/events/strategy-retreat.svg', import.meta.url).href;

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function normalizeCategory(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();
}

function isValidImageUrl(value) {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === 'null' || normalized === 'undefined') return false;
  return true;
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
  const fallbackImage = categoryFallbackImages[normalizeCategory(event.category)] || defaultFallbackImage;
  const cardImage = isValidImageUrl(imageUrl) ? imageUrl.trim() : fallbackImage;
  const statusClass = event.status && event.status.toLowerCase() === 'rascunho'
    ? 'status-draft'
    : event.status && event.status.toLowerCase() === 'cancelado'
      ? 'status-cancelled'
      : '';

  return (
    <article className="cartao-evento">
      {showImageSection && (
        <div className="imagem-evento">
          {cardImage && (
            <img
              src={cardImage}
              alt={event.title}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = defaultFallbackImage;
              }}
            />
          )}
          {event.status && <span className={`selo-status ${statusClass}`}>{event.status}</span>}
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
