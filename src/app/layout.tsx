import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Noticias Live - Portal de Noticias en Tiempo Real',
  description: 'Tu fuente de noticias en tiempo real con canales en vivo',
  keywords: 'noticias, en vivo, actualidad, canales, streaming',
  authors: [{ name: 'Noticias Live' }],
  icons: {
    icon: '/noticias-live.png',
    apple: '/noticias-live.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Noticias Live',
    title: 'Noticias Live - Portal de Noticias en Tiempo Real',
    description: 'Tu fuente de noticias en tiempo real con canales en vivo',
    images: ['/noticias-live.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noticias Live',
    description: 'Tu fuente de noticias en tiempo real',
    images: ['/noticias-live.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-fondo text-texto-primario antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A1A',
              color: '#FFFFFF',
              border: '1px solid #2A2A2A',
            },
            success: {
              iconTheme: {
                primary: '#DC2626',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
