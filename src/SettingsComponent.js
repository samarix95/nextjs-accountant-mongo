import * as React from 'react';

import ThemeContext from "../src/theme/ThemeContext";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const SettingsComponent = () => {
    const value = React.useContext(ThemeContext);
    let { themeSelected } = value.state;
    let { changeTheme } = value;

    const handleSwitchTheme = (event) => {
        changeTheme(event.target.checked ? "dark" : "light");
        localStorage.setItem("darkModeEnabled", event.target.checked);
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Theme settings
            </Typography>
            <FormControl component="fieldset">
                <FormControlLabel
                    value="end"
                    control={<Switch checked={themeSelected.palette.mode === "dark"} onChange={handleSwitchTheme} color="primary" />}
                    label="Dark theme"
                    labelPlacement="end"
                />
            </FormControl>
        </Box>
    );
}

export default SettingsComponent;
