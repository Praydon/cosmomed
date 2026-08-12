import { ChevronLeft, ChevronRight, MessageCircle, Search, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { priceCategories, whatsappLink } from '../data/pricing.js'

const MOBILE_PRICE_LIMIT = 8

function PriceTable({ category, expanded, isSearch, onToggle }) {
  const hasRepeatPrice = category.items.some((item) => item.repeatPrice)
  const canExpand = !isSearch && category.items.length > MOBILE_PRICE_LIMIT

  return (
    <div className="price-table-wrap">
      <table className={`price-table${hasRepeatPrice ? ' has-repeat' : ''}`}>
        <thead>
          <tr>
            <th scope="col">{category.columns[0]}</th>
            <th scope="col">{category.columns[1]}</th>
            {hasRepeatPrice && <th scope="col">{category.columns[2]}</th>}
            <th scope="col"><span className="sr-only">Запись</span></th>
          </tr>
        </thead>
        <tbody id={`price-rows-${category.id}`}>
          {category.items.map((item, index) => (
            <tr
              className={`${index >= MOBILE_PRICE_LIMIT && !isSearch ? 'price-row-extra' : ''}${expanded ? ' is-visible' : ''}`}
              key={item.name}
            >
              <th scope="row">{item.name}</th>
              <td data-label={hasRepeatPrice ? 'Первичный приём' : 'Стоимость'}>
                <strong>{item.price}</strong>
              </td>
              {hasRepeatPrice && (
                <td data-label="Повторный приём"><strong>{item.repeatPrice}</strong></td>
              )}
              <td className="price-action">
                <a
                  href={whatsappLink(item.name)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Записаться на услугу «${item.name}» в WhatsApp`}
                >
                  <MessageCircle aria-hidden="true" size={17} />
                  <span>Запись</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {canExpand && (
        <button
          className="price-more"
          type="button"
          aria-expanded={expanded}
          aria-controls={`price-rows-${category.id}`}
          onClick={onToggle}
        >
          {expanded ? 'Свернуть список' : `Показать ещё (${category.items.length - MOBILE_PRICE_LIMIT})`}
        </button>
      )}
    </div>
  )
}

export default function PriceList() {
  const [activeId, setActiveId] = useState(priceCategories[0].id)
  const [query, setQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({})
  const [tabScrollState, setTabScrollState] = useState({ canScrollLeft: false, canScrollRight: true })
  const priceCardRef = useRef(null)
  const tabsListRef = useRef(null)
  const tabsRef = useRef([])
  const tabScrollCursorRef = useRef(0)
  const tabNudgeDoneRef = useRef(false)
  const tabNudgeTimersRef = useRef([])
  const tabInteractionRef = useRef(false)
  const normalizedQuery = query.trim().toLocaleLowerCase('ru')

  const visibleCategories = useMemo(() => {
    if (!normalizedQuery) {
      return priceCategories.filter((category) => category.id === activeId)
    }

    return priceCategories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.name.toLocaleLowerCase('ru').includes(normalizedQuery)),
      }))
      .filter((category) => category.items.length)
  }, [activeId, normalizedQuery])

  const matchCount = visibleCategories.reduce((total, category) => total + category.items.length, 0)

  const updateTabScrollState = useCallback(() => {
    const tabList = tabsListRef.current
    if (!tabList) return

    const maxScrollLeft = Math.max(0, tabList.scrollWidth - tabList.clientWidth)
    const tabs = tabsRef.current.filter(Boolean)
    if (tabs.length) {
      const referencePoint = tabList.scrollLeft + 8
      tabScrollCursorRef.current = tabs.reduce((nearestIndex, tab, index) => (
        Math.abs(tab.offsetLeft - referencePoint) < Math.abs(tabs[nearestIndex].offsetLeft - referencePoint)
          ? index
          : nearestIndex
      ), 0)
    }
    const nextState = {
      canScrollLeft: tabList.scrollLeft > 2,
      canScrollRight: tabList.scrollLeft < maxScrollLeft - 2,
    }

    setTabScrollState((current) => (
      current.canScrollLeft === nextState.canScrollLeft
      && current.canScrollRight === nextState.canScrollRight
        ? current
        : nextState
    ))
  }, [])

  const cancelTabNudge = useCallback(() => {
    tabInteractionRef.current = true
    tabNudgeTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    tabNudgeTimersRef.current = []
  }, [])

  const scrollTabIntoSafeView = useCallback((tab, behavior = 'smooth') => {
    const tabList = tabsListRef.current
    if (!tabList || !tab) return

    const maxScrollLeft = Math.max(0, tabList.scrollWidth - tabList.clientWidth)
    const currentLeft = tabList.scrollLeft
    const leftInset = currentLeft > 2 ? 56 : 8
    const rightInset = currentLeft < maxScrollLeft - 2 ? 56 : 8
    const tabLeft = tab.offsetLeft
    const tabRight = tabLeft + tab.offsetWidth
    let nextLeft = currentLeft

    if (tabLeft < currentLeft + leftInset) {
      nextLeft = tabLeft - leftInset
    } else if (tabRight > currentLeft + tabList.clientWidth - rightInset) {
      nextLeft = tabRight - tabList.clientWidth + rightInset
    }

    tabList.scrollTo({
      left: Math.max(0, Math.min(maxScrollLeft, nextLeft)),
      behavior,
    })
  }, [])

  const scrollCategories = (direction) => {
    cancelTabNudge()
    const tabList = tabsListRef.current
    const tabs = tabsRef.current.filter(Boolean)
    if (!tabList || !tabs.length) return

    const nextIndex = Math.max(0, Math.min(
      tabs.length - 1,
      tabScrollCursorRef.current + direction,
    ))
    tabScrollCursorRef.current = nextIndex

    tabList.scrollTo({
      left: Math.max(0, tabs[nextIndex].offsetLeft - 8),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  useEffect(() => {
    const onCategorySelect = (event) => {
      if (!priceCategories.some((category) => category.id === event.detail)) return
      setActiveId(event.detail)
      setQuery('')
    }

    window.addEventListener('cosmomed:select-price-category', onCategorySelect)
    return () => window.removeEventListener('cosmomed:select-price-category', onCategorySelect)
  }, [])

  useEffect(() => {
    if (!window.matchMedia('(max-width: 767px)').matches) return
    const activeIndex = priceCategories.findIndex((category) => category.id === activeId)
    const activeTab = tabsRef.current[activeIndex]
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!activeTab) return

    const frame = window.requestAnimationFrame(() => {
      scrollTabIntoSafeView(activeTab, reduceMotion ? 'auto' : 'smooth')
    })
    return () => window.cancelAnimationFrame(frame)
  }, [activeId, scrollTabIntoSafeView])

  useEffect(() => {
    const tabList = tabsListRef.current
    if (!tabList) return undefined

    const resizeObserver = 'ResizeObserver' in window
      ? new ResizeObserver(updateTabScrollState)
      : null
    resizeObserver?.observe(tabList)
    tabList.addEventListener('scroll', updateTabScrollState, { passive: true })
    window.addEventListener('resize', updateTabScrollState)
    updateTabScrollState()

    return () => {
      resizeObserver?.disconnect()
      tabList.removeEventListener('scroll', updateTabScrollState)
      window.removeEventListener('resize', updateTabScrollState)
    }
  }, [updateTabScrollState])

  useEffect(() => {
    const priceCard = priceCardRef.current
    const tabList = tabsListRef.current
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!priceCard || !tabList || !isMobile || reduceMotion || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || tabNudgeDoneRef.current || tabInteractionRef.current) return
        tabNudgeDoneRef.current = true

        const forwardTimer = window.setTimeout(() => {
          if (tabInteractionRef.current) return
          tabList.scrollTo({ left: 22, behavior: 'smooth' })

          const returnTimer = window.setTimeout(() => {
            if (!tabInteractionRef.current) tabList.scrollTo({ left: 0, behavior: 'smooth' })
          }, 260)
          tabNudgeTimersRef.current.push(returnTimer)
        }, 160)
        tabNudgeTimersRef.current.push(forwardTimer)
        observer.disconnect()
      },
      { threshold: 0.32 },
    )

    observer.observe(priceCard)
    return () => {
      observer.disconnect()
      tabNudgeTimersRef.current.forEach((timer) => window.clearTimeout(timer))
      tabNudgeTimersRef.current = []
    }
  }, [])

  const handleTabKeyDown = (event, index) => {
    let nextIndex = null
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % priceCategories.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + priceCategories.length) % priceCategories.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = priceCategories.length - 1
    if (nextIndex === null) return

    event.preventDefault()
    const nextCategory = priceCategories[nextIndex]
    setActiveId(nextCategory.id)
    setQuery('')
    tabsRef.current[nextIndex]?.focus()
  }

  return (
    <section className="section prices-section" id="prices" aria-labelledby="prices-title">
      <div className="container">
        <div className="price-heading-row reveal">
          <div className="section-heading">
            <p className="eyebrow"><span />Стоимость услуг</p>
            <h2 id="prices-title">Полный прайс-лист</h2>
            <p>Переключайте направления или найдите нужную услугу по названию.</p>
          </div>
          <div className="price-search">
            <label htmlFor="price-search">Поиск по всем услугам</label>
            <div className="search-field">
              <Search aria-hidden="true" size={20} />
              <input
                id="price-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Например, УЗИ почек"
                autoComplete="off"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Очистить поиск">
                  <X aria-hidden="true" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="price-card reveal" ref={priceCardRef}>
          <div
            className={`price-tabs-shell${tabScrollState.canScrollLeft ? ' can-scroll-left' : ''}${tabScrollState.canScrollRight ? ' can-scroll-right' : ''}`}
          >
            {tabScrollState.canScrollLeft && (
              <button
                className="price-tabs-arrow price-tabs-arrow-previous"
                type="button"
                aria-label="Показать предыдущую категорию"
                onClick={() => scrollCategories(-1)}
              >
                <ChevronLeft aria-hidden="true" size={20} />
              </button>
            )}
            <div
              ref={tabsListRef}
              className={`price-tabs${normalizedQuery ? ' is-searching' : ''}`}
              role="tablist"
              aria-label={normalizedQuery ? 'Категории прайс-листа. Поиск выполняется по всем категориям' : 'Категории прайс-листа'}
              onPointerDown={cancelTabNudge}
              onTouchStart={cancelTabNudge}
              onWheel={cancelTabNudge}
              onKeyDownCapture={cancelTabNudge}
            >
              {priceCategories.map((category, index) => {
                const isActive = category.id === activeId
                return (
                  <button
                    key={category.id}
                    ref={(element) => { tabsRef.current[index] = element }}
                    id={`tab-${category.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${category.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => {
                      setActiveId(category.id)
                      setQuery('')
                    }}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
            {tabScrollState.canScrollRight && (
              <button
                className="price-tabs-arrow price-tabs-arrow-next"
                type="button"
                aria-label="Показать следующую категорию"
                onClick={() => scrollCategories(1)}
              >
                <ChevronRight aria-hidden="true" size={20} />
              </button>
            )}
          </div>

          <div className="price-results" aria-live="polite">
            {normalizedQuery && (
              <p className="search-summary">
                {matchCount > 0
                  ? `Поиск по всем категориям · Найдено услуг: ${matchCount}`
                  : `Поиск по всем категориям · По запросу «${query.trim()}» ничего не найдено`}
              </p>
            )}

            {visibleCategories.map((category) => (
              <div
                className="price-panel"
                key={category.id}
                id={`panel-${category.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${category.id}`}
              >
                {normalizedQuery && <h3>{category.label}</h3>}
                <PriceTable
                  category={category}
                  expanded={Boolean(expandedCategories[category.id])}
                  isSearch={Boolean(normalizedQuery)}
                  onToggle={() => {
                    setExpandedCategories((current) => ({
                      ...current,
                      [category.id]: !current[category.id],
                    }))
                  }}
                />
              </div>
            ))}
          </div>

          <p className="price-note">
            Цены указаны в тенге. Актуальную стоимость, подготовку и наличие свободного времени уточняйте у администратора.
          </p>
        </div>
      </div>
    </section>
  )
}
