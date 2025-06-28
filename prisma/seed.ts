import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        name: 'مدیر سیستم',
        email: 'admin@sofa.com',
        hashedPassword,
        role: Role.SUPER_ADMIN,
      },
    });
    console.log('✅ Admin user created:', adminUser.username);

    // Create sample regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const regularUser = await prisma.user.upsert({
      where: { username: 'testuser' },
      update: {},
      create: {
        username: 'testuser',
        name: 'کاربر نمونه',
        email: 'user@test.com',
        hashedPassword: userPassword,
        role: Role.USER,
      },
    });
    console.log('✅ Test user created:', regularUser.username);

    // Create categories
    const categories = [
      {
        name: 'مبل راحتی',
        description: 'مبل‌های راحتی و استراحت',
        slug: 'comfort-sofas'
      },
      {
        name: 'مبل ال',
        description: 'مبل‌های ال شکل',
        slug: 'l-shaped-sofas'
      },
      {
        name: 'مبل کلاسیک',
        description: 'مبل‌های کلاسیک و سنتی',
        slug: 'classic-sofas'
      },
      {
        name: 'مبل مدرن',
        description: 'مبل‌های مدرن و معاصر',
        slug: 'modern-sofas'
      },
      {
        name: 'کاناپه',
        description: 'کاناپه‌های مختلف',
        slug: 'couches'
      }
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: {},
        create: categoryData,
      });
      createdCategories.push(category);
      console.log('✅ Category created:', category.name);
    }

    // Create sample products
    const products = [
      {
        name: 'مبل راحتی پارچه‌ای کرم',
        description: 'مبل راحتی سه نفره با پارچه کرم رنگ و کیفیت بالا. مناسب برای نشیمن‌های مدرن.',
        price: 15000000,
        compareAtPrice: 18000000,
        stock: 5,
        sku: 'SOFA-001',
        isAvailable: true,
        isFeatured: true,
        isPublished: true,
        slug: 'cream-fabric-comfort-sofa',
        categoryIds: [createdCategories[0].id, createdCategories[3].id],
        weight: 85.5,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
            alt: 'مبل راحتی پارچه‌ای کرم',
            isMain: true,
            position: 0
          }
        ],
        dimensions: {
          length: 200,
          width: 90,
          height: 85,
          unit: 'cm'
        },
        attributes: [
          { name: 'جنس', value: 'پارچه' },
          { name: 'رنگ', value: 'کرم' },
          { name: 'تعداد نفرات', value: '3 نفره' },
          { name: 'فریم', value: 'چوب راش' }
        ]
      },
      {
        name: 'مبل ال مدرن چرمی مشکی',
        description: 'مبل ال شکل مدرن با روکش چرم طبیعی مشکی. شامل کوسن‌های اضافی.',
        price: 25000000,
        compareAtPrice: 30000000,
        stock: 3,
        sku: 'SOFA-002',
        isAvailable: true,
        isFeatured: true,
        isPublished: true,
        slug: 'black-leather-l-shaped-sofa',
        categoryIds: [createdCategories[1].id, createdCategories[3].id],
        weight: 120.0,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
            alt: 'مبل ال مدرن چرمی مشکی',
            isMain: true,
            position: 0
          }
        ],
        dimensions: {
          length: 280,
          width: 200,
          height: 90,
          unit: 'cm'
        },
        attributes: [
          { name: 'جنس', value: 'چرم طبیعی' },
          { name: 'رنگ', value: 'مشکی' },
          { name: 'تعداد نفرات', value: '5 نفره' },
          { name: 'شکل', value: 'ال' }
        ]
      },
      {
        name: 'کاناپه کلاسیک قهوه‌ای',
        description: 'کاناپه کلاسیک دو نفره با پارچه مخمل قهوه‌ای و پایه‌های چوبی.',
        price: 12000000,
        stock: 7,
        sku: 'SOFA-003',
        isAvailable: true,
        isFeatured: false,
        isPublished: true,
        slug: 'brown-classic-couch',
        categoryIds: [createdCategories[2].id, createdCategories[4].id],
        weight: 65.0,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop',
            alt: 'کاناپه کلاسیک قهوه‌ای',
            isMain: true,
            position: 0
          }
        ],
        dimensions: {
          length: 150,
          width: 85,
          height: 80,
          unit: 'cm'
        },
        attributes: [
          { name: 'جنس', value: 'مخمل' },
          { name: 'رنگ', value: 'قهوه‌ای' },
          { name: 'تعداد نفرات', value: '2 نفره' },
          { name: 'سبک', value: 'کلاسیک' }
        ]
      },
      {
        name: 'مبل راحتی خاکستری مدرن',
        description: 'مبل راحتی مدرن با پارچه خاکستری و طراحی مینیمال.',
        price: 18000000,
        stock: 4,
        sku: 'SOFA-004',
        isAvailable: true,
        isFeatured: false,
        isPublished: true,
        slug: 'gray-modern-comfort-sofa',
        categoryIds: [createdCategories[0].id, createdCategories[3].id],
        weight: 75.0,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
            alt: 'مبل راحتی خاکستری مدرن',
            isMain: true,
            position: 0
          }
        ],
        dimensions: {
          length: 220,
          width: 95,
          height: 85,
          unit: 'cm'
        },
        attributes: [
          { name: 'جنس', value: 'پارچه' },
          { name: 'رنگ', value: 'خاکستری' },
          { name: 'تعداد نفرات', value: '3 نفره' },
          { name: 'سبک', value: 'مدرن' }
        ]
      },
      {
        name: 'مبل ال چرمی سفید',
        description: 'مبل ال شکل لوکس با چرم سفید و فریم فلزی.',
        price: 22000000,
        stock: 2,
        sku: 'SOFA-005',
        isAvailable: true,
        isFeatured: true,
        isPublished: true,
        slug: 'white-leather-l-sofa',
        categoryIds: [createdCategories[1].id, createdCategories[3].id],
        weight: 110.0,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
            alt: 'مبل ال چرمی سفید',
            isMain: true,
            position: 0
          }
        ],
        dimensions: {
          length: 260,
          width: 180,
          height: 88,
          unit: 'cm'
        },
        attributes: [
          { name: 'جنس', value: 'چرم طبیعی' },
          { name: 'رنگ', value: 'سفید' },
          { name: 'تعداد نفرات', value: '4 نفره' },
          { name: 'فریم', value: 'فلزی' }
        ]
      }
    ];

    for (const productData of products) {
      const { categoryIds, images, dimensions, attributes, ...productBase } = productData;
      
      const product = await prisma.product.create({
        data: {
          ...productBase,
          categories: {
            connect: categoryIds.map(id => ({ id }))
          },
          images: {
            create: images
          },
          dimensions: {
            create: dimensions
          },
          attributes: {
            create: attributes
          }
        }
      });
      console.log('✅ Product created:', product.name);
    }

    // Create sample tags
    const tags = ['پرفروش', 'جدید', 'تخفیف‌دار', 'لوکس', 'ارزان'];
    for (const tagName of tags) {
      await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      console.log('✅ Tag created:', tagName);
    }

    // Create settings
    await prisma.settings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        storeName: 'فروشگاه مبل سوفا',
        storeEmail: 'info@sofa.com',
        storePhone: '021-12345678',
        storeAddress: 'تهران، خیابان ولیعصر، پلاک 123',
        currencyCode: 'IRR',
        taxPercent: 9,
      },
    });
    console.log('✅ Settings created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('📝 Admin login: username=admin, password=admin123');
    console.log('📝 Test user login: username=testuser, password=user123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 