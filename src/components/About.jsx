import { Check, HeartPulse, MessageCircle, ScanLine, Stethoscope } from 'lucide-react'

const benefits = [
  'Несколько медицинских направлений в одном центре',
  'Консультации взрослых и детских специалистов',
  'УЗИ и процедуры в одном месте',
  'Удобная запись по телефону и WhatsApp',
  'Индивидуальный подбор процедур после консультации специалиста',
]

export default function About() {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="container about-layout">
        <div className="about-copy reveal">
          <p className="eyebrow"><span />О клинике</p>
          <h2 id="about-title">Консультации, УЗИ и процедуры в одном центре</h2>
          <p>
            CosmoMed объединяет консультации специалистов, диагностику и процедуры, чтобы основные вопросы можно было решить в одном месте.
          </p>
          <ul className="benefit-list">
            {benefits.map((benefit) => (
              <li key={benefit}><span><Check aria-hidden="true" size={17} /></span>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="about-visual reveal" aria-label="Направления медицинского центра CosmoMed">
          <div className="about-panel-main">
            <HeartPulse aria-hidden="true" size={34} strokeWidth={1.7} />
            <p>В центре внимания — ваш запрос и рекомендации специалиста</p>
          </div>
          <div className="about-panel-row">
            <div><Stethoscope aria-hidden="true" size={24} /><span>Консультации</span></div>
            <div><ScanLine aria-hidden="true" size={24} /><span>УЗИ</span></div>
            <div><MessageCircle aria-hidden="true" size={24} /><span>Запись в WhatsApp</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
