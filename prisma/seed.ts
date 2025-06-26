import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const wheyProtein = await prisma.category.upsert({
    where: { slug: 'whey-protein' },
    update: {},
    create: {
      name: 'Whey Protein',
      slug: 'whey-protein',
      description: 'Fast-absorbing protein for muscle building',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300'
    }
  })

  const massGainer = await prisma.category.upsert({
    where: { slug: 'mass-gainer' },
    update: {},
    create: {
      name: 'Mass Gainer',
      slug: 'mass-gainer',
      description: 'High-calorie supplements for weight gain',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300'
    }
  })

  const isolate = await prisma.category.upsert({
    where: { slug: 'isolate' },
    update: {},
    create: {
      name: 'Isolate',
      slug: 'isolate',
      description: 'Pure protein with minimal carbs and fat',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300'
    }
  })

  // Create the 10 sample products
  const products = [
    {
      name: 'Optimum Nutrition Gold Standard Whey',
      slug: 'optimum-nutrition-gold-standard-whey',
      description: 'The gold standard in whey protein with 24g protein per serving. Fast-absorbing whey protein isolates are the primary ingredient. Enhanced with digestive enzymes for better absorption.',
      price: 3299,
      originalPrice: 3999,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600'
      ],
      brand: 'Optimum Nutrition',
      categoryId: wheyProtein.id,
      type: 'Whey Isolate',
      weight: '2lbs',
      flavor: 'Double Rich Chocolate',
      stock: 15,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 245,
      ingredients: 'Whey Protein Isolates, Whey Protein Concentrate, Natural and Artificial Flavors, Lecithin, Salt, Sucralose, Acesulfame Potassium',
      nutritionFacts: {
        servingSize: '30g',
        servingsPerContainer: 30,
        calories: 120,
        protein: '24g',
        carbs: '3g',
        fat: '1g',
        sodium: '130mg'
      }
    },
    {
      name: 'MuscleBlaze Biozyme Whey Protein',
      slug: 'muscleblaze-biozyme-whey-protein',
      description: 'Enhanced absorption whey protein with digestive enzymes. Biozyme Performance Whey is clinically tested whey protein with digestive enzymes (Digezyme) & Probiotic (LactoSpore).',
      price: 2899,
      originalPrice: 3299,
      images: [
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'
      ],
      brand: 'MuscleBlaze',
      categoryId: wheyProtein.id,
      type: 'Whey Concentrate',
      weight: '1kg',
      flavor: 'Rich Milk Chocolate',
      stock: 8,
      isFeatured: true,
      rating: 4.6,
      reviewCount: 189,
      ingredients: 'Whey Protein Concentrate, Digestive Enzymes (Digezyme), Probiotic (LactoSpore), Natural Flavors',
      nutritionFacts: {
        servingSize: '33g',
        servingsPerContainer: 30,
        calories: 132,
        protein: '25g',
        carbs: '4.2g',
        fat: '2.1g',
        sodium: '140mg'
      }
    },
    {
      name: 'Dymatize Elite 100% Whey',
      slug: 'dymatize-elite-100-whey',
      description: 'Fast-absorbing whey protein for post-workout recovery. Elite 100% Whey Protein delivers 25 grams of high-quality protein per serving to support muscle recovery.',
      price: 5999,
      originalPrice: 6999,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600'
      ],
      brand: 'Dymatize',
      categoryId: isolate.id,
      type: 'Whey Isolate',
      weight: '5lbs',
      flavor: 'Vanilla',
      stock: 12,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 156,
      ingredients: 'Whey Protein Isolate, Whey Protein Concentrate, Natural Vanilla Flavor, Lecithin, Salt, Stevia Extract',
      nutritionFacts: {
        servingSize: '31g',
        servingsPerContainer: 71,
        calories: 120,
        protein: '25g',
        carbs: '2g',
        fat: '1g',
        sodium: '95mg'
      }
    },
    {
      name: 'MyProtein Impact Whey',
      slug: 'myprotein-impact-whey',
      description: 'Premium quality whey protein concentrate with 21g of protein per serving. Made from high-quality whey protein concentrate, providing all the essential amino acids.',
      price: 2499,
      originalPrice: 2999,
      images: [
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'
      ],
      brand: 'MyProtein',
      categoryId: wheyProtein.id,
      type: 'Whey Concentrate',
      weight: '1kg',
      flavor: 'Chocolate Smooth',
      stock: 20,
      isFeatured: false,
      rating: 4.4,
      reviewCount: 298,
      ingredients: 'Whey Protein Concentrate (Milk), Cocoa Powder, Flavoring, Sweetener (Sucralose)',
      nutritionFacts: {
        servingSize: '25g',
        servingsPerContainer: 40,
        calories: 103,
        protein: '21g',
        carbs: '1g',
        fat: '1.9g',
        sodium: '60mg'
      }
    },
    {
      name: 'BigMuscles Nitric Whey',
      slug: 'bigmuscles-nitric-whey',
      description: 'Advanced whey protein formula with added nitric oxide boosters. Contains L-Arginine and L-Citrulline for enhanced muscle pumps and recovery.',
      price: 2299,
      originalPrice: 2799,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600'
      ],
      brand: 'BigMuscles',
      categoryId: wheyProtein.id,
      type: 'Whey Concentrate',
      weight: '2lbs',
      flavor: 'Cookies & Cream',
      stock: 18,
      isFeatured: false,
      rating: 4.3,
      reviewCount: 124,
      ingredients: 'Whey Protein Concentrate, L-Arginine, L-Citrulline, Natural Flavors, Digestive Enzymes',
      nutritionFacts: {
        servingSize: '30g',
        servingsPerContainer: 30,
        calories: 115,
        protein: '22g',
        carbs: '3.5g',
        fat: '1.5g',
        sodium: '120mg'
      }
    },
    {
      name: 'Isopure Zero Carb',
      slug: 'isopure-zero-carb',
      description: 'Pure whey protein isolate with zero carbs and fat. Perfect for lean muscle building and cutting phases. Lactose-free and gluten-free formula.',
      price: 4799,
      originalPrice: 5499,
      images: [
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'
      ],
      brand: 'Isopure',
      categoryId: isolate.id,
      type: 'Whey Isolate',
      weight: '3lbs',
      flavor: 'Creamy Vanilla',
      stock: 10,
      isFeatured: false,
      rating: 4.9,
      reviewCount: 87,
      ingredients: 'Whey Protein Isolate, Natural Vanilla Flavor, Lecithin, Xanthan Gum, Sucralose',
      nutritionFacts: {
        servingSize: '30g',
        servingsPerContainer: 45,
        calories: 110,
        protein: '25g',
        carbs: '0g',
        fat: '0g',
        sodium: '105mg'
      }
    },
    {
      name: 'GNC Pro Performance Whey',
      slug: 'gnc-pro-performance-whey',
      description: 'Professional grade whey protein for serious athletes. Scientifically formulated with fast-digesting whey protein concentrate and isolate.',
      price: 3099,
      originalPrice: 3599,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600'
      ],
      brand: 'GNC',
      categoryId: wheyProtein.id,
      type: 'Whey Blend',
      weight: '2lbs',
      flavor: 'Strawberry',
      stock: 14,
      isFeatured: false,
      rating: 4.5,
      reviewCount: 203,
      ingredients: 'Whey Protein Concentrate, Whey Protein Isolate, Natural Strawberry Flavor, Lecithin, Salt',
      nutritionFacts: {
        servingSize: '32g',
        servingsPerContainer: 28,
        calories: 130,
        protein: '24g',
        carbs: '3g',
        fat: '2g',
        sodium: '110mg'
      }
    },
    {
      name: 'Ultimate Nutrition Prostar',
      slug: 'ultimate-nutrition-prostar',
      description: 'Ultra-premium whey protein with maximum bioavailability. Contains whey protein isolate as the primary ingredient for superior absorption.',
      price: 5399,
      originalPrice: 6199,
      images: [
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'
      ],
      brand: 'Ultimate Nutrition',
      categoryId: isolate.id,
      type: 'Whey Isolate',
      weight: '5lbs',
      flavor: 'Chocolate Creme',
      stock: 7,
      isFeatured: false,
      rating: 4.6,
      reviewCount: 145,
      ingredients: 'Whey Protein Isolate, Natural Chocolate Flavor, Cocoa Powder, Lecithin, Stevia Extract',
      nutritionFacts: {
        servingSize: '30g',
        servingsPerContainer: 75,
        calories: 115,
        protein: '25g',
        carbs: '1g',
        fat: '0.5g',
        sodium: '90mg'
      }
    },
    {
      name: 'Avvatar Whey Protein',
      slug: 'avvatar-whey-protein',
      description: 'Indian premium whey protein with authentic flavors. Made with imported whey protein concentrate and specially crafted for Indian taste preferences.',
      price: 2199,
      originalPrice: 2599,
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600'
      ],
      brand: 'Avvatar',
      categoryId: wheyProtein.id,
      type: 'Whey Concentrate',
      weight: '1kg',
      flavor: 'Kulfi',
      stock: 22,
      isFeatured: false,
      rating: 4.2,
      reviewCount: 167,
      ingredients: 'Whey Protein Concentrate, Natural Kulfi Flavor, Digestive Enzymes, Probiotics',
      nutritionFacts: {
        servingSize: '30g',
        servingsPerContainer: 33,
        calories: 120,
        protein: '24g',
        carbs: '2.5g',
        fat: '1.8g',
        sodium: '115mg'
      }
    },
    {
      name: 'Labrada Muscle Mass Gainer',
      slug: 'labrada-muscle-mass-gainer',
      description: 'High-calorie mass gainer for lean muscle building. Contains premium whey protein, complex carbohydrates, and essential amino acids for maximum muscle growth.',
      price: 3999,
      originalPrice: 4499,
      images: [
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'
      ],
      brand: 'Labrada',
      categoryId: massGainer.id,
      type: 'Mass Gainer',
      weight: '6lbs',
      flavor: 'Chocolate',
      stock: 5,
      isFeatured: true,
      rating: 4.5,
      reviewCount: 98,
      ingredients: 'Whey Protein Concentrate, Maltodextrin, Oat Flour, Natural Chocolate Flavor, MCT Oil, Vitamins & Minerals',
      nutritionFacts: {
        servingSize: '334g',
        servingsPerContainer: 8,
        calories: 1230,
        protein: '52g',
        carbs: '222g',
        fat: '8g',
        sodium: '380mg'
      }
    }
  ]

  // Create products
  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData
    })
  }

  console.log('Database seeded successfully!')
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