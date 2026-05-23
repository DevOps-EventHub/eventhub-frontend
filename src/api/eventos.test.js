import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  atualizarEvento,
  criarCategoria,
  criarEvento,
  deletarEvento,
  listarCategorias,
  listarEventosSalvos,
  listarParticipantesEventoSalvo,
  listarEventos,
  removerEventoSalvo,
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

  it('retorna null em resposta 204', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => ({}),
    });

    await expect(removerEventoSalvo(1)).resolves.toBeNull();
  });

  it('retorna erro com status quando resposta invalida nao tem json', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('invalid json');
      },
    });

    await expect(listarEventosSalvos()).rejects.toThrow('HTTP 500');
  });

  it('lista participantes com id valido', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ([]),
    });

    await listarParticipantesEventoSalvo(7);

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/saved-events/event/7/participants');
  });

  it('cria e lista categoria', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 1, name: 'Tech' }),
    }).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ([{ id: 1, name: 'Tech' }]),
    });

    const created = await criarCategoria({ name: 'Tech' });
    const listed = await listarCategorias();

    expect(created.name).toBe('Tech');
    expect(Array.isArray(listed)).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('bloqueia caminho invalido por id de participante invalido', async () => {
    await expect(listarParticipantesEventoSalvo(0)).rejects.toThrow('Identificador de evento invalido.');
  });
});
