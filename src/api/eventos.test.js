import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  atualizarEvento,
  criarEvento,
  deletarEvento,
  listarEventos,
  salvarEvento,
} from './eventos.js';

describe('eventos api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('lista eventos com query params esperados', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ content: [] }),
    });

    await listarEventos({ termo: 'java', categoria: 'tech', pagina: 1, tamanho: 20 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/events?');
    expect(url).toContain('title=java');
    expect(url).toContain('category=tech');
    expect(url).toContain('page=1');
    expect(url).toContain('size=20');
  });

  it('cria evento com metodo POST', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 10 }),
    });

    await criarEvento({ title: 'Novo' });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.body).toContain('Novo');
  });

  it('atualiza evento com id valido', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 5 }),
    });

    await atualizarEvento(5, { title: 'Atualizado' });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/events/5');
    expect(options.method).toBe('PUT');
  });

  it('bloqueia id invalido no delete', async () => {
    await expect(deletarEvento(-1, {})).rejects.toThrow('Identificador de evento invalido.');
  });

  it('retorna erro amigavel quando backend falha', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Erro de validacao' }),
    });

    await expect(salvarEvento(1)).rejects.toThrow('Erro de validacao');
  });
});
