import PropTypes from 'prop-types';

export function CreateEventModal({
  isOpen,
  form,
  categories,
  minDateTime,
  isSavingEvent,
  modalError,
  onClose,
  onSubmit,
  onFormChange,
  onImageChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={onSubmit}>
        <h3>Criar Evento</h3>

        <input
          placeholder="Title"
          value={form.title}
          onChange={(event) => onFormChange('title', event.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(event) => onFormChange('description', event.target.value)}
        />

        <input
          list="categorias"
          placeholder="Category (select or type new)"
          value={form.categoryName}
          onChange={(event) => onFormChange('categoryName', event.target.value)}
          required
        />
        <datalist id="categorias">
          {categories.map((category) => (
            <option key={category.id} value={category.name} />
          ))}
        </datalist>

        <input
          placeholder="Location"
          value={form.location}
          onChange={(event) => onFormChange('location', event.target.value)}
          required
        />

        <input
          type="datetime-local"
          min={minDateTime}
          value={form.startAt}
          onChange={(event) => onFormChange('startAt', event.target.value)}
          required
        />

        <input
          type="datetime-local"
          min={form.startAt || minDateTime}
          value={form.endAt}
          onChange={(event) => onFormChange('endAt', event.target.value)}
          required
        />

        <input
          type="number"
          min="1"
          value={form.capacity}
          onChange={(event) => onFormChange('capacity', event.target.value)}
          placeholder="Capacity"
          required
        />

        <input type="file" accept="image/*" onChange={(event) => onImageChange(event.target.files?.[0] ?? null)} />

        <select value={form.status} onChange={(event) => onFormChange('status', event.target.value)}>
          <option>PUBLICADO</option>
          <option>RASCUNHO</option>
          <option>CANCELADO</option>
        </select>

        {modalError && <p style={{ color: '#b91c1c', margin: 0 }}>{modalError}</p>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="submit" disabled={isSavingEvent}>{isSavingEvent ? 'Criando...' : 'Criar Evento'}</button>
        </div>
      </form>
    </div>
  );
}

CreateEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  form: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    categoryName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    startAt: PropTypes.string.isRequired,
    endAt: PropTypes.string.isRequired,
    capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  minDateTime: PropTypes.string.isRequired,
  isSavingEvent: PropTypes.bool.isRequired,
  modalError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
};

CreateEventModal.defaultProps = {
  modalError: '',
};
