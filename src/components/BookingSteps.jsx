import { ArrowRight, CalendarCheck, MessageCircle, Phone, SearchCheck } from 'lucide-react'
import { clinic, whatsappLink } from '../data/pricing.js'

const steps = [
  { number: '01', icon: SearchCheck, title: 'Выберите услугу', text: 'Посмотрите направления и актуальный прайс.' },
  { number: '02', icon: MessageCircle, title: 'Свяжитесь с нами', text: 'Напишите в WhatsApp или позвоните.' },
  { number: '03', icon: CalendarCheck, title: 'Подтвердите время', text: 'Администратор предложит и подтвердит время приёма.' },
]

export default function BookingSteps() {
  return (
    <section className="section booking-section" id="booking" aria-labelledby="booking-title">
      <div className="container">
        <div className="section-heading centered reveal">
          <p className="eyebrow"><span />Три простых шага</p>
          <h2 id="booking-title">Как записаться</h2>
        </div>

        <ol className="steps-list">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <li className="step-card reveal" key={step.number} style={{ '--delay': `${index * 70}ms` }}>
                <span className="step-icon"><Icon aria-hidden="true" size={25} /></span>
                <div className="step-body">
                  <span className="step-number">Шаг {step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="booking-cta reveal">
          <div>
            <p className="cta-kicker">Нужна помощь с выбором?</p>
            <h2>Поможем подобрать услугу и удобное время</h2>
          </div>
          <div className="cta-actions">
            <a className="button button-light button-large" href={whatsappLink()} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" size={20} />
              Написать в WhatsApp
            </a>
            <a className="button button-ghost-light button-large" href={clinic.phoneHref}>
              <Phone aria-hidden="true" size={20} />
              Позвонить
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
