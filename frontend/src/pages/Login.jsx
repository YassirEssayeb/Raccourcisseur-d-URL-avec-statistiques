import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Bienvenue</h1>
        <p className="subtitle">Connectez-vous à votre tableau de bord</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon">✉</span>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Se connecter</button>
        </form>
        <p className="auth-link">Pas de compte ? <Link to="/register">S'inscrire</Link></p>
      </div>
    </div>
  );
}
