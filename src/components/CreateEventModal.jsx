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
