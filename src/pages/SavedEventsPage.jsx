import { useEffect, useState } from 'react';
import { listarEventosSalvos, removerEventoSalvo } from '../api/eventos.js';
import { EventCard } from '../components/EventCard.jsx';

function savedAtLabel(savedAt) {
  return `Saved at ${new Date(savedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })}`;
}

export function SavedEventsPage() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSavedEvents() {
      try {
        setError('');
        const response = await listarEventosSalvos();
        setSavedEvents(response ?? []);
      } catch (err) {
        setError(err.message || 'Failed to load saved events.');
        setSavedEvents([]);
      }
    }

    loadSavedEvents();
  }, []);

  async function handleUnsave(eventId) {
    try {
      await removerEventoSalvo(eventId);
      setSavedEvents((prev) => prev.filter((item) => item.eventId !== eventId));
    } catch (err) {
      setError(err.message || 'Failed to remove saved event.');
    }
  }

  return (
    <main>
      <section className="cabecalho-busca">
        <p style={{ color: '#596174' }}>Dashboard &gt; Saved Events</p>
        <h1>Saved Events</h1>
      </section>

      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

      <section className="grade-eventos">
        {savedEvents.map((event) => (
          <EventCard
            key={event.eventId}
            mode="saved"
            event={{
              title: event.title,
              location: event.location,
              startAt: event.startAt,
              imageUrl: event.imageUrl,
            }}
            imageUrl={event.imageUrl}
            footerLabel={savedAtLabel(event.savedAt)}
            primaryActionLabel="CANCELAR"
            onPrimaryAction={() => handleUnsave(event.eventId)}
          />
        ))}
      </section>
    </main>
  );
}

