const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Falha de autenticacao.');
  }

  return response.json();
}

export function login(email, password) {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function me() {
  return requestJson('/api/auth/me');
}
