import { Box, Grid, Divider } from "@mui/material";

export default function TableSkeleton() {
    // Optimized skeleton using CSS instead of many MUI Skeleton components
    const skeletonRows = Array.from({ length: 10 }, (_, i) => i);

    return (
        <Box className="table-skeleton">
            <Grid container spacing={0} alignItems="center">
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box pt={'4px'}>
                        {/* Header skeleton */}
                        <Box 
                            className="skeleton-shimmer"
                            sx={{
                                width: '100%',
                                height: 28,
                                borderRadius: 1,
                                mb: 1,
                            }}
                        />
                        <Box pt={1}>
                            <Divider />
                        </Box>
                        {/* Table rows skeleton - using CSS for better performance */}
                        {skeletonRows.map((row) => (
                            <Box
                                key={row}
                                className="skeleton-shimmer"
                                sx={{
                                    width: '100%',
                                    height: 40,
                                    borderRadius: 1,
                                    mb: 1,
                                    mt: row === 0 ? 1 : 0,
                                }}
                            />
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
