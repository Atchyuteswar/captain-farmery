import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create default Warehouse
  const warehouse = await prisma.warehouse.upsert({
    where: { id: 'default_warehouse' },
    update: {},
    create: {
      id: 'default_warehouse',
      name: 'Main Farmery Hub',
      address: '123 Farm Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
  })

  // 2. Create Categories
  const honeyCategory = await prisma.category.upsert({
    where: { slug: 'pure-honey' },
    update: {},
    create: {
      slug: 'pure-honey',
      name: 'Pure Honey',
      description: 'Raw, unfiltered, and pure honey sourced from deep forests.',
      sortOrder: 1,
    },
  })

  const spicesCategory = await prisma.category.upsert({
    where: { slug: 'spices' },
    update: {},
    create: {
      slug: 'spices',
      name: 'Indian Spices',
      description: 'Authentic stone-ground spices retaining their natural oils.',
      sortOrder: 2,
    },
  })

  // 3. Create Products
  const wildHoney = await prisma.product.upsert({
    where: { sku: 'CF-HONEY-WILD-001' },
    update: {},
    create: {
      sku: 'CF-HONEY-WILD-001',
      slug: 'wild-forest-honey',
      name: 'Wild Forest Honey',
      shortDescription: '100% Raw and Unprocessed Forest Honey',
      description: 'Sourced from the deep forests, our Wild Forest Honey is entirely raw, cold-extracted, and packed with natural pollen and enzymes.',
      brand: 'Captain Farmery',
      categoryId: honeyCategory.id,
      basePrice: 499,
      compareAtPrice: 599,
      status: 'ACTIVE',
      isFeatured: true,
      variants: {
        create: [
          {
            sku: 'CF-HONEY-WILD-001-500G',
            name: '500g Jar',
            price: 499,
            compareAtPrice: 599,
            options: { size: '500g' },
            isDefault: true,
          },
          {
            sku: 'CF-HONEY-WILD-001-1KG',
            name: '1kg Jar',
            price: 899,
            compareAtPrice: 1099,
            options: { size: '1kg' },
            isDefault: false,
          }
        ]
      }
    },
  })

  const turmeric = await prisma.product.upsert({
    where: { sku: 'CF-SPICE-TURM-001' },
    update: {},
    create: {
      sku: 'CF-SPICE-TURM-001',
      slug: 'organic-turmeric-powder',
      name: 'Organic Turmeric Powder (Haldi)',
      shortDescription: 'High curcumin, stone-ground organic turmeric.',
      description: 'Our organic turmeric powder is grown without synthetic pesticides and stone-ground to retain its natural oils and high curcumin content.',
      brand: 'Captain Farmery',
      categoryId: spicesCategory.id,
      basePrice: 199,
      status: 'ACTIVE',
      isBestSeller: true,
      variants: {
        create: [
          {
            sku: 'CF-SPICE-TURM-001-250G',
            name: '250g Pouch',
            price: 199,
            compareAtPrice: 249,
            options: { size: '250g' },
            isDefault: true,
          }
        ]
      }
    },
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
