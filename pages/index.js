import * as React from 'react';
import { getSession } from 'next-auth/client'
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import HeaderComponent from '../src/HeaderComponent';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import { getWalletsForInnerUse } from '../pages/api/wallet';

export const getServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });

    if (!session) {
        res.statusCode = 403;
        return { props: { wallets: { data: [] } } };
    }

    const jsonData = await getWalletsForInnerUse(session.user.id);

    return { props: { wallets: jsonData } };
};

const Index = (props) => {
    const { wallets } = props;

    return (
        <HeaderComponent wallets={wallets}>
            <Container maxWidth="sm">
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Next.js v5 example
                    </Typography>
                    <Link href="/about" color="secondary">
                        Go to the about page
                    </Link>
                    <ProTip />
                    <Copyright />
                </Box>
            </Container>
        </HeaderComponent>
    );
}

Index.propTypes = {
    wallets: PropTypes.object,
};

export default Index;