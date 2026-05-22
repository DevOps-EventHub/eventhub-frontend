import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import { EventCard } from '../components/EventCard.jsx';
import {
  atualizarEvento,
  listarCategorias,
  listarEventosSalvos,
  listarParticipantesEventoSalvo,
  removerEventoSalvo,
} from '../api/eventos.js';

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 16);
}

export function ManageEventsPage({ isAdmin }) {
  const [savedEvents, setSavedEvents] = useState([]);
  const [eventImages, setEventImages] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');

  async function loadSavedEvents() {
    const response = await listarEventosSalvos();
    setSavedEvents(response ?? []);
  }

  useEffect(() => {
    loadSavedEvents().catch((e) => setError(e.message));
    listarCategorias().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('eventhub_event_images');
      setEventImages(raw ? JSON.parse(raw) : {});
    } catch {
      setEventImages({});
    }
  }, []);

  async function handleOpenEditModal(event) {
    setSelectedEvent(event);
    const categoryId = categories.find((c) => c.name === event.category)?.id ?? '';
    setEditForm({
      id: event.eventId,
      title: event.title,
      description: event.description ?? '',
      categoryId,
      location: event.location,
      startAt: toDateInput(event.startAt),
      endAt: toDateInput(event.startAt),
      capacity: 100,
      status: 'PUBLICADO',
    });

    if (isAdmin) {
      try {
        const participantResponse = await listarParticipantesEventoSalvo(event.eventId);
        setParticipants(participantResponse ?? []);
      } catch {
        setParticipants([]);
      }
    }
  }

  function handleCloseModal() {
    setSelectedEvent(null);
    setEditForm(null);
    setParticipants([]);
  }

  async function handleUnsave(eventId) {
    try {
      await removerEventoSalvo(eventId);
      setSavedEvents((prev) => prev.filter((item) => item.eventId !== eventId));
      if (selectedEvent?.eventId === eventId) {
        handleCloseModal();
      }
    } catch (e) {
      setError(e.message || 'Falha ao dessalvar evento.');
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!isAdmin || !editForm) return;

    await atualizarEvento(editForm.id, {
      title: editForm.title,
      description: editForm.description,
      categoryId: Number(editForm.categoryId),
      location: editForm.location,
      startAt: new Date(editForm.startAt).toISOString(),
      endAt: new Date(editForm.endAt).toISOString(),
      capacity: Number(editForm.capacity),
      status: editForm.status,
    });

    await loadSavedEvents();
    handleCloseModal();
  }

  return (
    <main>
      <section className="cabecalho-busca">
        <h1>Gerenciar eventos salvos</h1>
      </section>

      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

      <section className="grade-eventos">
        {savedEvents.map((event) => (
          <div key={event.eventId}>
            <EventCard
              mode="saved"
              event={event}
              imageUrl={event.imageUrl || eventImages[event.eventId]}
              footerLabel="Evento salvo"
              primaryActionLabel="Cancelar"
              onPrimaryAction={() => handleUnsave(event.eventId)}
              onEdit={isAdmin ? () => handleOpenEditModal(event) : undefined}
            />
          </div>
        ))}
      </section>

      {isAdmin && editForm && (
        <dialog
          className="modal-overlay"
          open
          aria-label="Modal de edicao"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <section
            className="manage-edit-modal"
            aria-label="Editar evento salvo"
          >
            <header className="manage-edit-modal-header">
              <h3>Editar evento salvo</h3>
              <button type="button" className="manage-close-button" onClick={handleCloseModal} aria-label="Fechar modal">
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleUpdate} className="manage-edit-form">
              <input value={editForm.title} onChange={(e) => setEditForm((s) => ({ ...s, title: e.target.value }))} required />
              <textarea value={editForm.description} onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))} />
              <select value={editForm.categoryId} onChange={(e) => setEditForm((s) => ({ ...s, categoryId: e.target.value }))} required>
                <option value="">Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input value={editForm.location} onChange={(e) => setEditForm((s) => ({ ...s, location: e.target.value }))} required />
              <input type="datetime-local" value={editForm.startAt} onChange={(e) => setEditForm((s) => ({ ...s, startAt: e.target.value }))} required />
              <input type="datetime-local" value={editForm.endAt} onChange={(e) => setEditForm((s) => ({ ...s, endAt: e.target.value }))} required />
              <input type="number" min="1" value={editForm.capacity} onChange={(e) => setEditForm((s) => ({ ...s, capacity: e.target.value }))} required />
              <select value={editForm.status} onChange={(e) => setEditForm((s) => ({ ...s, status: e.target.value }))}>
                <option>PUBLICADO</option>
                <option>RASCUNHO</option>
                <option>CANCELADO</option>
              </select>
              <button type="submit" className="manage-save-button">Salvar</button>
            </form>

            <section className="manage-participants">
              <h4>Usuários que salvaram este evento</h4>
              <ul>
                {participants.map((p) => (
                  <li key={`${p.userId}-${p.savedAt}`}>
                    {p.name} ({p.email}) - {new Date(p.savedAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            </section>
          </section>
        </dialog>
      )}
    </main>
  );
}

ManageEventsPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};
