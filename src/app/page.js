"use client";
import {
    HeroSection,
    FeaturedJobs,
    JobCategories,
    HowItWorks,
    StatisticsSection,
    WhyJoinUs,
    TestimonialsSection,
    AboutUs
} from '@/components/features/home';
 import HeaderFooterLayout from '@/components/layouts/header-footer-layout/HeaderFooterLayout';
import React from 'react'

const page = () => {
    return (
        <>
            <HeaderFooterLayout>
                <HeroSection />
                <AboutUs/>
                 <FeaturedJobs />
                <JobCategories />
                <HowItWorks />
                <StatisticsSection />
                <WhyJoinUs />
                <TestimonialsSection />
            </HeaderFooterLayout>
        </>
    )
}

export default page

