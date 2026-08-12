import { Instagram, MessageCircle, Phone } from 'lucide-react'
import { clinic, whatsappLink } from '../data/pricing.js'

export default function Footer({ logoUrl }) {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <a className="brand-lockup brand-lockup-footer" href="#top" aria-label="CosmoMed — на главную">
            <img src={logoUrl} width="52" height="50" alt="" loading="lazy" />
            <span className="brand-copy">
              <span className="brand-name">CosmoMed</span>
              <span className="brand-subtitle">медицинская клиника</span>
            </span>
          </a>
          <p>{clinic.profile}. Консультации, УЗИ и процедуры в одном центре.</p>
        </div>

        <nav className="footer-nav" aria-label="Навигация в подвале">
          <strong>Разделы</strong>
          <a href="#services">Услуги</a>
          <a href="#prices">Прайс</a>
          <a href="#about">О клинике</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <div className="footer-contacts">
          <strong>Связаться</strong>
          <a href={clinic.phoneHref}><Phone aria-hidden="true" size={17} />{clinic.phoneDisplay}</a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={17} />WhatsApp</a>
          <a href={clinic.instagram} target="_blank" rel="noreferrer"><Instagram aria-hidden="true" size={17} />@cosmomed.kz</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} CosmoMed</p>
        <p>Информация на сайте носит ознакомительный характер и не заменяет консультацию специалиста. Имеются противопоказания.</p>
      </div>
    </footer>
  )
}
