import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORY_ORDER, MENU, MenuCategory, MenuItem } from './data/menu'

type ViewMode = 'grid' | 'list'

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }, [key, value])
  return [value, setValue] as const
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 1] }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids.join(',')])
  return active
}

function formatPrice(p: string) { return `₹ ${p}` }

function ItemCard({ item, onOpen }: { item: MenuItem, onOpen: (src: string, alt: string) => void }) {
  const [src] = useState(item.image)
  return (
    <article className="card fade-in" aria-label={item.name}>
      <div className="thumb" onClick={() => onOpen(src, item.name)}>
        <img loading="lazy" decoding="async" src={src} alt={item.name} width={600} height={400} />
      </div>
      <div className="name">{item.name}</div>
      <div className="meta">
        <span className="kcal" aria-label="calories">≈ {item.kcal} kcal</span>
        <span className="price">{formatPrice(item.price)}</span>
      </div>
    </article>
  )
}

function ItemRow({ item, onOpen }: { item: MenuItem, onOpen: (src: string, alt: string) => void }) {
  const [src] = useState(item.image)
  return (
    <article className="row fade-in" aria-label={item.name}>
      <div className="thumb" onClick={() => onOpen(src, item.name)}>
        <img loading="lazy" decoding="async" src={src} alt={item.name} width={300} height={200} />
      </div>
      <div>
        <div className="name">{item.name}</div>
        <div className="kcal">≈ {item.kcal} kcal</div>
      </div>
      <div className="price">{formatPrice(item.price)}</div>
    </article>
  )
}

function CategorySection({ category, view, onOpen }: { category: MenuCategory, view: ViewMode, onOpen: (src: string, alt: string) => void }) {
  const Layout = view === 'grid' ?
    <div className="grid">{category.items.map(i => <ItemCard key={i.name} item={i} onOpen={onOpen} />)}</div> :
    <div className="list">{category.items.map(i => <ItemRow key={i.name} item={i} onOpen={onOpen} />)}</div>

  return (
    <section id={category.id} aria-labelledby={`${category.id}-title`}>
      <h2 className="section-title" id={`${category.id}-title`}>{category.title}</h2>
      {Layout}
    </section>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [view, setView] = useLocalStorage<ViewMode>('fruitzzUpp:view', 'grid')
  const active = useScrollSpy(CATEGORY_ORDER.map(c => c.id))
  const topRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const [showTop, setShowTop] = useState(false)
  const [lightbox, setLightbox] = useState<{src: string, alt: string} | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return MENU
    const q = query.trim().toLowerCase()
    return MENU.map(cat => ({
      ...cat,
      items: cat.items.filter(i => i.name.toLowerCase().includes(q)),
    })).filter(cat => cat.items.length > 0)
  }, [query])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Menu',
      'name': 'FruitzzUpp Cafe Menu',
      'hasMenuSection': MENU.map(section => ({
        '@type': 'MenuSection',
        'name': section.title,
        'hasMenuItem': section.items.map(item => ({
          '@type': 'MenuItem',
          'name': item.name,
          'offers': { '@type': 'Offer', 'priceCurrency': 'INR', 'price': item.price },
          'nutrition': { '@type': 'NutritionInformation', 'calories': `${item.kcal} cal` }
        }))
      }))
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(jsonLd)
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep CSS header offset in sync with actual header height
  useEffect(() => {
    const setOffset = () => {
      const h = headerRef.current?.offsetHeight ?? 148
      document.documentElement.style.setProperty('--header-offset', `${h}px`)
    }
    setOffset()
    const ro = new ResizeObserver(setOffset)
    if (headerRef.current) ro.observe(headerRef.current)
    window.addEventListener('resize', setOffset)
    return () => { ro.disconnect(); window.removeEventListener('resize', setOffset) }
  }, [])

  // Smooth sliding category indicator
  useEffect(() => {
    const container = document.getElementById('catInner')
    const highlight = document.getElementById('catHighlight') as HTMLDivElement | null
    if (!container || !highlight) return
    const update = () => {
      const activeEl = container.querySelector('.cat-chip.active') as HTMLButtonElement | null
      if (!activeEl) return
      const rect = activeEl.getBoundingClientRect()
      const crect = container.getBoundingClientRect()
      const left = rect.left - crect.left + container.scrollLeft
      const width = rect.width
      highlight.style.left = `${left}px`
      highlight.style.width = `${width}px`
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(container)
    window.addEventListener('resize', update)
    container.addEventListener('scroll', update, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      container.removeEventListener('scroll', update)
    }
  }, [active])

  return (
    <>
      {/* decorative elements removed per request */}

      <header className="brand-header" ref={(el)=>{topRef.current=el as any; headerRef.current=el}}>
        <div className="brand-inner container" style={{ paddingBottom: 4 }}>
          <div className="logo">FruitzzUpp</div>
        </div>
        <div className="toolbar container" style={{ paddingTop: 6 }}>
          <label className="search" aria-label="Search menu">
            <span className="sr-only">Search</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              placeholder="Search menu..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-describedby="search-help"
            />
          </label>
          <div className="toggle" role="group" aria-label="View toggle">
            <button aria-pressed={view==='grid'} onClick={() => setView('grid')} aria-label="Grid view" title="Grid view">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>
            </button>
            <button aria-pressed={view==='list'} onClick={() => setView('list')} aria-label="List view" title="List view">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="4" y="5" width="16" height="3" rx="1.5"/><rect x="4" y="10.5" width="16" height="3" rx="1.5"/><rect x="4" y="16" width="16" height="3" rx="1.5"/></svg>
            </button>
          </div>
        </div>
        <nav className="categories container" aria-label="Categories">
          <div className="categories-inner" id="catInner">
            {CATEGORY_ORDER.map(c => (
              <button
                key={c.id}
                className={`cat-chip ${active===c.id ? 'active' : ''}`}
                onClick={(e) => { scrollTo(c.id) }}
                aria-current={active===c.id ? 'true' : undefined}
              >{c.title}</button>
            ))}
            <div className="cat-highlight" id="catHighlight" />
            <div className="cat-indicator" id="catIndicator" />
          </div>
        </nav>
      </header>

      <main className="container" id="top">
        {(query ? filtered : MENU).map(section => (
          <CategorySection key={section.id} category={section} view={view} onOpen={(src, alt) => setLightbox({ src, alt })} />
        ))}
      </main>

      <button
        className="fab-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        hidden={!showTop}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
      </button>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} />
          </div>
        </div>
      )}

      <footer className="container" style={{ paddingTop: 28, paddingBottom: 56 }}>
        <div style={{
          display: 'grid',
          placeItems: 'center',
        }}>
          <a href="https://edot.studio" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-grid',
              gridAutoFlow: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 999,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.42))',
              border: '1px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(8px) saturate(115%)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset, 0 10px 26px rgba(46,94,78,0.16)',
              color: '#2e5e4e',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <span style={{ fontFamily: 'Great Vibes, Pacifico, cursive', fontSize: 18 }}>Designed by</span>
            <span style={{ borderLeft: '1px solid rgba(46,94,78,0.25)', height: 16 }} />
            <span style={{ display: 'inline-grid', gridAutoFlow: 'column', alignItems: 'center', gap: 6 }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3c3 4 3 14 0 18"/></svg>
              EdotStudio
            </span>
          </a>
        </div>
      </footer>
    </>
  )
}

export default App


