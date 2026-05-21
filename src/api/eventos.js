const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function buscarJson(caminho) {
  const resposta = await fetch(`${API_BASE}${caminho}`, {
    credentials: 'include',
  });

  if (!resposta.ok) {
    throw new Error('Nao foi possivel carregar os dados do EventHub.');
  }

  return resposta.json();
}

export async function listarEventos({ termo = '', categoria = '', status = '', local = '', pagina = 0, tamanho = 12 } = {}) {
  const parametros = new URLSearchParams({
    page: String(pagina),
    size: String(tamanho),
    sort: 'startAt,desc',
  });

  if (termo) parametros.set('title', termo);
  if (categoria) parametros.set('category', categoria);
  if (status) parametros.set('status', status);
  if (local) parametros.set('location', local);

  return buscarJson(`/api/events?${parametros.toString()}`);
}

export async function listarCategorias() {
  return buscarJson('/api/categories');
}
