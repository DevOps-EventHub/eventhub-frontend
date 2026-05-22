import { useState } from 'react';
import { login, logout, me } from '../api/auth.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  async function restoreSession() {
    try {
      const meData = await me();
      setUser(meData);
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  }

  async function signIn(email, password) {
    const response = await login(email, password);
    setUser(response.user);
    return response.user;
  }

  async function signOut() {
    await logout();
    setUser(null);
  }

  return { user, checking, restoreSession, signIn, signOut };
}
