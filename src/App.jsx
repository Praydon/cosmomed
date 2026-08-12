import { useEffect, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import About from './components/About.jsx'
import BookingSteps from './components/BookingSteps.jsx'
import Contacts from './components/Contacts.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import PriceList from './components/PriceList.jsx'
import Services from './components/Services.jsx'
import { clinic, whatsappLink } from './data/pricing.js'

const logoUrl = '/logo.png'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileActionsVisible, setMobileActionsVisible] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = document.querySelectorAll('.reveal')
    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 720px)')
    const heroSentinel = document.querySelector('.hero-cta-sentinel')
    const blockers = [
      document.querySelector('.booking-cta'),
      document.querySelector('#contacts'),
      document.querySelector('.site-footer'),
    ].filter(Boolean)

    if (!heroSentinel || !('IntersectionObserver' in window)) return undefined

    let heroPassed = false
    const visibleBlockers = new Set()
    const updateVisibility = () => {
      setMobileActionsVisible(media.matches && heroPassed && visibleBlockers.size === 0)
    }

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        const topBoundary = entry.rootBounds?.top ?? 0
        heroPassed = !entry.isIntersecting && entry.boundingClientRect.bottom < topBoundary
        updateVisibility()
      },
      { rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()} 0px 0px`, threshold: 0 },
    )

    const blockerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleBlockers.add(entry.target)
          else visibleBlockers.delete(entry.target)
        })
        updateVisibility()
      },
      { rootMargin: '0px 0px 72px', threshold: 0 },
    )

    const onMediaChange = () => updateVisibility()
    heroObserver.observe(heroSentinel)
    blockers.forEach((element) => blockerObserver.observe(element))
    if (media.addEventListener) media.addEventListener('change', onMediaChange)
    else media.addListener?.(onMediaChange)

    return () => {
      heroObserver.disconnect()
      blockerObserver.disconnect()
      if (media.removeEventListener) media.removeEventListener('change', onMediaChange)
      else media.removeListener?.(onMediaChange)
    }
  }, [])

  const showMobileActions = mobileActionsVisible && !menuOpen

  return (
    <>
      <a className="skip-link" href="#main">Перейти к содержимому</a>
      <Header logoUrl={logoUrl} onMenuChange={setMenuOpen} />
      <main id="main">
        <Hero logoUrl={logoUrl} />
        <Services />
        <About />
        <PriceList />
        <BookingSteps />
        <Contacts />
      </main>
      <Footer logoUrl={logoUrl} />

      <a
        className="floating-whatsapp"
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Написать CosmoMed в WhatsApp"
      >
        <MessageCircle aria-hidden="true" />
        <span>Записаться</span>
      </a>

      <div
        className={`mobile-cta-bar${showMobileActions ? ' is-visible' : ''}`}
        aria-label="Быстрая связь"
        aria-hidden={!showMobileActions}
      >
        <a href={clinic.phoneHref} aria-label={`Позвонить: ${clinic.phoneDisplay}`} tabIndex={showMobileActions ? 0 : -1}>
          <Phone aria-hidden="true" size={19} />Позвонить
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          aria-label="Записаться в CosmoMed через WhatsApp"
          tabIndex={showMobileActions ? 0 : -1}
        >
          <MessageCircle aria-hidden="true" size={19} />WhatsApp
        </a>
      </div>
    </>
  )
}
