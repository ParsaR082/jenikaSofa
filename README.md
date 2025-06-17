# Mobleman - مبلمان جنیکا

Mobleman is an e-commerce platform for furniture built with Next.js, PostgreSQL, and Prisma.

## Features

- 🛍️ Complete e-commerce functionality for furniture products
- 🔐 User authentication with phone verification
- 🛒 Shopping cart and checkout process
- 👤 User account management
- 📱 Responsive design for all devices
- 🌐 Internationalization (currently Persian)
- 🖼️ Image uploads via UploadThing
- 🧾 Order management system
- 👑 Admin panel for product management

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Containerization**: Docker
- **Internationalization**: next-intl
- **Forms**: React Hook Form, Zod

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mobleman.git
cd mobleman
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://mobleman:mobleman_password@localhost:5432/mobleman_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Upload Thing (for image uploads)
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Kavenegar SMS Service (for phone verification)
KAVENEGAR_API_KEY=your_kavenegar_api_key

# General
NODE_ENV="development"
```

## Database Setup

### Using Docker (Recommended)

1. Start the PostgreSQL container:

```bash
npm run docker:up
```

2. Generate Prisma client, run migrations, and seed the database:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Alternatively, you can use the all-in-one setup script:

For Unix/Linux/Mac:
```bash
chmod +x scripts/db-setup.sh
./scripts/db-setup.sh
```

For Windows:
```powershell
.\scripts\db-setup.ps1
```

### Using an Existing PostgreSQL Server

If you're using an existing PostgreSQL server, update the `DATABASE_URL` in your `.env` file and run:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at http://localhost:3000.

### Production Mode

```bash
npm run build
npm start
```

### Using Docker

To run the entire application (including PostgreSQL) in Docker:

```bash
npm run docker:build
npm run docker:up
```

The application will be available at http://localhost:3000, and pgAdmin will be available at http://localhost:5050.

## Database Management

- **pgAdmin**: Access at http://localhost:5050
  - Email: admin@mobleman.com
  - Password: admin_password

- **Prisma Studio**: Run the following command for a visual database editor:
  ```bash
  npx prisma studio
  ```

## Admin Access

After seeding the database, you can access the admin panel with:
- Email: admin@mobleman.com
- Password: Admin123!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 