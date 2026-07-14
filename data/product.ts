export interface ProductConfig {
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice: number;
  currency: string;
  image: string;
  images: string[];
  features: string[];
  specs: { label: string; value: string }[];
  shipping: {
    standard: { name: string; price: number; days: string };
    express: { name: string; price: number; days: string };
  };
}

export const product: ProductConfig = {
  name: 'AirVela Portable Air Cooler',
  subtitle: 'Stay Cool Anywhere, Anytime',
  description:
    'The AirVela Portable AC is the ultimate personal cooling solution. Compact, energy-efficient, and powerful enough to cool any room in minutes. No installation required — just plug in and enjoy instant relief from the heat.',
  price: 49.99,
  compareAtPrice: 99.99,
  currency: 'USD',
  image: '/images/product-hero.png',
  images: [
    '/images/product-1.png',
    '/images/product-2.png',
    '/images/product-3.png',
    '/images/product-4.png',
  ],
  features: [
    'Cools up to 215 sq. ft. in under 3 minutes',
    'Ultra-quiet operation at just 28dB — quieter than a whisper',
    '3-in-1: Cooler, Humidifier & Air Purifier',
    'Energy efficient — costs less than $0.05 per hour to run',
    'Portable & lightweight at just 2.5 lbs',
    'USB-C powered — works with power banks, laptops, and wall adapters',
  ],
  specs: [
    { label: 'Cooling Area', value: 'Up to 215 sq. ft.' },
    { label: 'Noise Level', value: '28dB (Ultra Quiet)' },
    { label: 'Water Tank', value: '750ml (8hr continuous)' },
    { label: 'Weight', value: '2.5 lbs' },
    { label: 'Power', value: 'USB-C 5V/2A' },
    { label: 'Dimensions', value: '6.7" x 5.9" x 8.3"' },
  ],
  shipping: {
    standard: { name: 'Standard Shipping', price: 4.99, days: '7-12 business days' },
    express: { name: 'Express Shipping', price: 12.99, days: '3-5 business days' },
  },
};

export const discount = {
  code: 'SUMMER30',
  percentage: 30,
  label: '30% OFF',
};
