import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const origin = window.location.origin

document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${origin}/`)
document.querySelector('meta[property="og:image"]')?.setAttribute('content', `${origin}/logo.png`)

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: 'CosmoMed',
  description:
    'Медицинский центр в Актау: консультации врачей, УЗИ, массаж, восстановительные и профилактические процедуры.',
  url: `${origin}/`,
  telephone: '+7 777 014 94 53',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '16-й микрорайон, 90, ЖК «Евразия»',
    addressLocality: 'Актау',
    addressCountry: 'KZ',
  },
  sameAs: ['https://www.instagram.com/cosmomed.kz/'],
}

const schema = document.createElement('script')
schema.type = 'application/ld+json'
schema.textContent = JSON.stringify(structuredData)
document.head.append(schema)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
