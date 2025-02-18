import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2px',
          padding: '4px',
          borderRadius: '6px',
        }}
      >
        <div style={{ background: '#22c55e', borderRadius: '3px', width: '45%', height: '45%' }} />
        <div style={{ background: '#eab308', borderRadius: '3px', width: '45%', height: '45%' }} />
        <div style={{ background: '#eab308', borderRadius: '3px', width: '45%', height: '45%' }} />
        <div style={{ background: '#22c55e', borderRadius: '3px', width: '45%', height: '45%' }} />
      </div>
    ),
    { ...size }
  )
} 