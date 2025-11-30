"use client";

import ThemeCarousel from "./theme-carousel";
import { ScrollAnimation } from '@/components/motion-primitives/scroll-animation'

export default function CarouselContainer() {
    return (
      <section className="w-full py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollAnimation direction="up" delay={0.1}>
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl leading-tight mb-4 text-black dark:text-white">Customize for your business</h2>
            <p className="text-base max-w-2xl mx-auto text-black dark:text-white md:text-lg lg:text-xl">
              Customize the dashboard to your business needs. Choose from a variety of themes and layouts to fit your brand. 
              Add your own logo and branding to the dashboard. Add custom widgets to the dashboard to display your own data.
              Add custom alerts and notifications to the dashboard to notify you when something happens.
            </p>
          </div>
          </ScrollAnimation>
          <ScrollAnimation direction="scale" delay={0.3} duration={0.8}>
          <ThemeCarousel />
          </ScrollAnimation>
        </div>
      </section>
    );
  }
