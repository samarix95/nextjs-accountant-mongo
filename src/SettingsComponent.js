import * as React from 'react';

import { switchMode } from './theme';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const SettingsComponent = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const handleSwitchTheme = (event) => {
        localStorage.setItem("darkModeEnabled", event.target.checked);
        setIsDarkMode(event.target.checked);
    }

    React.useEffect(() => {
        const isDarkMode = localStorage.getItem("darkModeEnabled") === "true" ? true : false;
        setIsDarkMode(isDarkMode);
    }, []);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Theme settings
            </Typography>
            <FormControl component="fieldset">
                <FormControlLabel
                    value="end"
                    control={<Switch checked={isDarkMode} onChange={handleSwitchTheme} color="primary" />}
                    label="Dark theme"
                    labelPlacement="end"
                />
            </FormControl>
        </Box>
    );
}

export default SettingsComponent;
