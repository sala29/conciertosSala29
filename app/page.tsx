import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export default async function Home() {
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <main>
      <header className="header">
        <span className="header-logo">🎵 SALA 29</span>
        <nav className="header-nav">
          <Link href="/admin/login" className="btn btn-secondary btn-sm">Admin</Link>
        </nav>
      </header>

      {/* HERO */}
      <div className="home-hero fade-in">
        <h1>PRÓXIMAS FREE SESIONS</h1>
        <p>Consulta la agenda y apúntate a la lista</p>

        {/* BANNER REGISTRO */}
        <div className="register-banner">
          <div className="register-banner-icon">🎫</div>
          <div className="register-banner-text">
            <strong>¿Quieres acceder a Sala 29?</strong>
            <span>Para poder asistir a nuestros eventos deberás estar registrado como socio de acceso.</span>
          </div>
          
            <a href="https://accesossala29-front.onrender.com/usuarios/usuarios.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary register-banner-btn"
          >
            Registrarse
          </a>
        </div>
      </div>

      {/* GRID DE EVENTOS */}
      <div className="events-grid fade-in">
        {events && events.length > 0 ? (
          events.map((event) => (
            <Link href={`/eventos/${event.id}`} key={event.id} className="event-card">
              {event.photo_url
                ? <img src={event.photo_url} alt={event.title} className="event-card-img" />
                : <div className="event-card-no-img">🎸</div>
              }
              <div className="event-card-body">
                <div className="event-card-title">{event.title}</div>
                <div className="event-card-date">
                  📅 {new Date(event.date).toLocaleDateString('es-ES', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </div>
                <div className="event-card-desc">{event.description}</div>
                <div className="event-card-price">
                  {event.price === 0 ? 'Entrada gratuita' : `${event.price} €`}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-state">No hay eventos próximos por ahora.</div>
        )}
      </div>

      {/* BANNER REGISTRO INFERIOR */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px' }}>
        <div className="register-banner register-banner-bottom">
          <div className="register-banner-icon">🎫</div>
          <div className="register-banner-text">
            <strong>¿Aún no eres socio?</strong>
            <span>Regístrate ahora y accede a todos nuestros eventos en Sala 29.</span>
          </div>
          
            <a href="https://accesossala29-front.onrender.com/usuarios/usuarios.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary register-banner-btn"
          >
            Registrarse
          </a>
        </div>
      </div>

    </main>
  )
}