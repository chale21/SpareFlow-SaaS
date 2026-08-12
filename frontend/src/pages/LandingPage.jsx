import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import BenefitsSection from '../components/landing/BenefitsSection';
import HowItWorks from '../components/landing/HowItWorks';
import BusinessFlow from '../components/landing/BusinessFlow';
import SecuritySection from '../components/landing/SecuritySection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

/**
 * Completely Redesigned SpareFlow SaaS Landing Page.
 * Modern, responsive B2B SaaS landing page for spare parts inventory management.
 */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <HowItWorks />
        <BusinessFlow />
        <SecuritySection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;