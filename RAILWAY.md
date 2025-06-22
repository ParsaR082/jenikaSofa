# Railway Deployment Guide

This document provides instructions for deploying this Next.js application on Railway.

## Prerequisites

- A Railway account (https://railway.app/)
- Git repository connected to Railway

## Environment Variables

The following environment variables need to be set in your Railway project:

- `DATABASE_URL`: PostgreSQL connection string (automatically set when adding a PostgreSQL service)
- `KAVENEGAR_API_KEY`: Your Kavenegar API key for SMS services
- `NEXTAUTH_SECRET`: A random string for NextAuth.js session encryption
- `NEXTAUTH_URL`: The URL of your deployed application (e.g., https://your-app-name.up.railway.app)

## Deployment Steps

1. Create a new project in Railway
2. Add a PostgreSQL service to your project
3. Connect your Git repository
4. Set the required environment variables
5. Deploy the application

## Database Migrations

Database migrations will run automatically during the build process using the `railway:migrate` script.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Railway logs for error messages
2. Verify that all environment variables are set correctly
3. Make sure the PostgreSQL service is properly connected
4. Try redeploying the application

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma with Railway Guide](https://railway.app/guides/prisma) 