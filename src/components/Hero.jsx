import { ArrowDown, MapPin, MessageCircle, Phone, ShieldCheck, Stethoscope } from 'lucide-react'
import { clinic, whatsappLink } from '../data/pricing.js'

export default function Hero({ logoUrl }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow"><span />{clinic.profile}</p>
          <h1 id="hero-title">
            <span className="hero-title-desktop">Забота о здоровье — комплексно и в одном месте</span>
            <span className="hero-title-mobile">Забота о здоровье — в одном месте</span>
          </h1>
          <p className="hero-lead">
            Консультации врачей, УЗИ, восстановительные и профилактические процедуры в CosmoMed.
          </p>
          <div className="hero-actions">
            <a
              className="button button-primary button-large"
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              aria-label="Записаться в CosmoMed через WhatsApp"
            >
              <MessageCircle aria-hidden="true" size={20} />
              Записаться в WhatsApp
            </a>
            <a className="button button-secondary button-large" href="#services">
              Посмотреть услуги
              <ArrowDown aria-hidden="true" size={18} />
            </a>
          </div>
          <span className="hero-cta-sentinel" aria-hidden="true" />
          <div className="hero-contacts" aria-label="Контактная информация">
            <a href={clinic.phoneHref} aria-label={`Позвонить: ${clinic.phoneDisplay}`}>
              <span className="contact-icon"><Phone aria-hidden="true" size={18} /></span>
              <span><small>Телефон</small>{clinic.phoneDisplay}</span>
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Открыть адрес CosmoMed на карте"
            >
              <span className="contact-icon"><MapPin aria-hidden="true" size={18} /></span>
              <span><small>Адрес</small>{clinic.address}</span>
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="CosmoMed — консультации, УЗИ и процедуры">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="hero-logo-wrap">
            <div className="hero-logo-halo" aria-hidden="true" />
            <img src={logoUrl} width="460" height="438" alt="Логотип медицинской клиники CosmoMed" />
          </div>
          <div className="hero-note hero-note-top">
            <span className="note-icon"><Stethoscope aria-hidden="true" size={20} /></span>
            <span><strong>Несколько направлений</strong><small>в одном медицинском центре</small></span>
          </div>
          <div className="hero-note hero-note-bottom">
            <span className="note-icon green"><ShieldCheck aria-hidden="true" size={20} /></span>
            <span><strong>Удобная запись</strong><small>по телефону или в WhatsApp</small></span>
          </div>
        </div>
      </div>
    </section>
  )
}
