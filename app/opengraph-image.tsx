import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Multi-Wordle'
export const size = {
    width: 1200,
    height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '40px',
          position: 'relative',
        }}
      >
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #22c55e, #eab308)',
        }} />
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {['M','U','L','T','I'].map((letter, i) => (
            <div
              key={i}
              style={{
                background: '#22c55e',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                color: 'white',
                fontSize: 48,
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['W','O','R','D','L','E'].map((letter, i) => (
            <div
              key={i}
              style={{
                background: i === 0 ? '#22c55e' : '#eab308',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                color: 'white',
                fontSize: 48,
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <p style={{ 
          color: '#ffffff', 
          fontSize: 32,
          marginTop: '20px',
          textAlign: 'center',
          maxWidth: '700px',
          lineHeight: 1.4,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
        }}>
          Juega al Wordle con múltiples palabras simultáneamente
        </p>
        
        <div style={{
          position: 'absolute',
          bottom: '30px',
          color: '#9ca3af',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          Desarrollado con
          <span style={{ color: '#ef4444', fontSize: 20 }}>♥</span>
          por Pablo Carvalho
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}