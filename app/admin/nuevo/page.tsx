'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import FotoUploader from '@/components/FotoUploader'

export default function AdminNuevo() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'ok' | 'error' } | null>(null)
  const [form, setForm] = useState({ title: '', date: '', description: '', price: '', photo_url: '' })

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      setChecking(false)
    }
    checkSession()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)
    const { error } = await supabase.from('events').insert({
      title: form.title, date: form.date, description: form.description,
      price: parseFloat(form.price) || 0, photo_url: form.photo_url || null,
    })
    if (error) {
      setMensaje({ texto: 'Error al crear el evento.', tipo: 'error' })
    } else {
      setMensaje({ texto: '✅ Evento creado correctamente.', tipo: 'ok' })
      setForm({ title: '', date: '', description: '', price: '', photo_url: '' })
    }
    setLoading(false)
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
          <button onClick={() => router.push('/admin')} className="btn btn-secondary btn-sm">← Dashboard</button>
        </nav>
      </header>

      <div className="admin-container fade-in">
        <h2>Nuevo evento</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <input name="title" type="text" placeholder="Título del evento" value={form.title} onChange={handleChange} required />
          <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required min={new Date().toISOString().slice(0, 16)} />
          <textarea name="description" placeholder="Descripción del evento" value={form.description} onChange={handleChange} rows={4} style={{ resize: 'none' }} />
          <input name="price" type="number" min="0" step="0.01" placeholder="Precio (0 si es gratis)" value={form.price} onChange={handleChange} required />
          <FotoUploader currentUrl={form.photo_url} onUpload={(url) => setForm({ ...form, photo_url: url })} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creando...' : 'Crear evento'}
          </button>
        </form>
        {mensaje && <p className={mensaje.tipo === 'ok' ? 'msg-ok' : 'msg-error'}>{mensaje.texto}</p>}
      </div>
    </main>
  )
}