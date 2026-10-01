# Modern Agency & Client Portal Platform

A full-stack, end-to-end web application built for modern consulting agencies. This project seamlessly integrates a stunning, high-performance landing page with a robust client portal, enabling users to understand the agency's offerings and immediately submit and track project requirements in a secure environment.

## 🚀 Overview & Architecture

This application is split into two core experiences:
1. **Public-Facing Landing Page**: A visually engaging, conversion-optimized site that explains the agency's methodology, industries served, and deliverables. It features dynamic scroll animations and modern UI components.
2. **Secure Client & Admin Portal**: A fully authenticated dashboard system where clients can submit detailed project requirements and track their progress, while administrators manage users and incoming requests.

## ✨ Key Features

### Dynamic Landing Page
- **Immersive UI/UX**: Built with custom animations (using Framer Motion), a sticky floating action button, and a responsive hero section.
- **Content Sections**: Dedicated modules for *Why We Exist*, *Industries Grid*, *How We Work*, *HILAR Methodology*, *Deliverables*, and an interactive *FAQ*.

### Client Portal (Protected Routes)
- **Authentication**: Secure Sign Up, Sign In, Password Reset, and Forced Password Change flows via Supabase Auth.
- **Requirement Submission**: Comprehensive, multi-step forms for clients to submit new project requirements.
- **User Dashboard**: Personalized dashboard allowing clients to view and track the status of their submitted requirements.

### Administrator Console (Admin Routes)
- **Admin Dashboard**: High-level overview of platform metrics and incoming requirements.
- **User Management**: View and manage all registered users on the platform.
- **Requirement Management**: Review, update statuses, and manage all client-submitted requirements securely.

## 🛠️ Technology Stack

- **Frontend Framework**: React 19, Vite, React Router DOM v7
- **Styling & Animations**: Tailwind CSS, PostCSS, Framer Motion, standard CSS for custom component-level styling
- **Backend & Database**: Supabase (PostgreSQL Database, Authentication, and Storage)
- **Icons & Assets**: Lucide React, Google Material Symbols
- **Code Quality**: ESLint / Oxlint

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- A Supabase project with authentication and database tables configured.

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd rndworkzone-personal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the project root (reference `.env.example` if available) and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📸 Project Showcase
*(In your portfolio, replace this text with screenshots or GIFs demonstrating the animated landing page, the requirement submission form, and the admin dashboard.)*

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
