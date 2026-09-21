import HeroSection from '../../components/public/HeroSection';
import QuickAccessCards from '../../components/public/QuickAccessCards';
import StatisticsBar from '../../components/public/StatisticsBar';
import AboutSection from '../../components/public/AboutSection';
import FeaturesSection from '../../components/public/FeaturesSection';
import HowItWorksSection from '../../components/public/HowItWorksSection';
import WhyLiaSection from '../../components/public/WhyLiaSection';
import NewsAndEventsSection from '../../components/public/NewsAndEventsSection';
import CtaBanner from '../../components/public/CtaBanner';

/**
 * HomePage
 * The public-facing homepage for LIA (Lara Intelligent Assistant)
 * for Vignan's Lara Institute of Technology & Science.
 * Recreates the complete visual specification from the reference image.
 */
const HomePage = () => {
  return (
    <div className="lia-home-page">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Portal Quick Access Cards */}
      <QuickAccessCards />

      {/* 3. Campus Statistics Bar */}
      <StatisticsBar />

      {/* 4. About LIA Section */}
      <AboutSection />

      {/* 5. Features Section */}
      <FeaturesSection />

      {/* 6. How It Works + LIA Mascot */}
      <HowItWorksSection />

      {/* 7. Why LIA — Built for a Smarter Tomorrow */}
      <WhyLiaSection />

      {/* 8. News & Events (Announcements + Upcoming Events) */}
      <NewsAndEventsSection />

      {/* 9. Bottom CTA Banner */}
      <CtaBanner />
    </div>
  );
};

export default HomePage;
