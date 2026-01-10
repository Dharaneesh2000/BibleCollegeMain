# Word Bible College Website

A modern, responsive website for Word Bible College of Theology built with React, TypeScript, and Tailwind CSS.

## Features

- **Home Page**: Complete landing page with hero section, features, faculty showcase, news & events, testimonials, FAQ, and contact form
- **Bachelor of Theology Page**: Detailed course information with curriculum structure, requirements, and enrollment options
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Clean, professional design with smooth animations and transitions
- **TypeScript**: Full type safety and better development experience

## Pages

1. **Home Page** (`/`) - Main landing page with all sections
2. **Bachelor of Theology** (`/academics/bachelor-of-theology`) - Course detail page

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Site footer
│   ├── HeroSection.tsx  # Hero banner for home page
│   ├── WhyChooseUs.tsx  # Features section
│   ├── AboutProgram.tsx # About section with video
│   ├── OurFaculty.tsx   # Faculty showcase
│   ├── NewsEvents.tsx   # News and events section
│   ├── Testimonials.tsx # Student testimonials
│   ├── FAQ.tsx          # Frequently asked questions
│   ├── ContactSection.tsx # Contact form section
│   ├── CourseHero.tsx   # Course hero section
│   ├── CourseOverview.tsx # Course overview section
│   ├── CurriculumStructure.tsx # Curriculum details
│   ├── CourseCatalog.tsx # Course catalog download
│   └── CourseRequirements.tsx # Admission requirements
├── pages/               # Page components
│   ├── HomePage.tsx     # Home page
│   └── BachelorOfTheology.tsx # Course page
├── App.tsx              # Main app component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports

assets/
└── images/              # Image assets (currently placeholder images)
    ├── logo.svg
    ├── hero-graduation.jpg
    ├── certificate.jpg
    ├── faculty-placeholder.jpg
    ├── news-placeholder.jpg
    └── pdf-icon.svg
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Vite** - Build tool and development server

## Customization

### Colors

The project uses a custom color palette defined in `tailwind.config.js`:
- `bible-blue`: Primary blue color
- `bible-purple`: Secondary purple color  
- `bible-gold`: Accent gold color

### Images

Replace the placeholder images in the `assets/images/` folder with actual images:
- `logo.svg` - College logo
- `hero-graduation.jpg` - Hero section background
- `certificate.jpg` - Certificate image for course page
- `faculty-placeholder.jpg` - Faculty member photos
- `news-placeholder.jpg` - News article images

## Navigation

- **Home** - Returns to the main landing page
- **About Us** - About page (placeholder)
- **Academics** - Links to Bachelor of Theology course page
- **Faculty** - Faculty page (placeholder)
- **News & Events** - News page (placeholder)
- **Contact Us** - Contact page (placeholder)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
