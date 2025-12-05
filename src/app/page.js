"use client";
import {
    HeroSection,
    FeaturedJobs,
    JobCategories,
    HowItWorks,
    StatisticsSection,
    WhyJoinUs,
    AboutUs,
    TestimonialsSection
} from '@/components/home';
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';
import React from 'react'

const page = () => {
    return (
        <>
            <HeaderFooterLayout>
                <HeroSection />
                <FeaturedJobs />
                <JobCategories />
                <HowItWorks />
                <StatisticsSection />
                <WhyJoinUs />
                <AboutUs />
                <TestimonialsSection />
            </HeaderFooterLayout>
        </>
    )
}

export default page

