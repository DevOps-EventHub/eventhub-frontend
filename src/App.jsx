import { useEffect, useMemo, useState } from 'react'
import designWorkshopImage from './assets/events/design-workshop.svg'
import futureCitiesImage from './assets/events/future-cities-expo.svg'
import networkingGalaImage from './assets/events/networking-gala.svg'
import saasFounderImage from './assets/events/saas-founder-meetup.svg'
import strategyRetreatImage from './assets/events/strategy-retreat.svg'
import techSummitImage from './assets/events/tech-summit.svg'
import wellnessDayImage from './assets/events/wellness-day.svg'
import './App.css'

const eventosModelo = [
  {
    eventId: 1,
    title: 'Summit Global de Tecnologia 2026',
    category: 'Tecnologia e Inovação',
    location: 'São Paulo, SP',
    startAt: '2026-08-24T09:00:00-03:00',
    description: 'Conferência para líderes de produto, engenharia e operações.',
    tag: 'Ao vivo em breve',
    variant: 'featured',
    visual: 'summit',
    image: techSummitImage,
  },
  {
    eventId: 2,
    title: 'Workshop de Design Systems',
    category: 'Workshop',
    location: 'Curitiba, PR',
    startAt: '2026-09-12T14:00:00-03:00',
    description: 'Práticas para organizar componentes, tokens e governança visual.',
    variant: 'compact',
    visual: 'workshop',
    image: designWorkshopImage,
  },
  {
    eventId: 3,
    title: 'Gala Anual de Networking',
    category: 'Networking',
    location: 'Rio de Janeiro, RJ',
    startAt: '2026-10-05T19:30:00-03:00',
    description: 'Encontro executivo para relacionamento e novas oportunidades.',
    variant: 'compact',
    visual: 'gala',
    image: networkingGalaImage,
  },
  {
    eventId: 4,
    title: 'Retiro de Estratégia Executiva',
    category: 'Interno',
    location: 'Gramado, RS',
    startAt: '2026-11-15T10:00:00-03:00',
    endAt: '2026-11-18T18:00:00-03:00',
    description: 'Sessão profunda de planejamento para diretores regionais e líderes.',
    variant: 'wide',
    visual: 'strategy',
    image: strategyRetreatImage,
  },
  {
    eventId: 5,
    title: 'Dia de Bem-estar Corporativo',
    category: 'Bem-estar',
    location: 'Belo Horizonte, MG',
    startAt: '2026-09-30T08:30:00-03:00',
    description: 'Experiências práticas para saúde, foco e cultura organizacional.',
    variant: 'compact',
    visual: 'wellness',
    image: wellnessDayImage,
  },
  {
    eventId: 6,
    title: 'Expo Cidades do Futuro',
    category: 'Exposição',
    location: 'Florianópolis, SC',
    startAt: '2026-10-18T09:00:00-03:00',
    description: 'Mostra de soluções urbanas, mobilidade e tecnologia sustentável.',
    variant: 'compact',
    visual: 'expo',
    image: futureCitiesImage,
  },
  {
    eventId: 7,
    title: 'Meetup de Fundadores SaaS',
    category: 'Startup',
    location: 'Recife, PE',
    startAt: '2026-10-22T18:00:00-03:00',
    description: 'Conversas práticas sobre crescimento, produto e captação.',
    variant: 'compact',
    visual: 'startup',
    image: saasFounderImage,
  },
]

function obterToken() {
  return localStorage.getItem('eventhub.token') || sessionStorage.getItem('eventhub.token')
}

function formatarData(data) {
  if (!data) {
    return 'Data a definir'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(data))
}

function formatarPeriodo(inicio, fim) {
  if (!fim) {
    return formatarData(inicio)
  }

  const inicioFormatado = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(inicio))
  const fimFormatado = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(fim))

  return `${inicioFormatado} - ${fimFormatado}`
}

function normalizarEvento(evento, indice) {
  const modelo = eventosModelo[indice % eventosModelo.length]

  return {
    ...modelo,
    ...evento,
    eventId: evento.eventId ?? modelo.eventId,
    title: evento.title ?? modelo.title,
    location: evento.location ?? modelo.location,
    startAt: evento.startAt ?? modelo.startAt,
  }
}

function App() {
  const [eventosSalvos, setEventosSalvos] = useState(eventosModelo)
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    async function carregarEventosSalvos() {
      const token = obterToken()

      if (!token) {
        setCarregando(false)
        setMensagem('Entre na sua conta para sincronizar seus eventos salvos.')
        return
      }

      try {
        const resposta = await fetch('/api/saved-events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os eventos salvos.')
        }

        const dados = await resposta.json()

        if (dados.length > 0) {
          setEventosSalvos(dados.map(normalizarEvento))
          setMensagem('')
        } else {
          setEventosSalvos([])
          setMensagem('Você ainda não salvou nenhum evento.')
        }
      } catch (error) {
        setMensagem(`${error.message} Exibindo uma prévia local.`)
      } finally {
        setCarregando(false)
      }
    }

    carregarEventosSalvos()
  }, [])

  const eventosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    if (!termo) {
      return eventosSalvos
    }

    return eventosSalvos.filter((evento) => {
      return [evento.title, evento.category, evento.location].some((valor) =>
        valor?.toLowerCase().includes(termo),
      )
    })
  }, [busca, eventosSalvos])

  async function removerEvento(eventId) {
    const token = obterToken()

    setEventosSalvos((eventosAtuais) =>
      eventosAtuais.filter((evento) => evento.eventId !== eventId),
    )

    if (!token) {
      setMensagem('Evento removido da visualização local.')
      return
    }

    try {
      const resposta = await fetch(`/api/saved-events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!resposta.ok) {
        throw new Error('Não foi possível remover o evento salvo.')
      }

      setMensagem('Evento removido dos salvos.')
    } catch (error) {
      setMensagem(error.message)
    }
  }

  async function registrarEvento(eventId) {
    const token = obterToken()

    if (!token) {
      setMensagem('Entre na sua conta para se registrar neste evento.')
      return
    }

    try {
      const resposta = await fetch(`/api/registrations/${eventId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!resposta.ok) {
        throw new Error('Não foi possível concluir o registro.')
      }

      setMensagem('Registro realizado com sucesso.')
    } catch (error) {
      setMensagem(error.message)
    }
  }

  return (
    <main className="saved-events-page">
      <header className="topbar">
        <a className="app-logo" href="/" aria-label="Página inicial do EventHub">
          EventHub
        </a>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="/eventos">Descobrir</a>
          <a className="active" href="/eventos-salvos">
            Gerenciar
          </a>
        </nav>

        <label className="search-box">
          <span className="search-icon" aria-hidden="true" />
          <input
            aria-label="Buscar eventos salvos"
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar eventos..."
            type="search"
            value={busca}
          />
        </label>

        <span className="topbar-divider" />
        <div className="avatar" aria-label="Perfil do usuário" />
      </header>

      <section className="page-shell">
        <div className="breadcrumb" aria-label="Caminho da página">
          <a href="/dashboard">Painel</a>
          <span aria-hidden="true">›</span>
          <span>Eventos salvos</span>
        </div>

        <div className="page-heading">
          <h1>Eventos Salvos</h1>
          <p>Gerencie os eventos que você marcou para acompanhar depois.</p>
        </div>

        {mensagem && <p className="status-message">{mensagem}</p>}

        {carregando ? (
          <p className="loading-message">Carregando eventos salvos...</p>
        ) : (
          <section className="events-grid" aria-label="Lista de eventos salvos">
            {eventosFiltrados.map((evento, indice) => (
              <EventCard
                evento={evento}
                key={evento.eventId}
                onRegister={registrarEvento}
                onRemove={removerEvento}
                priority={indice}
              />
            ))}
          </section>
        )}
      </section>

      <footer className="page-footer">
        <strong>EventHub</strong>
        <span>© 2026 EventHub. Precisão no planejamento.</span>
        <nav aria-label="Links legais">
          <a href="/privacidade">Privacidade</a>
          <a href="/termos">Termos</a>
          <a href="/suporte">Suporte</a>
          <a href="/contato">Contato</a>
        </nav>
      </footer>
    </main>
  )
}

function EventCard({ evento, onRegister, onRemove, priority }) {
  const isFeatured = evento.variant === 'featured'
  const isWide = evento.variant === 'wide'
  const cardClass = ['event-card', isFeatured && 'featured', isWide && 'wide']
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClass}>
      <div className={`event-media ${evento.visual}`}>
        <img alt={`Imagem do evento ${evento.title}`} src={evento.image} />
        {evento.tag && <span className="event-tag">{evento.tag}</span>}
        <button
          aria-label={`Remover ${evento.title} dos salvos`}
          className="bookmark-button"
          onClick={() => onRemove(evento.eventId)}
          type="button"
        >
          <span aria-hidden="true" />
        </button>
      </div>

      <div className="event-content">
        <div className="event-main">
          <p className="event-category">{evento.category}</p>
          <h2>{evento.title}</h2>
          {isWide && <p className="event-description">{evento.description}</p>}
        </div>

        {isFeatured ? (
          <div className="featured-date">
            <strong>{formatarData(evento.startAt).replace(' de ', ' ')}</strong>
            <span>{evento.location}</span>
          </div>
        ) : (
          <div className="event-meta">
            <span className="calendar-icon" aria-hidden="true" />
            {isWide ? formatarPeriodo(evento.startAt, evento.endAt) : formatarData(evento.startAt)}
          </div>
        )}

        {isWide && (
          <div className="event-place">
            <span className="pin-icon" aria-hidden="true" />
            {evento.location}
          </div>
        )}

        <div className="event-actions">
          {isFeatured && (
            <div className="attendees" aria-label={`${priority + 42} participantes interessados`}>
              <span />
              <span />
              <small>+42</small>
            </div>
          )}
          <button className="text-action" onClick={() => onRemove(evento.eventId)} type="button">
            Remover
          </button>
          <button className="outline-action" onClick={() => onRegister(evento.eventId)} type="button">
            {isFeatured || priority % 2 === 0 ? 'Ver detalhes' : 'Registrar'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default App
