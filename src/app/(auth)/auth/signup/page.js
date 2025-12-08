"use client";
import { Box, Container, Grid, Typography } from "@mui/material";
import Form from "./Form";

const page = () => {
  return (
    <Box id="form-bg">
      <Container maxWidth="lg" className="main-container">
        <Grid
          container
          alignItems="flex-end"
          justifyContent="center"
          style={{ width: "100%" }}
        >
          <Grid size={{ lg: 8, md: 6, sm: 4, xs: 12 }}>
            <Box>
              <Box className="form-side-text">
                <Typography
                  variant="h1"
                  className="main-txt"
                  gutterBottom
                  pt={1}
                >
                  CareerConnect Portal
                </Typography>

                <Typography variant="h4" className="sub-txt">
                  Your Gateway to Career Opportunities
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Section */}
          <Grid size={{ lg: 4, md: 6, sm: 8, xs: 12 }}>
            <Form />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default page;
