import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORY_ORDER, MENU, MenuCategory, MenuItem } from './data/menu'
 

type ViewMode = 'grid' | 'list'

// Filter types
type FilterType = {
  maxCalories: number | null
  healthyPicks: boolean
  vegetarian: boolean
  favourites: boolean
}

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

function ItemCard({ item, onTap }: { item: MenuItem, onTap: (item: MenuItem, event: React.MouseEvent) => void }) {
  const [src] = useState(item.image)
  return (
    <article className="card fade-in" aria-label={item.name}>
      <div className="thumb" onClick={(e) => onTap(item, e)}>
        <img loading="lazy" decoding="async" src={src} alt={item.name} width={600} height={400} />
      </div>
      <div className="name-container">
        <div className="name">{item.name}</div>
        <div className="dietary-icons">
          {item.isHealthy && (
            <span className="dietary-icon healthy" title="Healthy option">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </span>
          )}
          {item.isVegetarian && (
            <span className="dietary-icon vegetarian" title="Vegetarian">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2"/>
                <circle cx="12" cy="12" r="4" fill="#16a34a"/>
              </svg>
            </span>
          )}
        </div>
      </div>
      <div className="meta">
        <span className="kcal" aria-label="calories">≈ {item.kcal} kcal</span>
        <span className="price">{formatPrice(item.price)}</span>
      </div>
    </article>
  )
}

function ItemRow({ item, onTap }: { item: MenuItem, onTap: (item: MenuItem, event: React.MouseEvent) => void }) {
  const [src] = useState(item.image)
  return (
    <article className="row fade-in" aria-label={item.name}>
      <div className="thumb" onClick={(e) => onTap(item, e)}>
        <img loading="lazy" decoding="async" src={src} alt={item.name} width={300} height={200} />
      </div>
      <div className="item-info">
        <div className="name-container">
          <div className="name">{item.name}</div>
          <div className="dietary-icons">
            {item.isHealthy && (
              <span className="dietary-icon healthy" title="Healthy option">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </span>
            )}
            {item.isVegetarian && (
              <span className="dietary-icon vegetarian" title="Vegetarian">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="2"/>
                  <circle cx="12" cy="12" r="4" fill="#16a34a"/>
              </svg>
            </span>
          )}
        </div>
      </div>
      <div className="kcal">≈ {item.kcal} kcal</div>
    </div>
    <div className="price">{formatPrice(item.price)}</div>
  </article>
)
}

function CategorySection({ category, view, onTap }: { category: MenuCategory, view: ViewMode, onTap: (item: MenuItem, event: React.MouseEvent) => void }) {
  const Layout = view === 'grid' ?
    <div className="grid">{category.items.map(i => <ItemCard key={i.name} item={i} onTap={onTap} />)}</div> :
    <div className="list">{category.items.map(i => <ItemRow key={i.name} item={i} onTap={onTap} />)}</div>

  return (
    <section id={category.id} aria-labelledby={`${category.id}-title`}>
      <h2 className="section-title" id={`${category.id}-title`}>{category.title}</h2>
      {Layout}
    </section>
  )
}

function FilterModal({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}: { 
  isOpen: boolean
  onClose: () => void
  filters: FilterType
  onFiltersChange: (filters: FilterType) => void 
}) {
  const calorieOptions = [null, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800]
  
  if (!isOpen) return null
  
  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h3>Quick Filters</h3>
          <div className="filter-header-actions">
            {(filters.maxCalories || filters.healthyPicks || filters.vegetarian || filters.favourites) && (
              <button
                className="clear-filters-btn"
                onClick={() => onFiltersChange({
                  maxCalories: null,
                  healthyPicks: false,
                  vegetarian: false,
                  favourites: false
                })}
                title="Clear all filters"
                aria-label="Clear all filters"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                <span>Clear</span>
              </button>
            )}
            <button className="filter-close-btn" onClick={onClose} aria-label="Close filters">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="filter-modal-content">
          <div className="filter-section">
            <label className="filter-section-label">Max Calories</label>
            <select
              value={filters.maxCalories || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                maxCalories: e.target.value ? Number(e.target.value) : null
              })}
              className="filter-dropdown"
            >
              <option value="">Any</option>
              {calorieOptions.filter(cal => cal !== null).map(cal => (
                <option key={cal} value={cal}>{cal} kcal</option>
              ))}
            </select>
          </div>
          
          <div className="filter-section">
            <button
              className={`filter-toggle ${filters.healthyPicks ? 'active' : ''}`}
              onClick={() => onFiltersChange({
                ...filters,
                healthyPicks: !filters.healthyPicks
              })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
              </svg>
              <span>Healthy Picks</span>
            </button>
          </div>
          
          <div className="filter-section">
            <button
              className={`filter-toggle ${filters.vegetarian ? 'active' : ''}`}
              onClick={() => onFiltersChange({
                ...filters,
                vegetarian: !filters.vegetarian
              })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M6 2H8a2.5 2.5 0 0 1 0 5H6"></path>
                <path d="M6 12h8a2.5 2.5 0 0 1 0 5H6"></path>
                <path d="M6 19h8a2.5 2.5 0 0 1 0 5H6"></path>
              </svg>
              <span>Vegetarian</span>
            </button>
          </div>
          
          <div className="filter-section">
            <button
              className={`filter-toggle ${filters.favourites ? 'active' : ''}`}
              onClick={() => onFiltersChange({
                ...filters,
                favourites: !filters.favourites
              })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>Favorites</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DishSuggestionModal({ 
  isOpen, 
  onClose, 
  item, 
  suggestions,
  position,
  isTransitioning
}: { 
  isOpen: boolean
  onClose: () => void
  item: MenuItem
  suggestions: MenuItem[]
  position: { x: number, y: number }
  isTransitioning: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="dish-suggestion-popup-overlay" onClick={onClose}>
      <div 
        className={`dish-suggestion-popup ${isTransitioning ? 'transitioning' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <div className="popup-header">
          <h4>Perfect Pairings</h4>
          <p>Try these with "{item.name}"</p>
        </div>
        
        <div className="popup-suggestions">
          {suggestions.slice(0, 2).map(s => (
            <div key={s.name} className="popup-suggestion-item">
              <div className="popup-image">
                <img src={s.image} alt={s.name} width={80} height={60} />
              </div>
              
              <div className="popup-content">
                <div className="popup-name">{s.name}</div>
                <div className="popup-meta">
                  <span className="popup-kcal">≈{s.kcal} cal</span>
                  <span className="popup-price">{s.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="popup-close-btn" onClick={onClose} aria-label="Close suggestions">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [view, setView] = useLocalStorage<ViewMode>('fruitzzUpp:view', 'grid')
  const [filters, setFilters] = useLocalStorage<FilterType>('fruitzzUpp:filters', {
    maxCalories: null,
    healthyPicks: false,
    vegetarian: false,
    favourites: false
  })
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [shakeCategory, setShakeCategory] = useState<string | null>(null)
  const [suggestionModal, setSuggestionModal] = useState<{item: MenuItem, suggestions: MenuItem[], position: {x: number, y: number}} | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const active = useScrollSpy(CATEGORY_ORDER.map(c => c.id))
  const topRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const [showTop, setShowTop] = useState(false)
  const [lightbox, setLightbox] = useState<{src: string, alt: string} | null>(null)

  const getDishSuggestions = (selectedItem: MenuItem): MenuItem[] => {
    const suggestions: MenuItem[] = []
    const selectedName = selectedItem.name.toLowerCase()
    const usedImages = new Set([selectedItem.image]) // Track used images to avoid repetition
    
    // Find complementary dishes based on category and type
    MENU.forEach(category => {
      category.items.forEach(item => {
        if (item.name !== selectedItem.name && !usedImages.has(item.image)) {
          let score = 0
          
          // Beverage + Food combinations
          if (/coffee|tea|latte|cappuccino|mocha|frappe|juice|shake|mojito/i.test(selectedName) && 
              /burger|sandwich|wrap|pizza|snack|salad|dessert/i.test(item.name.toLowerCase())) {
            score += 3
          }
          
          // Food + Beverage combinations
          if (/burger|sandwich|wrap|pizza|snack|salad|dessert/i.test(selectedName) && 
              /coffee|tea|latte|cappuccino|mocha|frappe|juice|shake|mojito/i.test(item.name.toLowerCase())) {
            score += 3
          }
          
          // Dessert + Beverage combinations
          if (/dessert|ice cream|brownie|falooda|donut/i.test(selectedName) && 
              /coffee|tea|latte|cappuccino|mocha|frappe|juice|shake|mojito/i.test(item.name.toLowerCase())) {
            score += 2
          }
          
          // Same category but different items
          if (category.items.includes(selectedItem)) {
            score += 1
          }
          
          // Healthy combinations
          if (selectedItem.isHealthy && item.isHealthy) {
            score += 1
          }
          
          // Vegetarian combinations
          if (selectedItem.isVegetarian && item.isVegetarian) {
            score += 1
          }
          
          if (score > 0) {
            suggestions.push({ ...item, score })
            usedImages.add(item.image) // Mark this image as used
          }
        }
      })
    })
    
    // Sort by score and return top 4 suggestions with unique images
    return suggestions
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 4)
      .map(({ score, ...item }) => item)
  }

  const handleDishTap = (item: MenuItem, event: React.MouseEvent) => {
    const suggestions = getDishSuggestions(item)
    const rect = event.currentTarget.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    
    const position = {
      x: rect.left + rect.width / 2 + scrollLeft,
      y: rect.bottom + scrollTop + 10
    }
    
    if (suggestionModal) {
      // If popup is already open, animate the transition
      setIsTransitioning(true)
      setTimeout(() => {
        setSuggestionModal({ item, suggestions, position })
        setIsTransitioning(false)
      }, 150) // Half of the transition duration
    } else {
      // First time opening
      setSuggestionModal({ item, suggestions, position })
    }
  }

  const filtered = useMemo(() => {
    let result = MENU
    
    // Apply text search filter
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.map(cat => ({
        ...cat,
        items: cat.items.filter(i => i.name.toLowerCase().includes(q)),
      })).filter(cat => cat.items.length > 0)
    }
    
    // Apply calorie filter
    if (filters.maxCalories) {
      result = result.map(cat => ({
        ...cat,
        items: cat.items.filter(i => i.kcal <= filters.maxCalories!),
      })).filter(cat => cat.items.length > 0)
    }
    
    // Apply healthy picks filter (low calorie items)
    if (filters.healthyPicks) {
      result = result.map(cat => ({
        ...cat,
        items: cat.items.filter(i => i.kcal <= 150),
      })).filter(cat => cat.items.length > 0)
    }
    
    // Apply vegetarian filter
    if (filters.vegetarian) {
      const vegetarianKeywords = ['veg', 'vegetarian', 'salad', 'fruit', 'tea', 'coffee', 'juice', 'shake', 'mocktail', 'falooda', 'brownie', 'ice cream']
      result = result.map(cat => ({
        ...cat,
        items: cat.items.filter(i => {
          const name = i.name.toLowerCase()
          return vegetarianKeywords.some(keyword => name.includes(keyword)) || 
                 !['chicken', 'beef', 'egg', 'crab'].some(nonVeg => name.includes(nonVeg))
        }),
      })).filter(cat => cat.items.length > 0)
    }
    
    // Apply favourites filter (items with higher ratings/popularity indicators)
    if (filters.favourites) {
      const favouriteKeywords = ['special', 'classic', 'king', 'jumbo', 'loaded', 'sizzler']
      result = result.map(cat => ({
        ...cat,
        items: cat.items.filter(i => {
          const name = i.name.toLowerCase()
          return favouriteKeywords.some(keyword => name.includes(keyword)) || 
                 i.kcal >= 200 // Higher calorie items often indicate premium/favourite choices
        }),
      })).filter(cat => cat.items.length > 0)
    }
    
    return result
  }, [query, filters])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // Category is empty due to filters - show shake feedback
      setShakeCategory(id)
      setTimeout(() => setShakeCategory(null), 600) // Remove shake class after animation
    }
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

  // Auto-scroll category navigation to center active category
  useEffect(() => {
    const container = document.getElementById('catInner')
    const categoriesContainer = container?.parentElement as HTMLElement | null
    if (!container || !categoriesContainer) return

    const activeEl = container.querySelector('.cat-chip.active') as HTMLButtonElement | null
    if (!activeEl) return

    // Calculate the position to center the active element
    const containerRect = categoriesContainer.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()
    
    // Get current scroll position
    const currentScroll = categoriesContainer.scrollLeft
    
    // Calculate the center position of the container
    const containerCenter = containerRect.width / 2
    
    // Calculate the active element's position relative to the container
    const activeLeft = activeRect.left - containerRect.left + currentScroll
    const activeCenter = activeLeft + (activeRect.width / 2)
    
    // Calculate the scroll position needed to center the active element
    const targetScroll = activeCenter - containerCenter
    
    // Smooth scroll to the target position
    categoriesContainer.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth'
    })
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
          
          {/* Filter Button */}
          <button 
            className="filter-btn"
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Open filters"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
            </svg>
            <span>Filters</span>
          </button>
          
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
                className={`cat-chip ${active===c.id ? 'active' : ''} ${shakeCategory === c.id ? 'shake' : ''}`}
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
        {/* Filter results summary */}
        {(query || Object.values(filters).some(f => f !== false && f !== null)) && (
          <div className="filter-summary">
            <p>Showing {filtered.reduce((total, cat) => total + cat.items.length, 0)} items from {MENU.reduce((total, cat) => total + cat.items.length, 0)} total</p>
          </div>
        )}
        
        {(query || Object.values(filters).some(f => f !== false && f !== null) ? filtered : MENU).map(section => (
          <CategorySection key={section.id} category={section} view={view} onTap={handleDishTap} />
        ))}
      </main>

      {/* Filter Modal */}
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {suggestionModal && (
        <DishSuggestionModal 
          isOpen={!!suggestionModal}
          onClose={() => setSuggestionModal(null)}
          item={suggestionModal.item}
          suggestions={suggestionModal.suggestions}
          position={suggestionModal.position}
          isTransitioning={isTransitioning}
        />
      )}

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


