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
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '42px',
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="6" fill="white" />
          <rect x="4" y="4" width="11" height="11" rx="2" fill="#22C55E" />
          <rect x="17" y="4" width="11" height="11" rx="2" fill="#EAB308" />
          <rect x="4" y="17" width="11" height="11" rx="2" fill="#EAB308" />
          <rect x="17" y="17" width="11" height="11" rx="2" fill="#22C55E" />
          <path
            d="M7 16c0 .9.35 1.75.95 2.35.6.6 1.45.95 2.35.95 1.15 0 1.95-.4 2.6-1.05.6-.6 1.1-1.35 1.6-2.25-.5-.9-1-1.65-1.6-2.25-.65-.65-1.45-1.05-2.6-1.05-.9 0-1.75.35-2.35.95C7.35 14.25 7 15.1 7 16zm3.35 5.25c-1.4 0-2.75-.55-3.75-1.55-1-1-1.55-2.35-1.55-3.75s.55-2.75 1.55-3.75c1-1 2.35-1.55 3.75-1.55 1.7 0 3 .65 4 1.6.5.5 1 1.1 1.35 1.7.35-.6.85-1.2 1.35-1.7 1-1 2.3-1.6 4-1.6 1.4 0 2.75.55 3.75 1.55 1 1 1.55 2.35 1.55 3.75s-.55 2.75-1.55 3.75c-1 1-2.35 1.55-3.75 1.55-1.7 0-3-.65-4-1.6-.5-.5-1-1.1-1.35-1.7-.35.6-.85 1.2-1.35 1.7-1 .95-2.3 1.6-4 1.6zm6.35-5.25c.5.9 1 1.65 1.6 2.25.65.65 1.45 1.05 2.6 1.05.9 0 1.75-.35 2.35-.95.6-.6.95-1.45.95-2.35s-.35-1.75-.95-2.35c-.6-.6-1.45-.95-2.35-.95-1.15 0-1.95.4-2.6 1.05-.6.6-1.1 1.35-1.6 2.25z"
            fill="#1F2937"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
} 