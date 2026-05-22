const API_BASE = import.meta.env.VITE_API_URL ?? '';
const API_PREFIX = '/api/';

function normalizarCaminho(caminho) {
  if (typeof caminho !== 'string' || !caminho.startsWith(API_PREFIX)) {
    throw new Error('Caminho de API invalido.');
  }
  return caminho;
}

function validarEventId(eventId) {
  const parsed = Number(eventId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('Identificador de evento invalido.');
  }
  return String(parsed);
}

async function buscarJson(caminho, options = {}) {
  const caminhoSeguro = normalizarCaminho(caminho);
  const headers = { 'Content-Type': 'application/json' };
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const resposta = await fetch(`${API_BASE}${caminhoSeguro}`, {
    credentials: 'include',
    headers,
    ...options,
  });

  if (!resposta.ok) {
    let mensagem = 'Nao foi possivel carregar os dados do EventHub.';
    try {
      const erro = await resposta.json();
      mensagem = erro?.message || erro?.error || erro?.details?.[0] || mensagem;
    } catch {
      mensagem = `${mensagem} (HTTP ${resposta.status})`;
    }
    throw new Error(mensagem);
  }

  if (resposta.status === 204) return null;
  return resposta.json();
}

export async function listarEventos({ termo = '', categoria = '', status = '', local = '', pagina = 0, tamanho = 12 } = {}) {
  const parametros = new URLSearchParams({ page: String(pagina), size: String(tamanho), sort: 'startAt,desc' });
  if (termo) parametros.set('title', termo);
  if (categoria) parametros.set('category', categoria);
  if (status) parametros.set('status', status);
  if (local) parametros.set('location', local);
  return buscarJson(`/api/events?${parametros.toString()}`);
}

export async function criarEvento(payload) { return buscarJson('/api/events', { method: 'POST', body: JSON.stringify(payload) }); }
export async function atualizarEvento(eventId, payload) {
  const safeEventId = validarEventId(eventId);
  return buscarJson(`/api/events/${safeEventId}`, { method: 'PUT', body: JSON.stringify(payload) });
}
export async function deletarEvento(eventId) {
  const safeEventId = validarEventId(eventId);
  return buscarJson(`/api/events/${safeEventId}`, { method: 'DELETE' });
}
export async function listarCategorias() { return buscarJson('/api/categories'); }
export async function criarCategoria(payload) { return buscarJson('/api/categories', { method: 'POST', body: JSON.stringify(payload) }); }
export async function salvarEvento(eventId) {
  const safeEventId = validarEventId(eventId);
  return buscarJson(`/api/saved-events/${safeEventId}`, { method: 'POST' });
}
export async function removerEventoSalvo(eventId) {
  const safeEventId = validarEventId(eventId);
  return buscarJson(`/api/saved-events/${safeEventId}`, { method: 'DELETE' });
}
export async function listarEventosSalvos() { return buscarJson('/api/saved-events'); }
export async function listarParticipantesEventoSalvo(eventId) {
  const safeEventId = validarEventId(eventId);
  return buscarJson(`/api/saved-events/event/${safeEventId}/participants`);
}
