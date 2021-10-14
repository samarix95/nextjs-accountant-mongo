import * as React from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';

const About = () => {
    return (
        <Container maxWidth="sm">
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    About page
                </Typography>
                <ProTip />
                <Copyright />
            </Box>
        </Container>
    );
}

export default About;