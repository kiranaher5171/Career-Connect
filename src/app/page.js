"use client";
import {
    HeroSection,
    FeaturedJobs,
    JobCategories,
    HowItWorks,
    StatisticsSection,
    WhyJoinUs,
    TestimonialsSection
} from '@/components/features/home';
import HeaderFooterLayout from '@/components/layouts/header-footer-layout/HeaderFooterLayout';
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
                <TestimonialsSection />
            </HeaderFooterLayout>
        </>
    )
}

export default page

