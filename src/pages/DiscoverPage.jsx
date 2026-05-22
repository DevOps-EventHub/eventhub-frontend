import { useEffect, useMemo, useState } from 'react';
import { Grid2X2, List, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import {
  criarCategoria,
  criarEvento,
  listarCategorias,
  listarEventos,
  salvarEvento,
} from '../api/eventos.js';
import { EventCard } from '../components/EventCard.jsx';
import { SearchFilters } from '../components/SearchFilters.jsx';
import { CreateEventModal } from '../components/CreateEventModal.jsx';

function initialForm() {
  return {
    title: '',
    description: '',
    categoryName: '',
    location: '',
    startAt: '',
    endAt: '',
    capacity: '',
    status: 'PUBLICADO',
  };
}

export function DiscoverPage({ isAdmin, openCreateModal, onOpenCreateModalChange }) {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [modalError, setModalError] = useState('');
  const [listError, setListError] = useState('');
  const [eventImages, setEventImages] = useState({});
  const [eventImageFile, setEventImageFile] = useState(null);
  const [form, setForm] = useState(initialForm());

  useEffect(() => {
    if (openCreateModal) {
      setIsModalOpen(true);
      onOpenCreateModalChange(false);
    }
  }, [openCreateModal, onOpenCreateModalChange]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('eventhub_event_images');
      setEventImages(raw ? JSON.parse(raw) : {});
    } catch {
      setEventImages({});
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setListError('');
    try {
      const [eventResponse, categoryResponse] = await Promise.all([
        listarEventos({ tamanho: 50 }),
        listarCategorias(),
      ]);
      setEvents(Array.isArray(eventResponse) ? eventResponse : (eventResponse.content ?? []));
      setCategories(categoryResponse ?? []);
    } catch (error) {
      setListError(error.message || 'Falha ao carregar eventos.');
    }
  }

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (!searchLocation || event.location.toLowerCase().includes(searchLocation.toLowerCase())),
      ),
    [events, searchTerm, searchLocation],
  );

  async function resolveCategoryId(categoryName) {
    let category = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
    if (category) return Number(category.id);

    try {
      category = await criarCategoria({
        name: categoryName,
        description: `Categoria ${categoryName}`,
      });
      return Number(category.id);
    } catch (error) {
      if (!String(error.message || '').includes('CATEGORY_ALREADY_EXISTS')) {
        throw error;
      }

      const refreshed = await listarCategorias();
      setCategories(refreshed);
      const existing = refreshed.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
      if (!existing?.id) {
        throw new Error('Nao foi possivel resolver a categoria para criar o evento.');
      }

      return Number(existing.id);
    }
  }

  async function saveEventImage(eventId) {
    if (!eventImageFile || !eventId) return;

    const reader = new FileReader();
    const imageDataUrl = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(eventImageFile);
    });

    const updated = { ...eventImages, [eventId]: imageDataUrl };
    setEventImages(updated);
    localStorage.setItem('eventhub_event_images', JSON.stringify(updated));
  }

  async function handleCreateEvent(event) {
    event.preventDefault();
    setModalError('');
    setIsSavingEvent(true);

    try {
      const categoryName = form.categoryName.trim();
      if (!categoryName) {
        throw new Error('Categoria e obrigatoria.');
      }

      const categoryId = await resolveCategoryId(categoryName);
      const created = await criarEvento({
        title: form.title,
        description: form.description,
        categoryId,
        location: form.location,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        capacity: Number(form.capacity),
        status: form.status,
      });

      await saveEventImage(created?.id);

      setIsModalOpen(false);
      setEventImageFile(null);
      setForm(initialForm());
      await loadData();
    } catch (error) {
      setModalError(error.message || 'Falha ao criar evento.');
    } finally {
      setIsSavingEvent(false);
    }
  }

  const minDateTime = new Date(Date.now() + 60000).toISOString().slice(0, 16);

  return (
    <main>
      <section className="cabecalho-busca">
        <h1>Encontrar eventos</h1>
        <SearchFilters
          searchTerm={searchTerm}
          searchLocation={searchLocation}
          onSearchTermChange={setSearchTerm}
          onSearchLocationChange={setSearchLocation}
        />
      </section>

      <section className="barra-resultados">
        <p>
          Exibindo <strong>{filteredEvents.length}</strong> resultados
        </p>

        <div className="alternador">
          <button className="ativo">
            <Grid2X2 size={20} />
          </button>
          <button>
            <List size={20} />
          </button>
        </div>
      </section>

      {listError && <p style={{ color: '#b91c1c' }}>{listError}</p>}

      <section className="grade-eventos">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            mode="discover"
            event={event}
            imageUrl={event.imageUrl || eventImages[event.id]}
            footerLabel={`${event.capacity} spots`}
            primaryActionLabel="Save"
            onPrimaryAction={() => salvarEvento(event.id)}
          />
        ))}

        {isAdmin && (
          <button className="cartao-criar" onClick={() => setIsModalOpen(true)}>
            <span>
              <Plus size={34} />
            </span>
            <strong>Criar novo evento</strong>
          </button>
        )}
      </section>

      <CreateEventModal
        isOpen={isModalOpen}
        form={form}
        categories={categories}
        minDateTime={minDateTime}
        isSavingEvent={isSavingEvent}
        modalError={modalError}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        onFormChange={(field, value) => setForm((state) => ({ ...state, [field]: value }))}
        onImageChange={setEventImageFile}
      />
    </main>
  );
}

DiscoverPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  openCreateModal: PropTypes.bool.isRequired,
  onOpenCreateModalChange: PropTypes.func.isRequired,
};
