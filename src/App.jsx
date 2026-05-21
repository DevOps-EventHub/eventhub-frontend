import { createElement, useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, Grid2X2, List, MapPin, Pencil, Plus, Search, SlidersHorizontal, Ticket, Users } from 'lucide-react';
import { listarCategorias, listarEventos } from './api/eventos.js';
import { login, me } from './api/auth.js';
import { categoriasExemplo, eventosExemplo } from './data/eventosExemplo.js';
import './App.css';

const rotulosStatus = { DRAFT: 'Rascunho', PUBLISHED: 'Publicado', CANCELLED: 'Cancelado' };

function obterConteudoPagina(resposta) { if (Array.isArray(resposta)) return resposta; return resposta?.content ?? []; }
function formatarData(data) { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(data)); }

function CartaoEvento({ evento, isAdmin }) {
  return <article className="cartao-evento"><div className="imagem-evento"><span className={`selo-status status-${evento.status?.toLowerCase()}`}>{rotulosStatus[evento.status] ?? evento.status}</span>{isAdmin && <button className="botao-icone botao-editar" aria-label={`Editar ${evento.title}`}><Pencil size={18} /></button>}</div><div className="conteudo-evento"><div className="linha-meta"><span className="etiqueta">{evento.category}</span><span className="meta"><CalendarDays size={14} />{formatarData(evento.startAt)}</span></div><h2>{evento.title}</h2><p>{evento.description}</p><span className="local"><MapPin size={16} />{evento.location}</span><div className="rodape-cartao"><strong>{evento.capacity} vagas</strong><button>Detalhes</button></div></div></article>;
}

function FiltroBotao({ icon, children }) { return <button className="filtro-botao">{createElement(icon, { size: 16 })}<span>{children}</span><ChevronDown size={15} /></button>; }

export default function App() {
  const [auth, setAuth] = useState({ user: null, loading: true });
  const [loginForm, setLoginForm] = useState({ email: '', password: '', error: '', loading: false });
  const [termoBusca, setTermoBusca] = useState('');
  const [localBusca, setLocalBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [eventos, setEventos] = useState(eventosExemplo);
  const [categorias, setCategorias] = useState(categoriasExemplo);
  const [carregando, setCarregando] = useState(true);
  const [modoGrade, setModoGrade] = useState(true);

  const isAdmin = auth.user?.roles?.includes('ROLE_ADMIN');

  useEffect(() => { me().then((user) => setAuth({ user, loading: false })).catch(() => setAuth({ user: null, loading: false })); }, []);
  useEffect(() => {
    let ativo = true;
    async function carregarDados() {
      setCarregando(true);
      try {
        const [eventosResposta, categoriasResposta] = await Promise.all([listarEventos(), listarCategorias()]);
        if (!ativo) return;
        setEventos(obterConteudoPagina(eventosResposta));
        setCategorias(categoriasResposta);
      } catch {
        if (!ativo) return;
        setEventos(eventosExemplo); setCategorias(categoriasExemplo);
      } finally { if (ativo) setCarregando(false); }
    }
    carregarDados(); return () => { ativo = false; };
  }, []);

  const eventosFiltrados = useMemo(() => eventos.filter((evento) => {
    const termo = termoBusca.trim().toLowerCase();
    const local = localBusca.trim().toLowerCase();
    const combinaTermo = !termo || [evento.title, evento.description, evento.category].join(' ').toLowerCase().includes(termo);
    const combinaLocal = !local || evento.location.toLowerCase().includes(local);
    const combinaCategoria = !categoriaAtiva || evento.category === categoriaAtiva;
    return combinaTermo && combinaLocal && combinaCategoria;
  }), [categoriaAtiva, eventos, localBusca, termoBusca]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginForm((s) => ({ ...s, loading: true, error: '' }));
    try {
      const response = await login(loginForm.email, loginForm.password);
      setAuth({ user: response.user, loading: false });
      setLoginForm({ email: '', password: '', loading: false, error: '' });
    } catch {
      setLoginForm((s) => ({ ...s, loading: false, error: 'Credenciais inválidas.' }));
    }
  }

  return <div className="aplicacao"><header className="topo"><a className="marca" href="/">EventHub</a><nav aria-label="Navegacao principal"><a className="ativo" href="/">Descobrir</a><a href="/">Gerenciar</a></nav><div className="acoes-topo">{isAdmin && <button className="botao-criar"><Plus size={18} />Criar evento</button>}<div className="avatar" aria-label="Perfil do usuario">{auth.user?.name?.slice(0, 2).toUpperCase() ?? 'EH'}</div></div></header><main>{!auth.user && !auth.loading && <section className="painel-login"><h2>Entrar</h2><form onSubmit={handleLogin}><input type="email" placeholder="E-mail" value={loginForm.email} onChange={(e) => setLoginForm((s) => ({ ...s, email: e.target.value }))} required /><input type="password" placeholder="Senha" value={loginForm.password} onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))} required /><button type="submit" disabled={loginForm.loading}>{loginForm.loading ? 'Entrando...' : 'Login'}</button>{loginForm.error && <p>{loginForm.error}</p>}</form></section>}<section className="cabecalho-busca"><h1>Buscar eventos</h1><div className="painel-busca"><div className="linha-busca"><label className="campo-busca"><Search size={22} /><input type="search" value={termoBusca} onChange={(evento) => setTermoBusca(evento.target.value)} placeholder="Busque por nome, palavra-chave ou categoria..." /></label><label className="campo-busca campo-local"><MapPin size={22} /><input value={localBusca} onChange={(evento) => setLocalBusca(evento.target.value)} placeholder="Localizacao" /></label><button className="botao-pesquisar">Pesquisar</button></div><div className="linha-filtros"><span>Filtros:</span><FiltroBotao icon={CalendarDays}>Periodo</FiltroBotao><FiltroBotao icon={SlidersHorizontal}>Categoria</FiltroBotao><FiltroBotao icon={Ticket}>Status</FiltroBotao><FiltroBotao icon={Users}>Capacidade</FiltroBotao></div></div></section><section className="barra-resultados"><div><p>Mostrando <strong>{eventosFiltrados.length}</strong> eventos</p></div><div className="controles-lista"><div className="alternador" aria-label="Modo de visualizacao"><button className={modoGrade ? 'ativo' : ''} onClick={() => setModoGrade(true)}><Grid2X2 size={20} /></button><button className={!modoGrade ? 'ativo' : ''} onClick={() => setModoGrade(false)}><List size={20} /></button></div></div></section><section className="categorias" aria-label="Categorias"><button className={categoriaAtiva === '' ? 'ativo' : ''} onClick={() => setCategoriaAtiva('')}>Todas</button>{categorias.map((categoria) => <button key={categoria.id ?? categoria.name} className={categoriaAtiva === categoria.name ? 'ativo' : ''} onClick={() => setCategoriaAtiva(categoria.name)}>{categoria.name}</button>)}</section>{carregando ? <section className="estado">Carregando eventos...</section> : <section className={modoGrade ? 'grade-eventos' : 'lista-eventos'}>{eventosFiltrados.map((evento) => <CartaoEvento key={evento.id} evento={evento} isAdmin={isAdmin} />)}{isAdmin && <button className="cartao-criar"><span><Plus size={34} /></span><strong>Criar novo evento</strong></button>}</section>}</main></div>;
}
