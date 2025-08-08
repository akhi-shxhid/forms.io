# Forms.io - Modern Form Builder

<img src="Screenshot%202025-08-08%20201927.png" alt="forms.io Landing Page" width="100%" />

A powerful, modern form builder application with a brutalist design aesthetic. Built with React, TypeScript, and Supabase for creating, sharing, and managing forms with real-time validation and response collection.

## 🚀 Created by Shahid Afrid
**Live site**: (https://formsio.vercel.app)
**Portfolio**: [shahid-topaz.vercel.app](https://shahid-topaz.vercel.app)  
**LinkedIn**: [linkedin.com/in/shahid-afrid-218186308](https://linkedin.com/in/shahid-afrid-218186308)  
**GitHub**: [github.com/akhi-shxhid](https://github.com/akhi-shxhid)

---

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop Form Builder**: Intuitive interface for creating forms
- **Real-time Validation**: Instant feedback with custom validation rules
- **Public Form Sharing**: Generate shareable links for form distribution
- **Response Collection**: Automatic storage of form submissions in Supabase
- **Dashboard Analytics**: Track form performance and submission statistics
- **Mobile Responsive**: Optimized for all device sizes

### 🛠️ Field Types
- **Text Input**: Single-line text with validation options
- **Number Input**: Numeric fields with min/max constraints
- **Textarea**: Multi-line text input
- **Select Dropdown**: Single-choice selection from options
- **Radio Buttons**: Single-choice selection with visual options
- **Checkboxes**: Boolean true/false selections
- **Date Picker**: Date selection with calendar interface
- **Derived Fields**: Calculated fields based on other form values

### 🔒 Advanced Features
- **User Authentication**: Secure login with Google OAuth and email/password
- **Row-Level Security**: Data protection with Supabase RLS policies
- **Form Validation**: Email validation, password strength, length constraints
- **Derived Calculations**: Dynamic field calculations (e.g., age from birthdate)
- **Export Functionality**: Download form schemas as JSON
- **Demo Mode**: Comprehensive demo showcasing all field types

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Redux Toolkit** - Predictable state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication & authorization
  - Row-level security (RLS)
  - Edge functions

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## dashboard 

<div align="center">
  <img src="Screenshot%202025-08-08%20201946.png" alt="forms.io Dashboard" width="80%" />
</div>


## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akhi-shxhid/forms-io.git
   cd forms-io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `src/integrations/supabase/client.ts` with your credentials

4. **Run database migrations**
   ```bash
   # The migrations are already included in the supabase/migrations folder
   # They will be applied automatically when you set up your Supabase project
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

---

## 📊 Database Schema

### Tables

#### `forms`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `name` (text) - Form title
- `schema` (jsonb) - Form field definitions
- `is_public` (boolean) - Public sharing status
- `share_slug` (text, unique) - URL slug for public access
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### `submissions`
- `id` (uuid, primary key)
- `form_id` (uuid, foreign key to forms)
- `data` (jsonb) - Form submission data
- `created_at` (timestamptz)

### Security
- Row-Level Security (RLS) enabled on all tables
- Users can only access their own forms
- Public forms are readable by anyone
- Submissions are only accessible to form owners

---

## 🎨 Design Philosophy

### Brutalist Aesthetic
Forms.io embraces a **brutalist design** philosophy with:
- **Bold, chunky borders** (4px black borders)
- **High contrast colors** (black text on bright backgrounds)
- **No rounded corners** (sharp, geometric shapes)
- **Dramatic shadows** (8px offset shadows)
- **Uppercase, bold typography**
- **Vibrant color palette** (primary red, secondary blue, accent yellow)

### Color System
```css
--primary: #FF6B6B (Coral Red)
--secondary: #2196F3 (Material Blue)
--accent: #FFD600 (Golden Yellow)
--background: #FFFDF7 (Cream White)
--foreground: #000000 (Pure Black)
```

---

## 🔧 Configuration

### Environment Variables
The application uses Supabase configuration embedded in the client. For production deployment, ensure your Supabase project has:
- Proper RLS policies
- Authentication providers configured
- CORS settings for your domain

### Customization
- **Colors**: Modify CSS variables in `src/index.css`
- **Components**: Extend shadcn/ui components in `src/components/ui/`
- **Validation**: Add custom rules in `src/features/builder/validation.ts`
- **Field Types**: Extend field types in `src/features/builder/types.ts`

---

## 📱 Usage Guide

### Creating Forms
1. **Sign up/Login** - Use Google OAuth or email/password
2. **Navigate to Create** - Access the form builder
3. **Add Fields** - Choose from 8+ field types
4. **Configure Validation** - Set rules for each field
5. **Save Form** - Store in your personal library

### Sharing Forms
1. **Open My Forms** - View your form library
2. **Click Share** - Generate public link
3. **Copy URL** - Share with respondents
4. **Track Responses** - Monitor submissions in dashboard

### Managing Responses
1. **Dashboard Overview** - See form statistics
2. **Response Count** - Track submission numbers
3. **Export Data** - Download form schemas
4. **Public/Private Toggle** - Control form visibility

---

## 🚀 Deployment

### Netlify (Recommended)
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Vercel
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment
1. **Build for production**
   ```bash
   npm run build
   ```

2. **Serve the `dist` folder** using any static hosting service

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component patterns
- Maintain the brutalist design aesthetic
- Add proper error handling
- Include appropriate validation

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Supabase** - For the excellent backend-as-a-service platform
- **shadcn/ui** - For the beautiful component library
- **Tailwind CSS** - For the utility-first CSS framework
- **React Team** - For the amazing frontend framework
- **Vercel** - For the deployment platform

---

## 📞 Support

If you have any questions or need help with the project:

- **Email**: [Contact through LinkedIn](https://linkedin.com/in/shahid-afrid-218186308)
- **GitHub Issues**: [Create an issue](https://github.com/akhi-shxhid/forms-io/issues)
- **Portfolio**: [shahid-topaz.vercel.app](https://shahid-topaz.vercel.app)

---

<div align="center">

**Built with ❤️ by Shahid Afrid**

[Portfolio](https://shahid-topaz.vercel.app) • [LinkedIn](https://linkedin.com/in/shahid-afrid-218186308) • [GitHub](https://github.com/akhi-shxhid)

</div>
