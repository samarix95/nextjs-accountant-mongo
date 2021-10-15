import * as React from 'react';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import SettingsComponent from '../src/SettingsComponent';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';

const Settings = () => {
    return (
        <Container>
            <Box>
                <SettingsComponent />
                <ProTip />
                <Copyright />
            </Box>
        </Container>
    );
}

export default Settings;
