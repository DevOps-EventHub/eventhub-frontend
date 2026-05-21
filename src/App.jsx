import { useState } from 'react'
import './App.css'

const initialForm = {
  email: '',
  password: '',
  remember: false,
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  function handleChange(event) {
    const { name, type, checked, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      if (!response.ok) {
        throw new Error('E-mail ou senha inválidos.')
      }

      const data = await response.json()
      const storage = form.remember ? localStorage : sessionStorage

      storage.setItem('eventhub.token', data.token)
      storage.setItem('eventhub.tokenType', data.tokenType)
      storage.setItem('eventhub.user', JSON.stringify(data.user))

      setMessage(`Bem-vindo de volta, ${data.user?.name ?? 'usuário'}!`)
      setMessageType('success')
    } catch (error) {
      setMessage(error.message || 'Não foi possível entrar agora.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="brand-panel" aria-label="EventHub">
        <div className="brand-content">
          <a className="brand-mark" href="/" aria-label="Página inicial do EventHub">
            <span className="brand-icon" aria-hidden="true">
              <span />
            </span>
            EventHub
          </a>

          <div className="brand-copy">
            <h1>Precisão no planejamento. Excelência na execução.</h1>
            <p>
              Acesse a plataforma para gerenciamento de eventos de alta importância. Coordene a logística, gerencie participantes e acompanhe cada detalhe com total clareza e facilidade.
            </p>
          </div>

          <dl className="brand-metrics" aria-label="Métricas do EventHub">
            <div>
              <dt>10k+</dt>
              <dd>Eventos gerenciados</dd>
            </div>
            <div>
              <dt>99.9%</dt>
              <dd>Disponibilidade</dd>
            </div>
          </dl>
        </div>

        <p className="brand-footer">© 2026 EventHub. Precisão no planejamento.</p>
      </section>

      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-card">
          <div className="auth-heading">
            <h2 id="login-title">Bem-vindo de volta</h2>
            <p>Digite suas credenciais para acessar seu painel.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>E-mail</span>
              <input
                autoComplete="email"
                name="email"
                onChange={handleChange}
                placeholder="name@company.com"
                required
                type="email"
                value={form.email}
              />
            </label>

            <label className="field">
              <span className="field-row">
                Senha
                <a href="/forgot-password">Esqueceu a senha?</a>
              </span>
              <span className="password-control">
                <input
                  autoComplete="current-password"
                  name="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                />
                <button
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="icon-button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  <span className={showPassword ? 'eye-icon is-hidden' : 'eye-icon'} />
                </button>
              </span>
            </label>

            <label className="checkbox-field">
              <input
                checked={form.remember}
                name="remember"
                onChange={handleChange}
                type="checkbox"
              />
              <span>Manter conectado por 30 dias</span>
            </label>

            {message && (
              <p className={`form-message ${messageType}`} role="status">
                {message}
              </p>
            )}

            <button className="submit-button" disabled={isLoading} type="submit">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="divider">
            <span>Ou continue com</span>
          </div>

          <div className="provider-actions">
            <button type="button">
              <span className="google-icon" aria-hidden="true" />
              Google
            </button>
            <button type="button">
              <span className="briefcase-icon" aria-hidden="true" />
              Acesso SSO
            </button>
          </div>

          <p className="request-access">
            Não tem uma conta? <a href="/request-access">Solicitar acesso</a>
          </p>
        </div>

        <nav className="legal-links" aria-label="Links legais">
          <a href="/privacy">Privacidade</a>
          <a href="/terms">Termos</a>
          <a href="/support">Suporte</a>
        </nav>
      </section>
    </main>
  )
}

export default App
