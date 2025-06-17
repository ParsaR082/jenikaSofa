import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mobleman.com' },
    update: {},
    create: {
      email: 'admin@mobleman.com',
      name: 'Admin User',
      hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      phoneNumber: '09123456789',
      phoneVerified: true,
    },
  });
  
  console.log('Created admin user:', admin.email);
  
  // Create categories
  const livingRoom = await prisma.category.upsert({
    where: { slug: 'living-room' },
    update: {},
    create: {
      name: 'مبلمان پذیرایی',
      slug: 'living-room',
      description: 'انواع مبلمان راحتی و استیل برای فضای پذیرایی شما',
    },
  });
  
  const diningRoom = await prisma.category.upsert({
    where: { slug: 'dining-room' },
    update: {},
    create: {
      name: 'مبلمان ناهارخوری',
      slug: 'dining-room',
      description: 'میز و صندلی ناهارخوری با طراحی‌های مدرن و کلاسیک',
    },
  });
  
  const bedroom = await prisma.category.upsert({
    where: { slug: 'bedroom' },
    update: {},
    create: {
      name: 'مبلمان اتاق خواب',
      slug: 'bedroom',
      description: 'سرویس خواب، تخت و کمد برای اتاق خواب',
    },
  });
  
  console.log('Created categories');
  
  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'مدرن' },
      update: {},
      create: { name: 'مدرن' },
    }),
    prisma.tag.upsert({
      where: { name: 'کلاسیک' },
      update: {},
      create: { name: 'کلاسیک' },
    }),
    prisma.tag.upsert({
      where: { name: 'چوبی' },
      update: {},
      create: { name: 'چوبی' },
    }),
    prisma.tag.upsert({
      where: { name: 'پارچه‌ای' },
      update: {},
      create: { name: 'پارچه‌ای' },
    }),
  ]);
  
  console.log('Created tags');
  
  // Create sample products
  const sofaProduct = await prisma.product.upsert({
    where: { slug: 'classic-sofa' },
    update: {},
    create: {
      name: 'مبل راحتی کلاسیک',
      description: 'مبل راحتی کلاسیک با طراحی زیبا و منحصر به فرد، مناسب برای فضای پذیرایی شما. این مبل با پارچه مرغوب و اسفنج با کیفیت بالا تولید شده و دارای ۵ سال ضمانت می‌باشد.',
      price: 1250,
      compareAtPrice: 1500,
      stock: 10,
      sku: 'SOFA-CL-001',
      slug: 'classic-sofa',
      isAvailable: true,
      isFeatured: true,
      isPublished: true,
      categories: {
        connect: { id: livingRoom.id },
      },
      tags: {
        connect: [
          { id: tags[1].id }, // کلاسیک
          { id: tags[3].id }, // پارچه‌ای
        ],
      },
      images: {
        create: [
          {
            url: '/placeholder.svg',
            alt: 'مبل راحتی کلاسیک',
            isMain: true,
          },
        ],
      },
      attributes: {
        create: [
          { name: 'جنس رویه', value: 'پارچه مخمل درجه یک' },
          { name: 'جنس اسفنج', value: 'فوم سرد با تراکم بالا' },
          { name: 'جنس فریم', value: 'چوب روسی' },
        ],
      },
      dimensions: {
        create: {
          length: 220,
          width: 90,
          height: 85,
          unit: 'cm',
        },
      },
      variants: {
        create: [
          {
            name: 'کرم',
            price: 1250,
            stock: 5,
            options: { color: 'کرم', colorCode: '#E8DCCA' },
          },
          {
            name: 'قهوه‌ای',
            price: 1250,
            stock: 3,
            options: { color: 'قهوه‌ای', colorCode: '#8B4513' },
          },
          {
            name: 'خاکستری',
            price: 1250,
            stock: 2,
            options: { color: 'خاکستری', colorCode: '#808080' },
          },
        ],
      },
    },
  });
  
  const diningTableProduct = await prisma.product.upsert({
    where: { slug: 'wooden-dining-table' },
    update: {},
    create: {
      name: 'میز ناهارخوری چوبی',
      description: 'میز ناهارخوری چوبی با طراحی مدرن و ظرفیت ۶ نفر. ساخته شده از چوب طبیعی با پایه‌های فلزی محکم.',
      price: 750,
      compareAtPrice: 900,
      stock: 8,
      sku: 'TABLE-DIN-001',
      slug: 'wooden-dining-table',
      isAvailable: true,
      isFeatured: true,
      isPublished: true,
      categories: {
        connect: { id: diningRoom.id },
      },
      tags: {
        connect: [
          { id: tags[0].id }, // مدرن
          { id: tags[2].id }, // چوبی
        ],
      },
      images: {
        create: [
          {
            url: '/placeholder.svg',
            alt: 'میز ناهارخوری چوبی',
            isMain: true,
          },
        ],
      },
      attributes: {
        create: [
          { name: 'جنس صفحه', value: 'چوب بلوط' },
          { name: 'جنس پایه', value: 'فلز مشکی مات' },
          { name: 'ظرفیت', value: '۶ نفر' },
        ],
      },
      dimensions: {
        create: {
          length: 180,
          width: 90,
          height: 75,
          unit: 'cm',
        },
      },
    },
  });
  
  console.log('Created sample products');
  
  // Create settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'مبلمان جنیکا',
      storeEmail: 'info@mobleman.com',
      storePhone: '021-12345678',
      storeAddress: 'تهران، خیابان ولیعصر',
      currencyCode: 'IRR',
      taxPercent: 9,
    },
  });
  
  console.log('Created store settings');
  
  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 