import * as React from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';

const Settings = () => {
    return (
        <Container>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Settings page
                </Typography>
                <ProTip />
                <Copyright />
            </Box>
        </Container>
    );
}

export default Settings;