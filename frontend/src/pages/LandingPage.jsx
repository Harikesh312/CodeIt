import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import AnimatedBackground from '../components/landing/AnimatedBackground';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import StatisticsSection from '../components/landing/StatisticsSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816]">
      <AnimatedBackground />
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <StatisticsSection />
        <DashboardPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
