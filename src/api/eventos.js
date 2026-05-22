const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function buscarJson(caminho, options = {}) {
  const resposta = await fetch(`${API_BASE}${caminho}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
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
export async function atualizarEvento(eventId, payload) { return buscarJson(`/api/events/${eventId}`, { method: 'PUT', body: JSON.stringify(payload) }); }
export async function listarCategorias() { return buscarJson('/api/categories'); }
export async function criarCategoria(payload) { return buscarJson('/api/categories', { method: 'POST', body: JSON.stringify(payload) }); }
export async function salvarEvento(eventId) { return buscarJson(`/api/saved-events/${eventId}`, { method: 'POST' }); }
export async function removerEventoSalvo(eventId) { return buscarJson(`/api/saved-events/${eventId}`, { method: 'DELETE' }); }
export async function listarEventosSalvos() { return buscarJson('/api/saved-events'); }
export async function listarParticipantesEventoSalvo(eventId) { return buscarJson(`/api/saved-events/event/${eventId}/participants`); }
