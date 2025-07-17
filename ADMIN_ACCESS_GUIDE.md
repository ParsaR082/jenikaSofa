# Admin Panel Access Guide

This guide explains how to access the admin panel and test different user roles in your Sofa furniture application.

## 🚀 Quick Start

### 1. Setup Database and Seed Data
First, make sure your database is set up with the seeded test data:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 2. Start the Application
```bash
npm run dev
```

Visit: `http://localhost:3000`

## 👥 Test Credentials

Your application comes with pre-seeded test users:

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `SUPER_ADMIN`
- **Access**: Full admin panel access

### Regular User
- **Username**: `testuser`
- **Password**: `user123`
- **Role**: `USER`
- **Access**: User dashboard only

## 🔐 How to Access Admin Panel

### Method 1: Direct Login as Admin
1. Go to `/fa/login` (or your preferred locale)
2. Enter admin credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click login
4. **You'll be automatically redirected to `/fa/admin`** ✨

### Method 2: Via User Dropdown (for logged-in admin)
1. If you're already logged in as an admin user
2. Click on your user avatar in the top-right corner
3. You'll see a "پنل مدیریت" (Admin Panel) option
4. Click it to access the admin dashboard

## 🎯 Testing Different User Experiences

### Test Regular User Experience
1. **Login as regular user**:
   - Username: `testuser`
   - Password: `user123`
2. **You'll be redirected to `/fa/account`** (User Dashboard)
3. **User dropdown will show**:
   - حساب کاربری (User Account)
   - سفارشات من (My Orders)
   - علاقه‌مندی‌ها (Favorites)
   - آدرس‌ها (Addresses)
   - روش‌های پرداخت (Payment Methods)

### Test Admin User Experience
1. **Login as admin**:
   - Username: `admin`
   - Password: `admin123`
2. **You'll be redirected to `/fa/admin`** (Admin Dashboard)
3. **User dropdown will show**:
   - پنل مدیریت (Admin Panel) ← **This is unique to admins**
   - All the regular user options

## 🏗️ Admin Panel Features

The admin panel includes:

### 📊 Dashboard (`/fa/admin`)
- System statistics
- Recent orders overview
- Popular products
- Quick action buttons

### 👥 User Management (`/fa/admin/users`)
- View all users
- Create new users
- Edit user roles
- Delete users (except SUPER_ADMIN)
- User statistics

### 📦 Product Management (`/fa/admin/products`)
- Manage product catalog
- Add new products
- Edit existing products

### 📋 Order Management (`/fa/admin/orders`)
- View and manage customer orders
- Order status tracking

## 🔒 Security Features

### Role-Based Access Control
- **AdminGuard component** protects all admin routes
- **Automatic redirects**:
  - Non-logged-in users → Login page
  - Regular users trying to access admin → User dashboard
  - Admin users → Admin dashboard

### Route Protection
All admin routes are protected by:
```typescript
<AdminGuard locale={params.locale}>
  <AdminLayout>
    {/* Admin content */}
  </AdminLayout>
</AdminGuard>
```

## 🎨 Design Consistency

### User Dashboard Updates
I've updated the user dashboard (`/fa/account`) to:
- ✅ Use `MainLayout` (same as rest of website)
- ✅ Consistent color scheme and styling
- ✅ Standard card components
- ✅ Proper spacing and typography
- ✅ Responsive design

### Admin Panel Design
The admin panel uses:
- Dedicated `AdminLayout` with sidebar navigation
- Consistent card-based design
- Professional admin UI patterns
- Responsive design for mobile/desktop

## 🔄 Quick Testing Workflow

1. **Test Regular User Flow**:
   ```
   Login with testuser → User Dashboard → Explore features
   ```

2. **Test Admin Flow**:
   ```
   Login with admin → Admin Dashboard → Test admin features
   ```

3. **Test Role Switching**:
   ```
   Login as testuser → Try accessing /fa/admin → Should redirect to /fa/account
   Login as admin → Access admin panel → Full access granted
   ```

## 🛠️ Creating Additional Admin Users

You can create more admin users through:

1. **Admin Panel** (as existing admin):
   - Go to `/fa/admin/users`
   - Click "افزودن کاربر" (Add User)
   - Set role to `ADMIN` or `SUPER_ADMIN`

2. **Database Seeding** (add to `prisma/seed.ts`):
   ```typescript
   const newAdmin = await prisma.user.upsert({
     where: { username: 'newadmin' },
     update: {},
     create: {
       username: 'newadmin',
       name: 'New Admin User',
       email: 'newadmin@example.com',
       hashedPassword: await bcrypt.hash('password123', 12),
       role: Role.ADMIN,
     },
   });
   ```

## 🎉 You're All Set!

Your application now has:
- ✅ Consistent user dashboard design
- ✅ Fully functional admin panel
- ✅ Role-based access control
- ✅ Automatic redirects based on user role
- ✅ Test credentials ready to use

**Happy testing!** 🚀 