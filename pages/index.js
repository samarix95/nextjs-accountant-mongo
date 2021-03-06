import * as React from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';

const Index = () => {
    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Home page
                </Typography>
                <ProTip />
                <Copyright />
            </Box>
        </Container>
    );
}

export default Index;