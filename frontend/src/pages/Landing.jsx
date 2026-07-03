"use client"

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  Link as LinkIcon,
  ChartBar,
  QrCode,
  Clock,
  ArrowRight,
  SealCheck,
} from '@phosphor-icons/react'

const fadeUp = (reduce, delay = 0) => ({
  initial: reduce ? {} : { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
})

const stagger = (reduce, baseDelay = 0) => ({
  initial: reduce ? {} : { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, delay: baseDelay, ease: [0.16, 1, 0.3, 1] },
})

export default function Landing() {
  const reduce = useReducedMotion()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleShorten = () => {
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Collez une URL')
      return
    }
    setError('')
    navigate(`/register?url=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="min-h-dvh bg-[#f8fafc] font-sans overflow-x-hidden">
      {/* ---------- NAV ---------- */}
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 sm:pt-5 px-4">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[640px] flex items-center justify-between px-5 h-12 rounded-full bg-white/80 backdrop-blur-xl border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]"
        >
          <Link to="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[linear-gradient(135deg,#14b8a6,#0ea5e9)] flex items-center justify-center text-white font-bold text-xs">S</span>
            <span className="font-bold text-[#0f172a] text-sm tracking-tight">ShortLink</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-[#475569] hover:text-[#0f172a] transition-colors px-3 py-1.5 font-medium">
              Connexion
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-[#0f172a] hover:bg-[#1e293b] px-4 py-1.5 rounded-full transition-all active:scale-[0.97]"
            >
              S'inscrire
            </Link>
          </div>
        </motion.div>
      </nav>

      <main>
        {/* ---------- HERO ---------- */}
        <section className="relative min-h-dvh flex items-center justify-center px-5 pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.08)_0%,transparent_70%)]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.06)_0%,transparent_70%)]" />
          </div>

          <motion.div className="relative max-w-[600px] mx-auto text-center" {...fadeUp(reduce)}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] bg-[#14b8a6]/8 text-[#0d9488] border border-[#14b8a6]/15 mb-6">
              100% gratuit
            </span>
            <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tighter text-[#0f172a] leading-[1.08] mb-4">
              Raccourcissez vos liens.{' '}
              <span className="text-[#14b8a6]">Suivez tout.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-[500px] mx-auto mb-8">
              Créez des liens courts en un clic. Statistiques en temps réel, QR code inclus. Gratuit, sans limite.
            </p>

            <div className="max-w-[520px] mx-auto">
              <div className="p-1 rounded-2xl bg-white border border-[#e2e8f0] shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center gap-1.5">
                <input
                  type="url"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleShorten()}
                  placeholder="Collez votre URL ici..."
                  className="flex-1 px-4 py-3 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none bg-transparent min-w-0"
                />
                <button
                  onClick={handleShorten}
                  className="px-5 py-3 rounded-xl bg-[linear-gradient(135deg,#14b8a6,#0ea5e9)] text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.97] whitespace-nowrap shadow-[0_2px_8px_rgba(20,184,166,0.25)]"
                >
                  Raccourcir
                </button>
              </div>
              {error && <p className="text-xs text-[#ef4444] mt-2">{error}</p>}
              <p className="text-xs text-[#94a3b8] mt-3">Créez un compte pour suivre vos liens. Aucune carte requise.</p>
            </div>
          </motion.div>
        </section>

        {/* ---------- FEATURES ---------- */}
        <section className="py-24 sm:py-32 px-5">
          <div className="max-w-[1100px] mx-auto">
            <motion.div className="text-center mb-16" {...stagger(reduce)}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] mb-3">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-[#475569] max-w-[480px] mx-auto">
                Pas de superflu. L'essentiel pour gérer et suivre vos liens efficacement.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: LinkIcon, title: 'Liens courts', desc: "En une seconde, sans création de compte, sans engagement." },
                { icon: ChartBar, title: 'Statistiques', desc: 'Clics, provenance géographique, appareils en temps réel.' },
                { icon: QrCode, title: 'QR code', desc: 'Chaque lien génère son QR code automatiquement.' },
                { icon: Clock, title: 'Sans limite', desc: "Pas de date d'expiration, pas de quota caché." },
              ].map((feat, i) => {
                const Icon = feat.icon
                return (
                  <motion.div
                    key={feat.title}
                    {...stagger(reduce, i * 0.06)}
                    className="group p-6 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#14b8a6]/30 hover:shadow-[0_4px_24px_rgba(20,184,166,0.06)] transition-all duration-300"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#14b8a6]/8 text-[#0d9488] mb-4 group-hover:scale-105 transition-transform duration-300">
                      <Icon size={20} weight="bold" />
                    </span>
                    <h3 className="text-sm font-semibold text-[#0f172a] mb-1.5">{feat.title}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">{feat.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ---------- HOW IT WORKS ---------- */}
        <section className="py-24 sm:py-32 px-5 bg-[#f1f5f9]/50 border-y border-[#e2e8f0]">
          <div className="max-w-[1000px] mx-auto">
            <motion.div className="text-center mb-16" {...stagger(reduce)}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] mb-3">
                Comment ça marche
              </h2>
              <p className="text-[#475569] max-w-[400px] mx-auto">
                Trois étapes, pas une de plus.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0">
              {[
                { step: '01', title: 'Collez votre URL', desc: 'Longue ou compliquée, on s\'en charge.' },
                { step: '02', title: 'Raccourcissez', desc: 'Un clic et votre lien court est prêt.' },
                { step: '03', title: 'Suivez les clics', desc: 'Statistiques détaillées dans votre tableau de bord.' },
              ].map((item, i) => (
                <motion.div key={item.step} {...stagger(reduce, i * 0.08)} className="flex-1 text-center px-4">
                  <span className="text-4xl font-bold text-[#14b8a6]/20 tracking-tighter block mb-3">{item.step}</span>
                  <h3 className="text-base font-semibold text-[#0f172a] mb-1.5">{item.title}</h3>
                  <p className="text-sm text-[#64748b] max-w-[220px] mx-auto">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- STATS PREVIEW ---------- */}
        <section className="py-24 sm:py-32 px-5">
          <div className="max-w-[1000px] mx-auto">
            <motion.div className="text-center mb-16" {...stagger(reduce)}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] mb-3">
                Ce que vous suivez
              </h2>
              <p className="text-[#475569] max-w-[420px] mx-auto">
                Chaque lien vous donne accès à ces données en un regard.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'Total clics', desc: 'Compteur en temps réel' },
                { value: 'Localisation', desc: 'Pays et villes d\'origine' },
                { value: 'Appareils', desc: 'Mobile, desktop, tablette' },
                { value: 'Référents', desc: 'D\'où viennent vos visiteurs' },
              ].map((item, i) => (
                <motion.div
                  key={item.value}
                  {...stagger(reduce, i * 0.06)}
                  className="p-6 rounded-2xl border border-[#e2e8f0] bg-white"
                >
                  <div className="w-2 h-2 rounded-full bg-[#14b8a6] mb-3" />
                  <h3 className="text-sm font-semibold text-[#0f172a] mb-1">{item.value}</h3>
                  <p className="text-xs text-[#64748b]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="py-24 px-5">
          <motion.div className="max-w-[520px] mx-auto text-center" {...fadeUp(reduce)}>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[linear-gradient(135deg,#14b8a6,#0ea5e9)] text-white mb-6 shadow-[0_4px_16px_rgba(20,184,166,0.25)]">
              <SealCheck size={26} weight="fill" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] mb-3">
              Prêt à commencer ?
            </h2>
            <p className="text-[#475569] mb-8 max-w-[380px] mx-auto">
              Créez votre compte gratuitement. Aucune carte bancaire, aucun engagement.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#0f172a] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#1e293b] transition-all active:scale-[0.97] shadow-sm text-sm"
            >
              Créer mon compte gratuit
              <ArrowRight size={15} weight="bold" />
            </Link>
          </motion.div>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-[#e2e8f0] py-8 px-5">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[linear-gradient(135deg,#14b8a6,#0ea5e9)] flex items-center justify-center text-white font-bold text-[9px]">S</span>
            <span>ShortLink</span>
          </div>
          <p className="text-xs">&copy; {new Date().getFullYear()} ShortLink. Gratuit et sans engagement.</p>
        </div>
      </footer>
    </div>
  )
}
