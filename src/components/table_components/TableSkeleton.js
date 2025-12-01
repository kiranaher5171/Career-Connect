import { Box, Grid, Divider } from "@mui/material";
import Skeleton from '@mui/material/Skeleton';

export default function TableSkeleton() {

    return (
        <>
            <Box className="table-skeleton">
                <Grid container spacing={0} alignItems="center">
                    <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                        <Box pt={'4px'}>
                            <Skeleton variant="rectangular" width={'100%'} height={28} />
                            <Box pt={1}>
                                <Divider />
                            </Box>
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '25px' }} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
