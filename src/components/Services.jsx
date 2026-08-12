import {
  Activity,
  Droplets,
  Hand,
  Leaf,
  MessageCircle,
  Route,
  ScanLine,
  Sparkles,
  Stethoscope,
  Sun,
} from 'lucide-react'
import { useState } from 'react'
import { services, whatsappLink } from '../data/pricing.js'

const icons = {
  droplets: Droplets,
  leaf: Leaf,
  hand: Hand,
  scan: ScanLine,
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  activity: Activity,
  route: Route,
  sun: Sun,
}

export default function Services() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="section services-section" id="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-heading reveal">
          <p className="eyebrow"><span />Направления центра</p>
          <h2 id="services-title">Основные услуги CosmoMed</h2>
          <p>Выберите нужное направление — администратор подскажет по подготовке и свободному времени.</p>
        </div>
        <div className={`services-grid${isExpanded ? ' is-expanded' : ''}`} id="services-grid">
          {services.map((service, index) => {
            const Icon = icons[service.icon]
            return (
              <article
                className={`service-card reveal${index >= 5 ? ' service-card-extra' : ''}`}
                key={service.name}
                style={{ '--delay': `${index * 45}ms` }}
              >
                <div className="service-card-top">
                  <span className="service-icon"><Icon aria-hidden="true" size={25} strokeWidth={1.8} /></span>
                  <span className="service-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-card-bottom">
                  {service.priceCategory ? (
                    <a
                      className="service-price-link"
                      href="#prices"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('cosmomed:select-price-category', { detail: service.priceCategory }))
                      }}
                    >
                      {service.price}
                    </a>
                  ) : (
                    <strong>{service.price}</strong>
                  )}
                  <a
                    href={whatsappLink(service.name)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Записаться на услугу «${service.name}» в WhatsApp`}
                  >
                    <MessageCircle aria-hidden="true" size={17} />
                    Записаться
                  </a>
                </div>
              </article>
            )
          })}
        </div>
        <button
          className="services-toggle button button-secondary"
          type="button"
          aria-expanded={isExpanded}
          aria-controls="services-grid"
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? 'Скрыть дополнительные услуги' : 'Показать все услуги'}
        </button>
      </div>
    </section>
  )
}
