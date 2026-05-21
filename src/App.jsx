import { createElement, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  List,
  MapPin,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Ticket,
  Users,
} from 'lucide-react';
import { listarCategorias, listarEventos } from './api/eventos.js';
import { categoriasExemplo, eventosExemplo } from './data/eventosExemplo.js';

const imagensPorEvento = {
  1: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
  2: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80',
  3: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
  4: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
  5: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
  6: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
  7: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  8: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80',
  9: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
  10: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=900&q=80',
  11: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
  12: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80',
};

const imagemPadrao = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80';

const rotulosStatus = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  CANCELLED: 'Cancelado',
};

function obterConteudoPagina(resposta) {
  if (Array.isArray(resposta)) return resposta;
  return resposta?.content ?? [];
}

function formatarData(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(data));
}

function CartaoEvento({ evento }) {
  const imagem = imagensPorEvento[evento.id] ?? imagemPadrao;

  return (
    <article className="cartao-evento">
      <div className="imagem-evento">
        <img src={imagem} alt="" />
        <span className={`selo-status status-${evento.status?.toLowerCase()}`}>
          {rotulosStatus[evento.status] ?? evento.status}
        </span>
        <button className="botao-icone botao-editar" aria-label={`Editar ${evento.title}`}>
          <Pencil size={18} />
        </button>
      </div>

      <div className="conteudo-evento">
        <div className="linha-meta">
          <span className="etiqueta">{evento.category}</span>
          <span className="meta">
            <CalendarDays size={14} />
            {formatarData(evento.startAt)}
          </span>
        </div>

        <h2>{evento.title}</h2>
        <p>{evento.description}</p>

        <span className="local">
          <MapPin size={16} />
          {evento.location}
        </span>

        <div className="rodape-cartao">
          <strong>{evento.capacity} vagas</strong>
          <button>Detalhes</button>
        </div>
      </div>
    </article>
  );
}

function FiltroBotao({ icon, children }) {
  return (
    <button className="filtro-botao">
      {createElement(icon, { size: 16 })}
      <span>{children}</span>
      <ChevronDown size={15} />
    </button>
  );
}

function App() {
  const [termoBusca, setTermoBusca] = useState('');
  const [localBusca, setLocalBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [eventos, setEventos] = useState(eventosExemplo);
  const [categorias, setCategorias] = useState(categoriasExemplo);
  const [carregando, setCarregando] = useState(true);
  const [modoGrade, setModoGrade] = useState(true);
  const [origemExemplo, setOrigemExemplo] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      setCarregando(true);
      try {
        const [eventosResposta, categoriasResposta] = await Promise.all([
          listarEventos(),
          listarCategorias(),
        ]);

        if (!ativo) return;
        setEventos(obterConteudoPagina(eventosResposta));
        setCategorias(categoriasResposta);
        setOrigemExemplo(false);
      } catch {
        if (!ativo) return;
        setEventos(eventosExemplo);
        setCategorias(categoriasExemplo);
        setOrigemExemplo(true);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const eventosFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    const local = localBusca.trim().toLowerCase();

    return eventos.filter((evento) => {
      const combinaTermo = !termo || [evento.title, evento.description, evento.category]
        .join(' ')
        .toLowerCase()
        .includes(termo);
      const combinaLocal = !local || evento.location.toLowerCase().includes(local);
      const combinaCategoria = !categoriaAtiva || evento.category === categoriaAtiva;

      return combinaTermo && combinaLocal && combinaCategoria;
    });
  }, [categoriaAtiva, eventos, localBusca, termoBusca]);

  const totalResultados = eventosFiltrados.length;

  function limparFiltros() {
    setTermoBusca('');
    setLocalBusca('');
    setCategoriaAtiva('');
  }

  return (
    <div className="aplicacao">
      <header className="topo">
        <a className="marca" href="/">EventHub</a>
        <nav aria-label="Navegacao principal">
          <a className="ativo" href="/">Descobrir</a>
          <a href="/">Gerenciar</a>
        </nav>
        <div className="acoes-topo">
          <button className="botao-criar">
            <Plus size={18} />
            Criar evento
          </button>
          <div className="avatar" aria-label="Perfil do usuario">EH</div>
        </div>
      </header>

      <main>
        <section className="cabecalho-busca">
          <h1>Buscar eventos</h1>

          <div className="painel-busca">
            <div className="linha-busca">
              <label className="campo-busca">
                <Search size={22} />
                <input
                  type="search"
                  value={termoBusca}
                  onChange={(evento) => setTermoBusca(evento.target.value)}
                  placeholder="Busque por nome, palavra-chave ou categoria..."
                />
              </label>

              <label className="campo-busca campo-local">
                <MapPin size={22} />
                <input
                  value={localBusca}
                  onChange={(evento) => setLocalBusca(evento.target.value)}
                  placeholder="Localizacao"
                />
              </label>

              <button className="botao-pesquisar">Pesquisar</button>
            </div>

            <div className="linha-filtros">
              <span>Filtros:</span>
              <FiltroBotao icon={CalendarDays}>Periodo</FiltroBotao>
              <FiltroBotao icon={SlidersHorizontal}>Categoria</FiltroBotao>
              <FiltroBotao icon={Ticket}>Status</FiltroBotao>
              <FiltroBotao icon={Users}>Capacidade</FiltroBotao>
              <button className="limpar" onClick={limparFiltros}>Limpar filtros</button>
            </div>
          </div>
        </section>

        <section className="barra-resultados">
          <div>
            <p>
              Mostrando <strong>{totalResultados}</strong> evento{totalResultados === 1 ? '' : 's'}
              {termoBusca ? ` para "${termoBusca}"` : ''}
            </p>
            {origemExemplo && <span>Usando dados de exemplo ate o backend responder.</span>}
          </div>

          <div className="controles-lista">
            <div className="alternador" aria-label="Modo de visualizacao">
              <button className={modoGrade ? 'ativo' : ''} onClick={() => setModoGrade(true)} aria-label="Ver em grade">
                <Grid2X2 size={20} />
              </button>
              <button className={!modoGrade ? 'ativo' : ''} onClick={() => setModoGrade(false)} aria-label="Ver em lista">
                <List size={20} />
              </button>
            </div>

            <label className="ordenacao">
              <span>Ordenar:</span>
              <select defaultValue="recentes">
                <option value="recentes">Mais recentes</option>
                <option value="nome">Nome</option>
                <option value="capacidade">Capacidade</option>
              </select>
            </label>
          </div>
        </section>

        <section className="categorias" aria-label="Categorias">
          <button className={categoriaAtiva === '' ? 'ativo' : ''} onClick={() => setCategoriaAtiva('')}>
            Todas
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id ?? categoria.name}
              className={categoriaAtiva === categoria.name ? 'ativo' : ''}
              onClick={() => setCategoriaAtiva(categoria.name)}
            >
              {categoria.name}
            </button>
          ))}
        </section>

        {carregando ? (
          <section className="estado">Carregando eventos...</section>
        ) : (
          <section className={modoGrade ? 'grade-eventos' : 'lista-eventos'}>
            {eventosFiltrados.map((evento) => (
              <CartaoEvento key={evento.id} evento={evento} />
            ))}

            <button className="cartao-criar">
              <span>
                <Plus size={34} />
              </span>
              <strong>Criar novo evento</strong>
              <small>Adicione uma nova publicacao ao ecossistema EventHub</small>
            </button>
          </section>
        )}

        <nav className="paginacao" aria-label="Paginacao">
          <button aria-label="Pagina anterior"><ChevronLeft size={18} /></button>
          <button className="ativo">1</button>
          <button>2</button>
          <button>3</button>
          <span>...</span>
          <button>12</button>
          <button aria-label="Proxima pagina"><ChevronRight size={18} /></button>
        </nav>
      </main>

      <footer>
        <div>
          <strong>EventHub</strong>
          <span>© 2026 EventHub. Planejamento preciso.</span>
        </div>
        <nav aria-label="Links de rodape">
          <a href="/">Privacidade</a>
          <a href="/">Termos</a>
          <a href="/">Suporte</a>
          <a href="/">Contato</a>
        </nav>
      </footer>
    </div>
  );
}

export default App;
