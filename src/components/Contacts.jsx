import { ArrowUpRight, Instagram, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import { clinic, whatsappLink } from '../data/pricing.js'

const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`

export default function Contacts() {
  return (
    <section className="section contacts-section" id="contacts" aria-labelledby="contacts-title">
      <div className="container contacts-layout">
        <div className="contacts-copy reveal">
          <p className="eyebrow"><span />Контакты</p>
          <h2 id="contacts-title">CosmoMed в Актау</h2>
          <p>Свяжитесь с администратором удобным способом или постройте маршрут до медицинского центра.</p>
          <a className="button button-primary button-large" href={mapLink} target="_blank" rel="noreferrer">
            <Navigation aria-hidden="true" size={19} />
            Построить маршрут
          </a>
        </div>

        <address className="contacts-card reveal">
          <a href={mapLink} target="_blank" rel="noreferrer" className="contact-row">
            <span className="contact-row-icon"><MapPin aria-hidden="true" /></span>
            <span><small>Адрес</small><strong>{clinic.address}</strong></span>
            <ArrowUpRight aria-hidden="true" className="row-arrow" />
          </a>
          <a href={clinic.phoneHref} className="contact-row">
            <span className="contact-row-icon"><Phone aria-hidden="true" /></span>
            <span><small>Телефон</small><strong>{clinic.phoneDisplay}</strong></span>
            <ArrowUpRight aria-hidden="true" className="row-arrow" />
          </a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="contact-row">
            <span className="contact-row-icon green"><MessageCircle aria-hidden="true" /></span>
            <span><small>WhatsApp</small><strong>Написать администратору</strong></span>
            <ArrowUpRight aria-hidden="true" className="row-arrow" />
          </a>
          <a href={clinic.instagram} target="_blank" rel="noreferrer" className="contact-row">
            <span className="contact-row-icon"><Instagram aria-hidden="true" /></span>
            <span><small>Instagram</small><strong>@cosmomed.kz</strong></span>
            <ArrowUpRight aria-hidden="true" className="row-arrow" />
          </a>
        </address>
      </div>
    </section>
  )
}
