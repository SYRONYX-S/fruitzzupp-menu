export type MenuItem = {
  name: string
  price: string
  kcal: number
  image: string
  isHealthy?: boolean
  isVegetarian?: boolean
}

export type MenuCategory = {
  id: string
  title: string
  items: MenuItem[]
}

function estimateCalories(name: string, price: string): number {
  const base = 60
  const richness = /brownie|mocha|frappe|shake|snickers|kit|oreo|falooda|cheese|butter|chocolate|affogato|pasta|pizza|burger|wrap|nugget|loaded|bbq|pepperoni|donut|fig|badam|mixed dry fruit/i.test(name) ? 2.2
    : /latte|cappuccino|mayo|sandwich|guava|avocado|mango|dates|mocktail|special|peri peri|tikka|club|king|zinger|exea/i.test(name) ? 1.6
    : /tea|espresso|americano|lemon|mint|water|tender|salad|fries|egg|chicken strips|fish finger/i.test(name) ? 0.8
    : 1.2
  const priceNum = Math.max(...price.split('/').map(p => parseInt(p, 10))) || 80
  const kcal = Math.round(base * richness + priceNum * 1.1)
  return Math.max(40, Math.min(kcal, 850))
}

function isHealthyItem(name: string, kcal: number): boolean {
  const healthyKeywords = /salad|fruit|tea|green tea|herbal|ginger|mint|lemon|hibiscus|tulassi|carrot|water melon|pineapple|grape|apple|orange|tender coconut|fig|badam|mixed dry fruit|litchi|blue berry|black berry|strawberry|passion fruit|guava|chikku|dragon|annar/i
  return healthyKeywords.test(name.toLowerCase()) || kcal <= 150
}

function isVegetarianItem(name: string): boolean {
  const nonVegetarianKeywords = /chicken|beef|egg|crab|prawns|fish|meat|burger|nuggets|strips|mayo/i
  const vegetarianKeywords = /veg|vegetarian|salad|fruit|tea|coffee|juice|shake|mocktail|falooda|brownie|ice cream|donut|paneer|tikka|mashroom|margarita/i
  
  if (nonVegetarianKeywords.test(name.toLowerCase())) return false
  if (vegetarianKeywords.test(name.toLowerCase())) return true
  
  // Default to vegetarian for items without clear meat indicators
  return true
}

function imageFor(name: string): string {
  const lower = name.toLowerCase()
  
  // Hot Beverages
  if (/espresso|americano/i.test(lower)) return 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop'
  if (/cappuccino|latte/i.test(lower)) return 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop'
  if (/mocha|affogato|cortado/i.test(lower)) return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop'
  if (/hot chocolate|butter scotch|caramello/i.test(lower)) return 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&h=400&fit=crop'
  if (/classic coffee/i.test(lower)) return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cce?w=600&h=400&fit=crop'
  if (/spanish/i.test(lower)) return 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop'
  
  // Tea
  if (/tea|ginger|mint|lemon|hibiscus|masala|tulassi|green|black|honey/i.test(lower)) return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop'
  
  // Burgers
  if (/burger|beef|chicken|zinger|king|exea/i.test(lower)) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop'
  if (/mashroom/i.test(lower)) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop'
  
  // Sandwiches
  if (/sandwich|club|grill|paneer|tikka|mayo|delight/i.test(lower)) return 'https://images.unsplash.com/photo-1528735602786-4692e6e44e94?w=600&h=400&fit=crop'
  
  // Wraps
  if (/wrap|peri peri/i.test(lower)) return 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop'
  
  // Snacks
  if (/fries|loaded|cheese|peri peri fries/i.test(lower)) return 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop'
  if (/nuggets|chicken strips|fish finger/i.test(lower)) return 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop'
  if (/cheese ball/i.test(lower)) return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'
  if (/egg|boiled|bulls eye|omelette/i.test(lower)) return 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=400&fit=crop'
  if (/crab|prawns/i.test(lower)) return 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop'
  
  // Salads
  if (/salad|bowl/i.test(lower)) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop'
  if (/steam|mayo/i.test(lower)) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop'
  if (/fruit bowl/i.test(lower)) return 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop'
  
  // Pizza
  if (/pizza|bbq|pepperoni|mashroom|margarita/i.test(lower)) return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'
  
  // Ice Cream
  if (/ice cream|vanilla|strawberry|mango|chocolate|butter scotch/i.test(lower)) return 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop'
  
  // Cold Beverages
  if (/frappe|cold coffee|iced/i.test(lower)) return 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop'
  if (/boost/i.test(lower)) return 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop'
  
  // Juices & Shakes
  if (/juice|shake|carrot|water melon|pineapple|grape|apple|annar|mango|guava|avocado|chikku|dragon|orange/i.test(lower)) return 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=400&fit=crop'
  if (/abc|cap/i.test(lower)) return 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=400&fit=crop'
  if (/tender coconut/i.test(lower)) return 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop'
  if (/dates|badam|mixed dry fruit|fig|litchi|berry|strawberry|vanilla|chocolate|caramel|coffee blast|snickers|kit kat|oreo|dark fantasy|brownie|sharjah/i.test(lower)) return 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=400&fit=crop'
  if (/blue berry|black berry/i.test(lower)) return 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=400&fit=crop'
  
  // Mojitos
  if (/mojito|passion fruit|electric|apple kiwi|green apple|litchi|blueberry|strawberry|black currant|guava|bubble gum|water melon|tender coconut/i.test(lower)) return 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=400&fit=crop'
  if (/spicy|salt/i.test(lower)) return 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=400&fit=crop'
  
  // Desserts
  if (/falooda|donut|brownie|black magic/i.test(lower)) return 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop'
  if (/fruits salad|pista/i.test(lower)) return 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop'
  
  // Default fallback
  return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'
}

function item(name: string, price: string): MenuItem {
  const kcal = estimateCalories(name, price)
  return { 
    name, 
    price, 
    kcal, 
    image: imageFor(name),
    isHealthy: isHealthyItem(name, kcal),
    isVegetarian: isVegetarianItem(name)
  }
}

export const MENU: MenuCategory[] = [
  {
    id: 'recommended',
    title: 'Recommended',
    items: [
      item('Classic Chicken Burger', '130'),
      item('Cappuccino', '100'),
      item('BBQ Chicken Pizza', '250'),
      item('Vanilla Shake', '120'),
      item('Chicken Mayo Sandwich', '90'),
      item('Special Falooda', '170'),
      item('Coffee Frappe (Cold Coffee)', '130'),
      item('Loaded Fries - L/M', '180 / 100'),
    ],
  },
  {
    id: 'hot-beverages',
    title: 'Hot beverages',
    items: [
      item('Espresso (Single / Double)', '80 / 100'),
      item('Cafe Americano', '70 / 100'),
      item('Cappuccino', '100'),
      item('Café Late', '100'),
      item('Cortado', '130'),
      item('Cappuccino (vanilla/caramel/hazelnut)', '140'),
      item('Café Mocha', '120'),
      item('Café Affogato', '130'),
      item('Spanish Café Latte', '120'),
      item('Classic Coffee', '50'),
      item('Hot Chocolate', '100'),
      item('Hot Butter Scotch', '100'),
      item('Caramello Hot', '100'),
    ],
  },
  {
    id: 'tea',
    title: 'Tea',
    items: [
      item('Black Tea', '40'),
      item('Ginger Tea', '50'),
      item('Honey Ginger Tea', '70'),
      item('Mint Tea', '50'),
      item('Lemon Tea', '50'),
      item('Hibiscus Tea', '50'),
      item('Masala Tea', '50'),
      item('Tulassi Tea', '50'),
      item('Green Tea', '50'),
    ],
  },
  {
    id: 'burger',
    title: 'Burger',
    items: [
      item('Classic Chicken Burger', '130'),
      item('Beef Burger', '160'),
      item('King Burger - Chicken / Beef', '180 / 200'),
      item('Zinger Burger Chicken', '150'),
      item('Mashroom Burger', '140'),
      item('Exea Burger', '250 / 450'),
    ],
  },
  {
    id: 'sandwich',
    title: 'Sandwich',
    items: [
      item('Grill Sandwich Veg / Egg / Chicken', '90 / 100 / 110'),
      item('Club Sandwich Veg / Egg / Chicken', '125 / 130 / 170'),
      item('Paneer Tikka Sandwich', '160'),
      item('Chicken Mayo Sandwich', '90'),
      item('Chicken Mayo Sandwich with Cheese', '100'),
      item('Egg Delight', '90'),
    ],
  },
  {
    id: 'wrap',
    title: 'Wrap',
    items: [
      item('Chicken Wrap', '110'),
      item('Peri Peri Wrap', '130'),
      item('Egg Wrap', '100'),
    ],
  },
  {
    id: 'snacks',
    title: 'Snacks',
    items: [
      item('French Fries - L/M', '150 / 80'),
      item('Loaded Fries - L/M', '180 / 100'),
      item('Cheese Fries - L/M', '150 / 100'),
      item('Peri Peri Fries - L/M', '160 / 120'),
      item('Chicken Cheese Ball', '110'),
      item('Chicken Nuggets', '130'),
      item('Crab Nuggets', '150'),
      item('Prawns Nuggets', '160'),
      item('Fish Finger', '140'),
      item('Egg (Boiled / Bulls Eye / Omelette)', '20 / 30 / 50'),
      item('Chicken Strips', '150'),
      item('Chicken Strips Honey', '160'),
      item('Chicken Strips Spicy', '140'),
    ],
  },
  {
    id: 'salads',
    title: 'Salads',
    items: [
      item('Green Salad', '120'),
      item('Steam Salad', '160'),
      item('Mayo Salad', '190'),
      item('Fruit Bowl - L/M', '150 / 100'),
    ],
  },
  {
    id: 'pizza',
    title: 'Pizza',
    items: [
      item('BBQ Chicken Pizza', '250'),
      item('Chicken Pepperoni Pizza', '265'),
      item('Mashroom Pizza', '245'),
      item('Margarita Pizza Veg / Chicken', '120 / 139'),
    ],
  },
  {
    id: 'ice-cream',
    title: 'Ice cream',
    items: [
      item('Vanilla', '50'),
      item('Butter Scotch / Strawberry / Mango / Chocolate', '60'),
    ],
  },
  {
    id: 'cold-beverages',
    title: 'Cold beverages',
    items: [
      item('Coffee Frappe (Cold Coffee)', '130'),
      item('Vanilla Frappe', '130'),
      item('Caramel Frappe', '150'),
      item('Hazelnut Frappe', '150'),
      item('Iced Spanish Café Latte', '120'),
      item('Iced Americano', '100'),
      item('Cold Boost Coffee', '90'),
      item('Iced Tea Classic', '90'),
    ],
  },
  {
    id: 'juices-shakes',
    title: 'Juices & shakes',
    items: [
      item('ABC / CAP', '120'),
      item('Carrot', '100'),
      item('Carrot Ginger', '110'),
      item('Water Melon', '90'),
      item('Pineapple', '90'),
      item('Grape', '80'),
      item('Apple', '100'),
      item('Annar', '100'),
      item('Mango', '110'),
      item('Guava', '90'),
      item('Avocado', '110'),
      item('Chikku', '110'),
      item('Dragon', '110'),
      item('Orange', '90'),
      item('Tender Coconut', '110'),
      item('Tender Coconut Chikku', '130'),
      item('Tender Coconut Mango', '130'),
      item('Tender Coconut Grape', '130'),
      item('Tender Coconut Cashew', '150'),
      item('Dates', '120'),
      item('Dates Mango', '130'),
      item('Badam Shake', '140'),
      item('Mixed Dry Fruit Shake', '160'),
      item('Fig Shake', '160'),
      item('Litchi Shake', '140'),
      item('Blue Berry Shake', '150'),
      item('Black Berry Shake', '150'),
      item('Strawberry Shake', '140'),
      item('Butter Scotch Shake', '140'),
      item('Vanilla Shake', '120'),
      item('Chocolate Shake', '140'),
      item('Caramel White', '160'),
      item('Coffee Blast', '160'),
      item('Snickers / Kit Kat / Oreo / Dark Fantasy', '140'),
      item('Brownie Shake', '150'),
      item('Sharjah Shake', '140'),
    ],
  },
  {
    id: 'mojitos',
    title: 'Mojitos',
    items: [
      item('Passion Fruit', '120'),
      item('Electric Lemon', '120'),
      item('Apple Kiwi', '120'),
      item('Green Apple', '120'),
      item('Litchi', '120'),
      item('Blueberry / Strawberry / Black Currant', '120'),
      item('Guava', '120'),
      item('Guava Salt', '130'),
      item('Spicy', '130'),
      item('Bubble Gum', '130'),
      item('Chikku', '130'),
      item('Water Melon', '120'),
      item('Tender Coconut', '130'),
      item('Butter Scotch', '130'),
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    items: [
      item('Special Falooda', '170'),
      item('Butter Scotch Falooda', '140'),
      item('Fruits Salad with Ice Cream', '120'),
      item('Chocolate Donut with Ice Cream', '120'),
      item('Strawberry Donut with Ice Cream', '110'),
      item('Vanilla Donut with Ice Cream', '100'),
      item('Pista Donut with Ice Cream', '150'),
      item('Black Magic (Brownie)', '150'),
    ],
  },
]

export const CATEGORY_ORDER = MENU.filter(c => c.id !== 'recommended').map(c => ({ id: c.id, title: c.title }))


