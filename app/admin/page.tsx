'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      setChecking(false)
      fetchEvents()
    }
    init()


    window.addEventListener('focus', fetchEvents)
    return () => window.removeEventListener('focus', fetchEvents)
  }, [])

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*, event_signups(count)')
      .order('date', { ascending: true })
    setEvents(data || [])
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('¿Seguro que quieres eliminar este evento? Esta acción no se puede deshacer.')) return
    await supabase.from('events').delete().eq('id', eventId)
    fetchEvents()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (checking) return (
    <main className="login-wrapper">
      <p style={{ color: '#9cc8f0' }}>Verificando sesión...</p>
    </main>
  )

  return (
    <main>
      <header className="header">
        <span className="header-logo">🎵 SALA 29 — Admin</span>
        <nav className="header-nav">
          <Link href="/admin/nuevo" className="btn btn-primary btn-sm">+ Nuevo evento</Link>
          <button onClick={() => router.push('/')} className="btn btn-secondary btn-sm">Ver web</button>
          <button onClick={handleLogout} className="btn btn-danger btn-sm">Cerrar sesión</button>
        </nav>
      </header>

      <div className="admin-container fade-in">
        <h2>Eventos</h2>
        {events.length === 0 && (
          <p style={{ color: '#9cc8f0', textAlign: 'center', marginTop: '60px' }}>No hay eventos todavía.</p>
        )}
        {events.map((event) => (
          <div key={event.id} className="admin-event-card">
            <div className="admin-event-info">
              <h3>{event.title}</h3>
              <p className="date">📅 {new Date(event.date).toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}</p>
              <p className="count">👥 {event.event_signups?.[0]?.count ?? 0} asistentes registrados</p>
            </div>
            <div className="admin-event-actions">
              <Link href={`/admin/editar/${event.id}`} className="btn btn-secondary btn-sm">Editar</Link>
              <button onClick={() => handleDelete(event.id)} className="btn btn-danger btn-sm">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}