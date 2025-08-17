export type MenuItem = {
  name: string
  price: string
  kcal: number
  image: string
}

export type MenuCategory = {
  id: string
  title: string
  items: MenuItem[]
}

function estimateCalories(name: string, price: string): number {
  const base = 60
  const richness = /brownie|mocha|frappe|shake|snickers|kit|oreo|falooda|cheese|butter|chocolate|affogato|pasta|pizza|burger|wrap|nugget/i.test(name) ? 2.2
    : /latte|cappuccino|mayo|sandwich|guava|avocado|mango|dates|mocktail|special/i.test(name) ? 1.6
    : /tea|espresso|americano|lemon|mint|water|tender|salad/i.test(name) ? 0.8
    : 1.2
  const priceNum = Math.max(...price.split('/').map(p => parseInt(p, 10))) || 80
  const kcal = Math.round(base * richness + priceNum * 1.1)
  return Math.max(40, Math.min(kcal, 850))
}

function imageFor(name: string): string {
  const lower = name.toLowerCase()
  const terms: string[] = ['cafe', 'greenery']
  if (/espresso|americano|latte|cappuccino|mocha|affogato|coffee|hot chocolate|cortado/i.test(lower)) terms.push('coffee')
  if (/tea|assam|darjeeling|hibiscus|ginger|lemon|mint|masala/i.test(lower)) terms.push('tea')
  if (/frappe|shake|mocktail|juice|tender coconut|mango|guava|berry|dates|avocado|chikku/i.test(lower)) terms.push('juice')
  if (/salad|bowl/i.test(lower)) terms.push('salad')
  if (/sandwich|club|grill|egg/i.test(lower)) terms.push('sandwich')
  if (/burger|beef|veg/i.test(lower)) terms.push('burger')
  if (/mojito|lemon|mint|guava|kiwi|blue/i.test(lower)) terms.push('mojito')
  if (/wrap|roll/i.test(lower)) terms.push('wrap')
  if (/brownie|falooda|dessert|ice cream|choco/i.test(lower)) terms.push('dessert')
  if (/fries|nuggets|pasta|pizza|snack/i.test(lower)) terms.push('snack')
  // Use Unsplash source for real photos; randomized but authentic
  const q = encodeURIComponent(terms.join(','))
  return `https://source.unsplash.com/600x400/?${q}`
}

function item(name: string, price: string): MenuItem {
  return { name, price, kcal: estimateCalories(name, price), image: imageFor(name) }
}

export const MENU: MenuCategory[] = [
  {
    id: 'hot-beverages',
    title: 'Hot Beverages',
    items: [
      item('Espresso', '80'),
      item('Cafe Americano', '90/110'),
      item('Cappuccino', '100'),
      item('Cafe Latte', '100'),
      item('Cortado', '130'),
      item('Cappuccino (Vanilla/Caramel/Hazelnut)', '120'),
      item('Cafe Mocha', '120'),
      item('Cafe Affogato', '120'),
      item('Classic Coffee', '90'),
      item('Milk', '40'),
    ],
  },
  {
    id: 'tea',
    title: 'Tea',
    items: [
      item('English Breakfast', '40'),
      item('Ginger Tea', '50'),
      item('Honey Ginger', '70'),
      item('Mint Tea', '50'),
      item('Lemon Tea', '50'),
      item('Hibiscus', '50'),
      item('Masala Tea (without/milk)', '40/50'),
      item('Hot Masala', '50'),
      item('Assam Tea', '50'),
      item('Darjeeling Tea', '50'),
    ],
  },
  {
    id: 'beverages',
    title: 'Beverages',
    items: [
      item('Coffee Frappe', '130'),
      item('Vanilla/Caramel/Hazelnut Frappe', '150'),
      item('Frappe Blast', '160'),
      item('Hot Chocolate', '100'),
      item('Butter Scotch', '100'),
      item('Caramello', '120'),
    ],
  },
  {
    id: 'salads',
    title: 'Salads',
    items: [
      item('Green Salad', '140'),
      item('Steam Salad', '160'),
      item('Mayo Salad', '190'),
      item('Fruit Bowl', '150'),
    ],
  },
  {
    id: 'juices-shakes',
    title: 'Juices & Shakes',
    items: [
      item('ABC/CAP', '120'),
      item('Carrot', '100'),
      item('Water Melon/Pineapple/Grape', '90'),
      item('Tender Coconut', '110'),
      item('Chikku', '120'),
      item('Pappaya', '110'),
      item('Mango', '120'),
      item('Guava', '150'),
      item('Avocado', '110'),
      item('Dates', '120'),
      item('Caramel White', '160'),
      item('Snickers/Kit Kat/Oreo/Dark Fantacy', '140'),
      item('Mixed Dry Fruits', '160'),
      item('Special Mocktail', '150'),
      item('Tender Coconut Chikku', '130'),
      item('Tender Coconut Mango', '130'),
      item('Tender Coconut Grape', '130'),
      item('Blue Berry', '140'),
    ],
  },
  {
    id: 'sandwich',
    title: 'Sandwich',
    items: [
      item('Grill Chicken Sandwich', '110'),
      item('Grill Veg Sandwich', '99'),
      item('Grill Mushroom Sandwich', '110'),
      item('Club Chicken Sandwich', '169'),
      item('Club Veg Sandwich', '119'),
      item('Egg Sandwich', '90'),
    ],
  },
  {
    id: 'burger',
    title: 'Burger',
    items: [
      item('Classic Burger', '129'),
      item('King Burger', '179'),
      item('Jumbo Burger', '219'),
      item('Beef Burger', '249'),
      item('Veg Burger', '99'),
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
      item('Virgin', '120'),
      item('Blueberry/Strawberry/Black current', '120'),
      item('Guava', '120'),
      item('Guava Salt', '130'),
      item('Spicy', '130'),
      item('Mojito Shots', '140'),
      item('Bubble Gum', '130'),
    ],
  },
  {
    id: 'wrap',
    title: 'Wrap',
    items: [
      item('Chicken Wrap', '110'),
      item('Desi Wrap', '130'),
      item('Veg Wrap', '90'),
      item('Add on Dips', '20'),
      item('Add on Cheese', '20'),
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    items: [
      item('Sizzler Brownie', '170'),
      item('Special Falooda', '170'),
      item('Butter Scotch Falooda', '140'),
      item('Fruits Salad with Ice Cream', '120'),
    ],
  },
  {
    id: 'snacks',
    title: 'Snacks',
    items: [
      item('French Fries', '80'),
      item('Loaded Fries', '180'),
      item('Cheese Fries', '150'),
      item('Nuggets Chicken', '130'),
      item('Nuggets Crab', '150'),
      item('Pizza Chicken/Veg', '220/190'),
      item('Pasta Chicken/Veg', '220/190'),
      item('Choco Milk', '120'),
      item('Pan-Fried Banana', '90'),
      item('(Peanut Butter / Honey)', '130'),
    ],
  },
]

export const CATEGORY_ORDER = MENU.map(c => ({ id: c.id, title: c.title }))


