# The Protein Revolution - Complete eCommerce Website

A modern, full-featured eCommerce website built with Next.js, specializing in protein supplements and fitness products.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse 10+ premium protein supplements with detailed information
- **Smart Search & Filtering**: Advanced search with category, brand, and price filters
- **Shopping Cart**: Full cart management with quantity updates and order summary
- **Secure Checkout**: Complete checkout flow with order confirmation
- **User Authentication**: Secure login/registration with Google OAuth
- **Customer Dashboard**: Order history, profile management, and order tracking
- **Product Reviews**: Rate and review products
- **Newsletter Subscription**: Stay updated with latest offers

### Admin Features
- **Admin Dashboard**: Comprehensive analytics with charts and statistics
- **Product Management**: Full CRUD operations for products with inventory tracking
- **Order Management**: View, update, and track customer orders
- **User Management**: Manage customer accounts and roles
- **Real-time Analytics**: Revenue tracking, low stock alerts, and sales reports

### Technical Features
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **SEO Optimized**: Server-side rendering with proper meta tags
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **Type Safety**: Full TypeScript implementation
- **API Routes**: RESTful API with comprehensive error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (NeonDB recommended)
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd protein-revolution
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   - Database URL (PostgreSQL)
   - NextAuth secret and Google OAuth credentials
   - Other optional services

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

The application uses the following main models:

- **User**: Customer accounts and admin users
- **Category**: Product categories (Whey Protein, Mass Gainer, Isolate)
- **Product**: Product catalog with full details
- **Order**: Customer orders with items and tracking
- **Cart**: Shopping cart functionality
- **Review**: Product reviews and ratings
- **Newsletter**: Email subscriptions

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Database Setup (NeonDB)**
   - Create a PostgreSQL database on [NeonDB](https://neon.tech)
   - Update `DATABASE_URL` in Vercel environment variables
   - Run database migrations and seeding

### Environment Variables for Production

Required variables for deployment:
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 👤 Default Accounts

After seeding the database, you can use these test accounts:

### Admin Account
- **Email**: admin@theproteinrevolution.com
- **Password**: admin123
- **Role**: ADMIN (Full access to admin panel)

### Customer Account
- **Email**: john@example.com
- **Password**: customer123
- **Role**: USER (Customer access)

### Google OAuth
- You can also sign in with Google OAuth

## 🛍️ Sample Products

The seed includes 10 premium products across 3 categories:

### Whey Protein
- Optimum Nutrition Gold Standard 100% Whey
- Dymatize ISO100 Hydrolyzed Protein
- BSN Syntha-6 Whey Protein Matrix
- MuscleTech NitroTech Whey Peptides

### Mass Gainer
- Serious Mass Gainer by Optimum Nutrition
- MuscleBlaze Mass Gainer XXL
- Dymatize Super Mass Gainer

### Isolate
- Isopure Zero Carb Protein Isolate
- Ultimate Nutrition ISO Sensation 93
- BPI Sports ISO HD Protein Isolate

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/products` - Get products with filtering
- `GET /api/products/[slug]` - Get single product
- `GET /api/categories` - Get all categories
- `GET /api/search` - Search products
- `POST /api/newsletter` - Subscribe to newsletter

### Protected Endpoints (User)
- `GET/POST/PUT/DELETE /api/cart` - Cart management
- `GET/POST /api/orders` - Order management
- `POST /api/reviews` - Product reviews

### Admin Endpoints
- `GET /api/admin/orders` - Manage all orders
- `PATCH /api/admin/orders/[id]` - Update order status
- `PATCH/DELETE /api/admin/products/[id]` - Manage products

## 📱 Key Pages

### Customer Pages
- `/` - Homepage with featured products
- `/all-products` - Product catalog with filters
- `/categories/[slug]` - Category-specific products
- `/product/[slug]` - Product detail page
- `/search` - Search results
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/order-confirmation/[orderNumber]` - Order success
- `/dashboard` - Customer dashboard
- `/auth/signin` - Authentication

### Admin Pages
- `/admin` - Admin dashboard with analytics
- `/admin/products` - Product management
- `/admin/orders` - Order management

## 🎨 Customization

### Styling
- Update colors in `tailwind.config.ts`
- Modify components in `src/components/`
- Update layout in `src/components/layout/`

### Branding
- Replace logo in header component
- Update company information
- Modify email templates

### Products
- Add new products via admin panel
- Update categories in database
- Modify product schema if needed

## 🔒 Security Features

- **Authentication**: Secure login with NextAuth.js
- **Authorization**: Role-based access control
- **Data Validation**: Input validation on all forms
- **SQL Injection Prevention**: Prisma ORM protection
- **CSRF Protection**: Built-in Next.js protection

## 📊 Performance

- **Server-Side Rendering**: Fast initial page loads
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting
- **Caching**: Built-in caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## 🎯 Future Enhancements

- Payment gateway integration (Stripe/Razorpay)
- Email notifications for orders
- Advanced analytics dashboard
- Mobile app development
- Multi-language support
- Advanced inventory management
- Wishlist functionality
- Product comparison feature

---

Built with ❤️ using Next.js and modern web technologies.
