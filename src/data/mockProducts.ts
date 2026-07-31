import { Product, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'traditional',
    name: 'Wraps & Shawls',
    slug: 'traditional',
    description: 'Beautiful geometric pattern fringed wrap shawls and striped luxury wraps crafted for both modern and traditional styling.',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'dresses',
    name: 'Chic Dresses',
    slug: 'dresses',
    description: 'Elegant pleated maxi dresses, floral print chiffon gowns, and gorgeous children\'s shift dresses.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'casual',
    name: 'Casual & Streetwear',
    slug: 'casual',
    description: 'Trendy grey cargo trousers, pure white streetstyle cargos, and distressed black wide-leg baggy jeans.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'accessories',
    name: 'Bags & Accessories',
    slug: 'accessories',
    description: 'Elegant pleated satin clutches, structured shoulder bags, and luxury accessories to elevate your outfit.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'shoes',
    name: 'Shoes & Footwear',
    slug: 'shoes',
    description: 'Glossy crocodile embossed block-heel slide sandals and crossover strap natural cork slides.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Black ripped wide-leg baggy jeans with distressing on the knees',
    description: 'An absolute streetstyle favorite. These black distressed wide-leg baggy jeans feature hand-sand highlights, prominent shredded rips across the knees, and an ultra-comfortable loose, high-waisted fit. Perfect for casual weekend hangouts in Bole or Megenagna.',
    price: 2600,
    originalPrice: 3200,
    categoryId: 'casual',
    images: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Washed Charcoal Black'],
    inventory: 18,
    featured: true,
    brand: 'EthioShein Denim',
    rating: 4.8,
    reviewsCount: 12,
    tags: ['Jeans', 'Denim', 'Ripped', 'Streetwear', 'Black'],
    createdAt: '2026-07-15T12:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Beige geometric pattern fringed wrap shawl',
    description: 'A luxury fringed wrap shawl in soft-knit premium fabric, featuring a gorgeous beige and cream white geometric pattern border. Heavy yet breathable, it can be draped elegantly as a modern Netela or styled over trench coats for chilly Addis Ababa evenings.',
    price: 1850,
    originalPrice: 2200,
    categoryId: 'traditional',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['One Size'],
    colors: ['Geometric Beige & Cream'],
    inventory: 25,
    featured: true,
    brand: 'Shiro Meda Loom',
    rating: 4.9,
    reviewsCount: 8,
    tags: ['Shawl', 'Scarf', 'Beige', 'Traditional', 'Geometric'],
    createdAt: '2026-07-16T12:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'White crocodile-embossed block-heel slide sandals',
    description: 'Sleek and professional. These high-gloss slide sandals feature a beautifully embossed crocodile texture, open-toe front, and a sturdy low block heel for ultimate all-day comfort. Designed to transition smoothly from corporate settings to casual dinners.',
    price: 2900,
    originalPrice: 3400,
    categoryId: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['37', '38', '39', '40'],
    colors: ['Glossy White'],
    inventory: 14,
    featured: true,
    brand: 'EthioShein Footwear',
    rating: 4.7,
    reviewsCount: 15,
    tags: ['Slides', 'Heels', 'White', 'Sandals', 'Croc'],
    createdAt: '2026-07-10T12:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Grey utility cargo pants',
    description: 'Sleek utility cargo trousers in slate grey. Designed with an adjustable elastic waist, dual deep utility pockets with functional zip accents, and a relaxed jogger cuff. Durable and lightweight, perfect for the energetic modern urbanite.',
    price: 2450,
    originalPrice: 2900,
    categoryId: 'casual',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Slate Grey'],
    inventory: 22,
    featured: false,
    brand: 'EthioStreetwear',
    rating: 4.6,
    reviewsCount: 9,
    tags: ['Cargos', 'Pants', 'Grey', 'Streetwear', 'Utility'],
    createdAt: '2026-07-12T12:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Crossover strap beige cork slides',
    description: 'Ultimate summer comfort. These casual crossover-strap slide sandals feature wide textured straps in natural beige, an ergonomic molded cork footbed, and a durable traction sole. Perfect for vacations or relaxed weekend strolls.',
    price: 1980,
    originalPrice: 2400,
    categoryId: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Oatmeal Beige'],
    inventory: 30,
    featured: false,
    brand: 'EthioShein Footwear',
    rating: 4.8,
    reviewsCount: 11,
    tags: ['Sandals', 'Slides', 'Beige', 'Cork', 'Summer'],
    createdAt: '2026-07-14T12:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Little girl white shift dress front-back',
    description: 'A delightful, sleeveless white A-line shift dress for little girls. Features delicate pearl-accented 3D flower appliques across the front and a majestic, oversized statement bow on the back. Fully lined with soft premium cotton for perfect celebration comfort.',
    price: 3100,
    originalPrice: 3800,
    categoryId: 'dresses',
    images: [
      'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['3-4Y', '4-5Y', '5-6Y', '7-8Y'],
    colors: ['Cream White'],
    inventory: 12,
    featured: true,
    brand: 'EthioShein Kids',
    rating: 5.0,
    reviewsCount: 6,
    tags: ['Dress', 'Girls', 'White', 'Floral', 'Bow'],
    createdAt: '2026-07-18T12:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Pleated cream-white satin evening clutch purse with circular gold handle',
    description: 'A majestic evening accessory. This structured accordion-pleated satin clutch purse comes in elegant cream-white, detailed with an exquisite circular gold handle and a crystal kiss-lock clasp. Spacious enough for essentials at any holiday or wedding gala.',
    price: 2200,
    originalPrice: 2800,
    categoryId: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['One Size'],
    colors: ['Cream Satin & Gold'],
    inventory: 8,
    featured: true,
    brand: 'EthioShein Luxe',
    rating: 4.9,
    reviewsCount: 14,
    tags: ['Clutch', 'Bag', 'Cream', 'Gold', 'Evening'],
    createdAt: '2026-07-17T12:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'White wide-leg cargo pants',
    description: 'Chic streetwear at its finest. High-waisted, wide-leg utility cargo pants in pure white, designed with an elasticated waistband, drawstring toggle ankle cuffs for adjustable silhouettes, and dual side flap pockets. Pair with a black top for a stunning contrast.',
    price: 2500,
    originalPrice: 3100,
    categoryId: 'casual',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Pure White'],
    inventory: 15,
    featured: false,
    brand: 'EthioStreetwear',
    rating: 4.5,
    reviewsCount: 10,
    tags: ['Cargos', 'Pants', 'White', 'Streetwear', 'Wide-Leg'],
    createdAt: '2026-07-11T12:00:00Z'
  },
  {
    id: 'prod-9',
    name: 'Little girl denim ruffle jumpsuit back',
    description: 'An adorable, sleeveless light blue denim jumpsuit for girls. Crafted with delicate ruffle borders along the back bodice and a comfortable, elastic wide-leg silhouette. Made of lightweight, ultra-soft washed denim that\'s breathable for active play.',
    price: 2800,
    originalPrice: 3400,
    categoryId: 'casual',
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: ['Light Denim Blue'],
    inventory: 9,
    featured: false,
    brand: 'EthioShein Kids',
    rating: 4.8,
    reviewsCount: 7,
    tags: ['Jumpsuit', 'Girls', 'Denim', 'Ruffle', 'Blue'],
    createdAt: '2026-07-13T12:00:00Z'
  },
  {
    id: 'prod-10',
    name: 'Black chiffon maxi dress with white floral print',
    description: 'Emanate sophisticated grace. This floor-length black chiffon gown features a beautiful oversized white floral pattern, elegant flutter split sleeves, a gathered high waistband, and a lightweight, sweeping lined skirt that moves wonderfully with every step.',
    price: 4200,
    originalPrice: 5200,
    categoryId: 'dresses',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal & Floral White'],
    inventory: 10,
    featured: true,
    brand: 'EthioShein Luxe',
    rating: 4.9,
    reviewsCount: 18,
    tags: ['Dress', 'Maxi', 'Black', 'Floral', 'Chiffon'],
    createdAt: '2026-07-16T12:00:00Z'
  },
  {
    id: 'prod-11',
    name: 'Royal blue pleated caped dress',
    description: 'Designed for special moments. A stunning, royal blue pleated maxi dress crafted from heavy accordion-pleated chiffon. Features a beautiful double-layered cape overlay at the bodice and a flattering elastic high-waisted design that fits perfectly. Majestic from both front and back views.',
    price: 4800,
    originalPrice: 5800,
    categoryId: 'dresses',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Royal Blue'],
    inventory: 11,
    featured: true,
    brand: 'EthioShein Luxe',
    rating: 5.0,
    reviewsCount: 21,
    tags: ['Dress', 'Maxi', 'Blue', 'Pleated', 'Cape'],
    createdAt: '2026-07-17T12:00:00Z'
  },
  {
    id: 'prod-12',
    name: 'Striped espresso brown and black knit shawl',
    description: 'Wrap yourself in pure elegance. This premium knit shawl features high-contrast diagonal striped panels in rich espresso brown and classic black. Trimmed with a sleek, structured black border, it offers a sophisticated visual accent for professional or casual outfits.',
    price: 1950,
    originalPrice: 2400,
    categoryId: 'traditional',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['One Size'],
    colors: ['Espresso Brown & Onyx Black'],
    inventory: 20,
    featured: false,
    brand: 'Shiro Meda Loom',
    rating: 4.7,
    reviewsCount: 5,
    tags: ['Shawl', 'Striped', 'Brown', 'Knit', 'Accessories'],
    createdAt: '2026-07-18T12:00:00Z'
  }
];
