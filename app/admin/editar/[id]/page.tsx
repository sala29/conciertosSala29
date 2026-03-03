'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import FotoUploader from '@/components/FotoUploader'

export default function AdminEditar() {
  const router = useRouter()
  const { id } = useParams()
  const [checking, setChecking] = useState(true)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'ok' | 'error' } | null>(null)
  const [form, setForm] = useState({ title: '', date: '', description: '', price: '', photo_url: '' })

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      const { data } = await supabase.from('events').select('*').eq('id', id).single()
      if (data) {
        setForm({
          title: data.title,
          date: new Date(data.date).toISOString().slice(0, 16),
          description: data.description || '',
          price: data.price?.toString() || '0',
          photo_url: data.photo_url || '',
        })
      }
      setChecking(false)
    }
    init()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)
    const { error } = await supabase.from('events').update({
      title: form.title, date: new Date(form.date).toISOString(), description: form.description,
      price: parseFloat(form.price) || 0, photo_url: form.photo_url || null,
    }).eq('id', id)
    if (error) {
      setMensaje({ texto: 'Error al guardar.', tipo: 'error' })
    } else {
      setMensaje({ texto: '✅ Evento actualizado correctamente.', tipo: 'ok' })
      router.push('/admin')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('¿Seguro que quieres eliminar este evento?')) return
    await supabase.from('events').delete().eq('id', id)
    router.push('/admin')
  }

  if (checking) return (
    <main className="login-wrapper">
      <p style={{ color: '#9cc8f0' }}>Cargando...</p>
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
        <h2>Editar evento</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <input name="title" type="text" placeholder="Título del evento" value={form.title} onChange={handleChange} required />
          <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required min={new Date().toISOString().slice(0, 16)} />
          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} rows={4} style={{ resize: 'none' }} />
          <input name="price" type="number" min="0" step="0.01" placeholder="Precio" value={form.price} onChange={handleChange} required />
          <FotoUploader currentUrl={form.photo_url} onUpload={(url) => setForm({ ...form, photo_url: url })} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        {mensaje && <p className={mensaje.tipo === 'ok' ? 'msg-ok' : 'msg-error'}>{mensaje.texto}</p>}

        <div style={{ marginTop: '40px', borderTop: '1px solid rgba(42,163,255,0.15)', paddingTop: '28px' }}>
          <button onClick={handleDelete} className="btn btn-danger" style={{ width: '100%' }}>
            🗑 Eliminar evento
          </button>
        </div>
      </div>
    </main>
  )
}