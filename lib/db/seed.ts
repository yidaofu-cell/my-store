import { db } from './index';
import { admins, landingContent, shippingRates, discountCodes, products, productFeatures, productSpecs, productImages } from './schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  console.log('[SEED] Checking if database needs seeding...');

  // Check if admin exists
  const existingAdmin = await db.select().from(admins).limit(1);
  if (existingAdmin.length === 0) {
    console.log('[SEED] Creating default admin...');
    const passwordHash = await hash('admin123', 12);
    await db.insert(admins).values({
      username: 'admin',
      passwordHash,
    });
    console.log('[SEED] Admin created: admin / admin123');
  }

  // Check if products exist
  const existingProducts = await db.select().from(products).limit(1);
  if (existingProducts.length === 0) {
    console.log('[SEED] Creating default product...');
    const [product] = await db.insert(products).values({
      name: 'AirVela Portable Air Cooler',
      subtitle: 'Stay Cool Anywhere, Anytime',
      description: 'The AirVela Portable AC is the ultimate personal cooling solution. Compact, energy-efficient, and powerful enough to cool any room in minutes.',
      price: 49.99,
      compareAtPrice: 99.99,
      currency: 'USD',
      imageUrl: '',
      isActive: true,
    }).returning({ id: products.id });

    // Features
    const featureLabels = [
      'Cools up to 215 sq. ft. in under 3 minutes',
      'Ultra-quiet operation at just 28dB',
      '3-in-1: Cooler, Humidifier & Air Purifier',
      'Energy efficient — costs less than $0.05/hour',
      'Portable & lightweight at just 2.5 lbs',
      'USB-C powered — works with power banks & laptops',
    ];
    for (let i = 0; i < featureLabels.length; i++) {
      await db.insert(productFeatures).values({
        productId: product.id,
        label: featureLabels[i],
        sortOrder: i,
      });
    }

    // Specs
    const specs = [
      { label: 'Cooling Area', value: 'Up to 215 sq. ft.' },
      { label: 'Noise Level', value: '28dB (Ultra Quiet)' },
      { label: 'Water Tank', value: '750ml (8hr continuous)' },
      { label: 'Weight', value: '2.5 lbs' },
      { label: 'Power', value: 'USB-C 5V/2A' },
      { label: 'Dimensions', value: '6.7" x 5.9" x 8.3"' },
    ];
    for (let i = 0; i < specs.length; i++) {
      await db.insert(productSpecs).values({
        productId: product.id,
        label: specs[i].label,
        value: specs[i].value,
        sortOrder: i,
      });
    }
  }

  // Check if landing content exists
  const existingContent = await db.select().from(landingContent).limit(1);
  if (existingContent.length === 0) {
    console.log('[SEED] Creating default landing content...');
    const sections = [
      {
        sectionKey: 'hero',
        contentJson: {
          badge: '🔥 Summer Sale — 30% OFF Today Only',
          headline: 'Beat the Heat Without Breaking the Bank',
          subheadline: 'The AirVela Portable AC delivers instant cooling for a fraction of the cost of traditional air conditioning.',
          cta: 'Get Yours Now — 30% OFF',
          trustLine: '60-Day Money-Back Guarantee · Free Shipping Over $50',
        },
      },
      {
        sectionKey: 'pain_points',
        contentJson: {
          title: 'Tired of Sweltering Summer Days?',
          points: [
            { icon: '💸', title: 'Sky-High Electric Bills', description: 'Running a central AC all summer can cost $300+/month.' },
            { icon: '🔧', title: 'Bulky & Complicated Setup', description: 'No heavy units, no window hoses, no installation fees.' },
            { icon: '🔊', title: 'Loud Fans That Don\'t Work', description: 'AirVela operates at whisper-quiet 28dB.' },
            { icon: '🏠', title: 'One Room, One Problem', description: 'Targeted cooling saves energy and money.' },
          ],
        },
      },
      {
        sectionKey: 'features',
        contentJson: {
          title: 'Why Thousands Choose AirVela',
          subtitle: 'Engineered for maximum cooling with minimum energy',
          items: [
            { icon: '❄️', title: 'Rapid Cooling Technology', description: 'Advanced evaporative cooling drops room temperature by up to 15°F in just 3 minutes.' },
            { icon: '💧', title: '3-in-1 Multi-Function', description: 'Cool, humidify, and purify your air with a single device.' },
            { icon: '⚡', title: 'Energy Efficient Design', description: 'Consumes just 10W of power — less than an LED light bulb.' },
            { icon: '🎒', title: 'True Portability', description: 'At just 2.5 lbs, AirVela fits perfectly on desks, nightstands, and countertops.' },
            { icon: '🌙', title: 'Ultra-Quiet Operation', description: 'Sleep peacefully with noise levels as low as 28dB.' },
            { icon: '🎨', title: 'Modern Minimalist Design', description: 'Available in 3 premium colors to match any décor.' },
          ],
        },
      },
      {
        sectionKey: 'testimonials',
        contentJson: {
          title: 'Loved by 50,000+ Happy Customers',
          items: [
            { name: 'Sarah M.', location: 'California, USA', rating: 5, text: 'This little thing is a game changer! My electricity bill actually went DOWN last month.', avatar: '👩‍💼' },
            { name: 'James K.', location: 'Texas, USA', rating: 5, text: 'Best purchase of the year. It\'s so quiet my roommate doesn\'t even notice it\'s on.', avatar: '👨‍🎓' },
            { name: 'Emily R.', location: 'London, UK', rating: 5, text: 'The AirVela is a lifesaver. Small, portable, and actually works.', avatar: '👩‍💻' },
          ],
        },
      },
    ];

    for (const section of sections) {
      await db.insert(landingContent).values({
        sectionKey: section.sectionKey,
        contentJson: section.contentJson as any,
      });
    }
  }

  // Check if shipping rates exist
  const existingShipping = await db.select().from(shippingRates).limit(1);
  if (existingShipping.length === 0) {
    console.log('[SEED] Creating default shipping rates...');
    await db.insert(shippingRates).values([
      { name: 'Standard Shipping', price: 4.99, minDays: 7, maxDays: 12, minOrderForFree: 50 },
      { name: 'Express Shipping', price: 12.99, minDays: 3, maxDays: 5 },
    ]);
  }

  // Check if discount codes exist
  const existingDiscounts = await db.select().from(discountCodes).limit(1);
  if (existingDiscounts.length === 0) {
    console.log('[SEED] Creating default discount code...');
    await db.insert(discountCodes).values({
      code: 'SUMMER30',
      type: 'percentage',
      value: 30,
      isActive: true,
    });
  }

  console.log('[SEED] Database seeding complete!');
}
