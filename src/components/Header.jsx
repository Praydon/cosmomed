import { useEffect, useRef, useState } from 'react'
import { Menu, MessageCircle, X } from 'lucide-react'
import { whatsappLink } from '../data/pricing.js'

const navItems = [
  { href: '#services', label: 'Услуги' },
  { href: '#prices', label: 'Прайс' },
  { href: '#about', label: 'О клинике' },
  { href: '#contacts', label: 'Контакты' },
]

export default function Header({ logoUrl, onMenuChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('')
  const menuRef = useRef(null)
  const toggleRef = useRef(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    onMenuChange?.(isOpen)
    if (wasOpenRef.current && !isOpen) {
      requestAnimationFrame(() => toggleRef.current?.focus({ preventScroll: true }))
    }
    wasOpenRef.current = isOpen
  }, [isOpen, onMenuChange])

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean)

    if (!('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveHref(`#${visible.target.id}`)
      },
      { rootMargin: '-32% 0px -58%', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const firstLink = menuRef.current?.querySelector('a')
    firstLink?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !menuRef.current) return
      const focusable = [...menuRef.current.querySelectorAll('a, button')]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.documentElement.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand-lockup" href="#top" aria-label="CosmoMed — на главную">
            <img src={logoUrl} width="48" height="46" alt="" />
            <span className="brand-copy">
              <span className="brand-name">CosmoMed</span>
              <span className="brand-subtitle">медицинская клиника</span>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Основная навигация">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={activeHref === item.href ? 'location' : undefined}
                onClick={() => setActiveHref(item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className="button button-primary header-cta"
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            aria-label="Записаться в CosmoMed через WhatsApp"
          >
            <MessageCircle aria-hidden="true" size={18} />
            Записаться
          </a>

          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div
        className={`mobile-menu-shell${isOpen ? ' is-open' : ''}`}
        aria-hidden={!isOpen}
        onClick={(event) => {
          if (event.currentTarget === event.target) setIsOpen(false)
        }}
      >
        <nav
          ref={menuRef}
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Мобильная навигация"
        >
          <p className="mobile-menu-label">Навигация</p>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={activeHref === item.href ? 'location' : undefined}
              onClick={() => {
                setActiveHref(item.href)
                setIsOpen(false)
              }}
              tabIndex={isOpen ? 0 : -1}
            >
              {item.label}
            </a>
          ))}
          <a
            className="button button-primary"
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsOpen(false)}
            tabIndex={isOpen ? 0 : -1}
          >
            <MessageCircle aria-hidden="true" size={19} />
            Записаться в WhatsApp
          </a>
        </nav>
      </div>
    </>
  )
}
