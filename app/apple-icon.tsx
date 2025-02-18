import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '20px',
          borderRadius: '36px',
        }}
      >
        <div style={{ background: '#22c55e', borderRadius: '12px', width: '45%', height: '45%' }} />
        <div style={{ background: '#eab308', borderRadius: '12px', width: '45%', height: '45%' }} />
        <div style={{ background: '#eab308', borderRadius: '12px', width: '45%', height: '45%' }} />
        <div style={{ background: '#22c55e', borderRadius: '12px', width: '45%', height: '45%' }} />
      </div>
    ),
    { ...size }
  )
} 