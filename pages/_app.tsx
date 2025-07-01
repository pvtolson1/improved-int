// pages/_app.tsx
import '@tldraw/tldraw/tldraw.css'
import '../styles/globals.css'
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}