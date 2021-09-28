import axios from 'axios';

import * as types from './types'

// INITIALIZES CLOCK ON SERVER
export const serverRenderClock = () => (dispatch) =>
    dispatch({
        type: types.TICK,
        payload: { light: false, ts: Date.now() },
    })

// INITIALIZES CLOCK ON CLIENT
export const startClock = () => (dispatch) =>
    setInterval(() => {
        dispatch({ type: types.TICK, payload: { light: true, ts: Date.now() } })
    }, 1000)

// INCREMENT COUNTER BY 1
export const incrementCount = () => ({ type: types.INCREMENT })

// DECREMENT COUNTER BY 1
export const decrementCount = () => ({ type: types.DECREMENT })

// RESET COUNTER
export const resetCount = () => ({ type: types.RESET })

// Open Snackbar
export const openSnackbar = (open, message, type) => (dispatch) => dispatch({
    type: types.OPEN_SNACKBAR,
    payload: { open: open, message: message, type: type },
})

// Close Snackbar
export const closeSnackbar = () => (dispatch) => dispatch({
    type: types.CLOSE_SNACKBAR,
})

// Get user wallets
export const getUserWallets = () => {
    return dispatch => {
        dispatch(getWalletPending());
        axios.request({
            method: "get",
            url: "/api/wallet",
        })
            .then(response => {
                dispatch(getWalletSuccess(response.data));
            })
            .catch(error => {
                console.log(error);
            });
    };
}

const getWalletPending = () => ({
    type: types.GET_WALLET_PENDING
})

const getWalletSuccess = wallets => ({
    type: types.GET_WALLET_SUCCESS,
    payload: {
        ...wallets
    }
})

const getWalletError = error => ({
    type: types.GET_WALLET_ERROR,
    payload: {
        error
    }
})