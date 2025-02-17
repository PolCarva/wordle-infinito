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
          background: 'linear-gradient(to bottom right, #ffffff, #f3f4f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {['M','U','L','T','I'].map((letter, i) => (
            <div
              key={i}
              style={{
                background: '#22c55e',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                color: 'white',
                fontSize: 36,
                fontWeight: 'bold',
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['W','O','R','D','L','E'].map((letter, i) => (
            <div
              key={i}
              style={{
                background: i === 0 ? '#22c55e' : '#eab308',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                color: 'white',
                fontSize: 36,
                fontWeight: 'bold',
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <p style={{ 
          color: '#4b5563', 
          fontSize: 24,
          marginTop: '20px',
          textAlign: 'center',
          maxWidth: '600px',
        }}>
          Juega al Wordle con múltiples palabras simultáneamente
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}