import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { EnvelopeSimple, LockKey, Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[#f8fafc] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,#14b8a6,#0ea5e9)] flex items-center justify-center text-white font-bold text-sm">S</span>
            <span className="font-bold text-[#0f172a]">ShortLink</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a] mb-1">Bienvenue</h1>
          <p className="text-sm text-[#64748b]">Connectez-vous à votre tableau de bord</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-4">
          <div>
            <label htmlFor="email" className="text-xs font-medium text-[#475569] block mb-1.5">Email</label>
            <div className="relative">
              <EnvelopeSimple size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                required
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] outline-none transition-all duration-200 focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-xs font-medium text-[#475569] block mb-1.5">Mot de passe</label>
            <div className="relative">
              <LockKey size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] outline-none transition-all duration-200 focus:border-[#14b8a6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)]"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
              >
                {showPw ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] rounded-xl px-3.5 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#0f172a] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1e293b] transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
            {!loading && <ArrowRight size={14} weight="bold" />}
          </button>
        </form>

        <p className="text-center text-sm text-[#94a3b8] mt-6">
          Pas de compte ?{' '}
          <Link to="/register" className="text-[#14b8a6] font-semibold hover:text-[#0d9488] transition-colors">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
