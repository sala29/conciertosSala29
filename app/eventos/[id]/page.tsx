'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EventoDetalle() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [dni, setDni] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'ok' | 'error' } | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await supabase.from('events').select('*').eq('id', id).single()
      setEvent(data)
    }
    fetchEvent()
  }, [id])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    const dniLimpio = dni.trim().toUpperCase()

    const dniRegex = /^\d{8}[A-Z]$/
    if (!dniRegex.test(dniLimpio)) {
      setMensaje({ texto: 'DNI no válido. Formato correcto: 8 números y una letra (ej: 12345678A)', tipo: 'error' })
      setLoading(false)
      return
    }

    const { error } = await supabase.from('event_signups').insert({ event_id: id, dni: dniLimpio })

    if (error) {
      if (error.code === '23505') {
        setMensaje({ texto: 'Este DNI ya está apuntado a este evento.', tipo: 'error' })
      } else {
        setMensaje({ texto: 'Error al apuntarse. Inténtalo de nuevo.', tipo: 'error' })
      }
    } else {
      setMensaje({ texto: '✅ ¡Apuntado correctamente!', tipo: 'ok' })
      setDni('')
    }
    setLoading(false)
  }

  if (!event) return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#9cc8f0' }}>Cargando evento...</p>
    </main>
  )

  const eventoTerminado = new Date(event.date) < new Date()

  return (
    <main>
      <header className="header">
        <span className="header-logo">🎵 SALA 29</span>
      </header>

      <div className="detail-container fade-in">
        <button className="detail-back" onClick={() => router.back()}>← Volver</button>

        {event.photo_url && (
          <img src={event.photo_url} alt={event.title} className="detail-img" />
        )}

        <h1 className="detail-title">{event.title}</h1>
        <p className="detail-date">
          📅 {new Date(event.date).toLocaleDateString('es-ES', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </p>
        <p className="detail-price">
          {event.price === 0 ? 'Entrada gratuita' : `${event.price} €`}
        </p>
        <p className="detail-desc">{event.description}</p>

        <div className="signup-box">
          {eventoTerminado ? (
            <p className="event-closed">Este evento ya ha comenzado. No es posible apuntarse.</p>
          ) : (
            <>
              <h2>Apuntarse a la lista</h2>
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  placeholder="DNI (ej: 12345678A)"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Enviando...' : 'Apuntarme'}
                </button>
              </form>
              {mensaje && (
                <p className={mensaje.tipo === 'ok' ? 'signup-msg-ok' : 'signup-msg-error'}>
                  {mensaje.texto}
                </p>
              )}
            </>
          )}
        </div>

        {/* BANNER REGISTRO */}
        <div className="register-banner" style={{ marginTop: '24px' }}>
          <div className="register-banner-icon">🎫</div>
          <div className="register-banner-text">
            <strong>¿Aún no eres socio de acceso?</strong>
            <span>Regístrate para poder acceder a Sala 29 el día del evento.</span>
          </div>
          <a href="https://accesossala29-front.onrender.com/usuarios/usuarios.html" target="_blank" rel="noopener noreferrer" className="btn btn-primary register-banner-btn">
            Registrarse
          </a>
        </div>

      </div>
    </main>
  )
}