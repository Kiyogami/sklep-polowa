// Mock data for Prascy Bandyci store

export const products = [
  {
    id: '1',
    name: 'BUCH Premium',
    description: 'Najwyższej jakości produkt z limitowanej edycji. Ekskluzywna formuła stworzona dla wymagających klientów.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1618215650201-8d552591218d?w=600',
    category: 'premium',
    variants: ['S', 'M', 'L', 'XL'],
    stock: { 'S': 5, 'M': 10, 'L': 8, 'XL': 3 },
    requiresVerification: true,
    featured: true,
    ageRestricted: false
  },
  {
    id: '2',
    name: 'MEF Classic',
    description: 'Klasyczna wersja dla koneserów. Sprawdzona receptura w eleganckiej formie.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1618215650454-d03cac422c8f?w=600',
    category: 'classic',
    variants: ['Standard', 'Premium'],
    stock: { 'Standard': 20, 'Premium': 8 },
    requiresVerification: false,
    featured: true
  },
  {
    id: '3',
    name: 'KOKO Gold Edition',
    description: 'Złota edycja z limitowanej serii. Wyjątkowy produkt dla wyjątkowych osób.',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1760804876166-aae5861ec7c1?w=600',
    category: 'limited',
    variants: ['Gold', 'Platinum'],
    stock: { 'Gold': 3, 'Platinum': 2 },
    requiresVerification: true,
    featured: true
  },
  {
    id: '4',
    name: 'PIGULY Set',
    description: 'Kompletny zestaw w eleganckim opakowaniu. Idealny na prezent.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1760804876134-a8089aaeccca?w=600',
    category: 'sets',
    variants: ['3-Pack', '5-Pack', '10-Pack'],
    stock: { '3-Pack': 15, '5-Pack': 10, '10-Pack': 5 },
    requiresVerification: false,
    featured: false
  },
  {
    id: '5',
    name: 'BUCH Elite',
    description: 'Najwyższa półka w naszej ofercie. Dla prawdziwych znawców.',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1702882239258-ab876240f95c?w=600',
    category: 'elite',
    variants: ['Elite', 'Supreme'],
    stock: { 'Elite': 4, 'Supreme': 2 },
    requiresVerification: true,
    featured: true
  },
  {
    id: '6',
    name: 'MEF Starter',
    description: 'Idealny produkt na początek przygody. Doskonała jakość w przystępnej cenie.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1618215649907-b51d8accb1ec?w=600',
    category: 'starter',
    variants: ['Starter', 'Starter+'],
    stock: { 'Starter': 30, 'Starter+': 20 },
    requiresVerification: false,
    featured: false,
    ageRestricted: false
  },
  {
    id: '7',
    name: 'Xanax 2mg',
    description: 'Mocny preparat na uspokojenie. Tylko dla pełnoletnich klientów (18+).',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1587855209276-89dabc0d2c00?w=600',
    category: 'leki',
    variants: ['Blister 10 szt.', 'Blister 30 szt.'],
    stock: { 'Blister 10 szt.': 20, 'Blister 30 szt.': 10 },
    requiresVerification: true,
    featured: true,
    ageRestricted: true
  },
  {
    id: '8',
    name: 'Oxy 80mg',
    description: 'Silny preparat przeciwbólowy. Wymaga pełnoletności i weryfikacji tożsamości.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
    category: 'leki',
    variants: ['Blister 10 szt.', 'Blister 20 szt.'],
    stock: { 'Blister 10 szt.': 15, 'Blister 20 szt.': 8 },
    requiresVerification: true,
    featured: false,
    ageRestricted: true
  }
];

export const orders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'Jan Kowalski',
      email: 'jan@example.com',
      phone: '+48 123 456 789',
      telegramId: '@jankowalski'
    },
    items: [
      { productId: '1', name: 'BUCH Premium', variant: 'L', quantity: 1, price: 299.99 }
    ],
    total: 299.99,
    status: 'verification_pending',
    deliveryMethod: 'h2h',
    deliveryAddress: null,
    pickupLocation: 'Warszawa, Centrum',
    requiresVerification: true,
    verificationStatus: 'pending',
    verificationVideo: null,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Anna Nowak',
      email: 'anna@example.com',
      phone: '+48 987 654 321',
      telegramId: '@annanowak'
    },
    items: [
      { productId: '2', name: 'MEF Classic', variant: 'Standard', quantity: 2, price: 199.99 },
      { productId: '4', name: 'PIGULY Set', variant: '3-Pack', quantity: 1, price: 349.99 }
    ],
    total: 749.97,
    status: 'shipped',
    deliveryMethod: 'inpost',
    deliveryAddress: {
      locker: 'WAW123',
      lockerAddress: 'ul. Marszałkowska 100, Warszawa'
    },
    trackingNumber: 'INP123456789',
    requiresVerification: false,
    verificationStatus: null,
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Piotr Wiśniewski',
      email: 'piotr@example.com',
      phone: '+48 555 666 777',
      telegramId: '@piotrw'
    },
    items: [
      { productId: '3', name: 'KOKO Gold Edition', variant: 'Platinum', quantity: 1, price: 449.99 }
    ],
    total: 449.99,
    status: 'verification_approved',
    deliveryMethod: 'h2h',
    deliveryAddress: null,
    pickupLocation: 'Kraków, Rynek',
    requiresVerification: true,
    verificationStatus: 'approved',
    verificationVideo: '/mock-video.mp4',
    verificationNotes: 'Weryfikacja pozytywna, tożsamość potwierdzona.',
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-14T16:30:00Z'
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Katarzyna Dąbrowska',
      email: 'kasia@example.com',
      phone: '+48 111 222 333',
      telegramId: '@kasiad'
    },
    items: [
      { productId: '5', name: 'BUCH Elite', variant: 'Supreme', quantity: 1, price: 599.99 }
    ],
    total: 599.99,
    status: 'payment_confirmed',
    deliveryMethod: 'h2h',
    deliveryAddress: null,
    pickupLocation: 'Wrocław, Stare Miasto',
    requiresVerification: true,
    verificationStatus: 'submitted',
    verificationVideo: '/mock-video-2.mp4',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 'ORD-005',
    customer: {
      name: 'Michał Lewandowski',
      email: 'michal@example.com',
      phone: '+48 444 555 666',
      telegramId: '@michalL'
    },
    items: [
      { productId: '6', name: 'MEF Starter', variant: 'Starter+', quantity: 3, price: 149.99 }
    ],
    total: 449.97,
    status: 'ready_for_pickup',
    deliveryMethod: 'inpost',
    deliveryAddress: {
      locker: 'KRK456',
      lockerAddress: 'ul. Floriańska 25, Kraków'
    },
    trackingNumber: 'INP987654321',
    requiresVerification: false,
    verificationStatus: null,
    createdAt: '2024-01-12T18:00:00Z',
    updatedAt: '2024-01-15T07:30:00Z'
  }
];

export const verifications = [
  {
    id: 'VER-001',
    orderId: 'ORD-001',
    customerName: 'Jan Kowalski',
    status: 'pending',
    videoUrl: null,
    submittedAt: null,
    reviewedAt: null,
    reviewedBy: null,
    notes: null
  },
  {
    id: 'VER-002',
    orderId: 'ORD-003',
    customerName: 'Piotr Wiśniewski',
    status: 'approved',
    videoUrl: '/mock-video.mp4',
    submittedAt: '2024-01-14T14:00:00Z',
    reviewedAt: '2024-01-14T16:30:00Z',
    reviewedBy: 'Admin',
    notes: 'Weryfikacja pozytywna, tożsamość potwierdzona.'
  },
  {
    id: 'VER-003',
    orderId: 'ORD-004',
    customerName: 'Katarzyna Dąbrowska',
    status: 'submitted',
    videoUrl: '/mock-video-2.mp4',
    submittedAt: '2024-01-15T11:00:00Z',
    reviewedAt: null,
    reviewedBy: null,
    notes: null
  }
];

export const statistics = {
  totalOrders: 156,
  pendingOrders: 12,
  totalRevenue: 45890.50,
  averageOrderValue: 294.17,
  verificationsToReview: 3,
  ordersToShip: 8,
  monthlyGrowth: 15.3,
  recentOrders: [
    { date: '2024-01-10', orders: 12, revenue: 3450 },
    { date: '2024-01-11', orders: 18, revenue: 5200 },
    { date: '2024-01-12', orders: 15, revenue: 4100 },
    { date: '2024-01-13', orders: 22, revenue: 6800 },
    { date: '2024-01-14', orders: 19, revenue: 5500 },
    { date: '2024-01-15', orders: 14, revenue: 4200 }
  ]
};

export const deliveryMethods = [
  {
    id: 'inpost',
    name: 'InPost Paczkomat',
    description: 'Dostawa do paczkomatu InPost',
    price: 12.99,
    estimatedDays: '1-2',
    icon: 'Package'
  },
  {
    id: 'h2h',
    name: 'Odbiór osobisty (H2H)',
    description: 'Odbiór osobisty z weryfikacją tożsamości',
    price: 0,
    estimatedDays: 'Do ustalenia',
    icon: 'User',
    requiresVerification: true
  }
];

export const paymentMethods = [
  {
    id: 'stripe',
    name: 'Karta płatnicza',
    description: 'Visa, Mastercard, American Express',
    icon: 'CreditCard'
  },
  {
    id: 'przelewy24',
    name: 'Przelewy24',
    description: 'Szybki przelew bankowy',
    icon: 'Building'
  },
  {
    id: 'blik',
    name: 'BLIK',
    description: 'Płatność kodem BLIK',
    icon: 'Smartphone'
  }
];

export const categories = [
  { id: 'all', name: 'Wszystkie', count: 8 },
  { id: 'premium', name: 'Premium', count: 1 },
  { id: 'classic', name: 'Classic', count: 1 },
  { id: 'limited', name: 'Limited Edition', count: 1 },
  { id: 'sets', name: 'Zestawy', count: 1 },
  { id: 'elite', name: 'Elite', count: 1 },
  { id: 'starter', name: 'Starter', count: 1 },
  { id: 'leki', name: 'Leki', count: 2 }
];
