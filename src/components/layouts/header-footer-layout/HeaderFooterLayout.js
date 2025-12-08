"use client";
import { Box } from "@mui/material";
import Header from "./Header"; 
import Footer from "./Footer";

/**
 * HeaderFooterLayout - Layout with header and footer
 * Used for pages that need header and footer but no sidebar
 */
export default function HeaderFooterLayout({ children }) {
    return (
        <Box>
            <Header/>
            <Box className="child-content">
                {children}
            </Box>
            <Footer/>
        </Box>
    );
}

