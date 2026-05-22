import { useState } from 'react';

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch {
      setError('Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-layout">
      <section className="login-hero">
        <div className="login-hero-content">
          <strong className="login-brand">EventHub</strong>
          <h1>Precisão no planejamento. Excelência na execução.</h1>
          <p>
            Acesse a plataforma mais intuitiva do mundo para gerenciamento de eventos de alto nível. Coordene a logística, gerencie os participantes e acompanhe cada detalhe com clareza e facilidade.
          </p>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <h2>Bem-vindo</h2>
          <p>Por favor, insira suas credenciais para acessar seu painel.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="exemplo: name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Senha</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {error && <p className="login-error">{error}</p>}
          </form>

        </div>
      </section>
    </main>
  );
}
