import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import { Provider } from 'next-auth/client'
import { Provider as ReduxProvider } from "react-redux";
import { useStore } from '../store';

import HeaderComponent from '../src/HeaderComponent';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    const store = useStore(pageProps.initialReduxState);

    return (
        <ReduxProvider store={store}>
            <Provider session={pageProps.session}>
                <CacheProvider value={emotionCache}>
                    <Head>
                        <title>Accountant</title>
                        <meta name="viewport" content="initial-scale=1, width=device-width" />
                    </Head>
                    <ThemeProvider theme={theme}>
                        <Box sx={{ display: 'flex' }}>
                            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                            <CssBaseline />
                            <HeaderComponent />
                            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                                <Toolbar />
                                <Component {...pageProps} />
                            </Box>
                        </Box>
                    </ThemeProvider>
                </CacheProvider>
            </Provider>
        </ReduxProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};

export default MyApp;