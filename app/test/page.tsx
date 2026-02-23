export default function Test() {
  return (
    <main style={{ padding: '40px', color: 'white', background: '#000', minHeight: '100vh' }}>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      <p>KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20)}...</p>
    </main>
  )
}