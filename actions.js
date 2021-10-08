import axios from 'axios';

import * as types from './types';

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
                dispatch(getWalletError(error));
            });
    };
}

const getWalletPending = () => ({
    type: types.GET_WALLET_PENDING
})

const getWalletSuccess = wallets => ({
    type: types.GET_WALLET_SUCCESS,
    payload: { ...wallets }
})

const getWalletError = error => ({
    type: types.GET_WALLET_ERROR,
    payload: { error }
})

// Get user categories
export const getUserCategories = () => {
    return dispatch => {
        dispatch(getCategoryPending());
        axios.request({
            method: "get",
            url: "/api/category",
        })
            .then(response => {
                dispatch(getCategorySuccess(response.data));
            })
            .catch(error => {
                dispatch(getCategoryError(error));
            });
    };
}

const getCategoryPending = () => ({
    type: types.GET_CATEGORY_PENDING
})

const getCategorySuccess = categories => ({
    type: types.GET_CATEGORY_SUCCESS,
    payload: { ...categories }
})

const getCategoryError = error => ({
    type: types.GET_CATEGORY_ERROR,
    payload: { error }
})

// Get user balances
export const getUserBalances = () => {
    return dispatch => {
        dispatch(getBalancePending());
        axios.request({
            method: "get",
            url: "/api/balance",
        })
            .then(response => {
                dispatch(getBalanceSuccess(response.data));
            })
            .catch(error => {
                dispatch(getBalanceError(error));
            });
    };
}

const getBalancePending = () => ({
    type: types.GET_BALANCE_PENDING
})

const getBalanceSuccess = balances => ({
    type: types.GET_BALANCE_SUCCESS,
    payload: { ...balances }
})

const getBalanceError = error => ({
    type: types.GET_BALANCE_ERROR,
    payload: { error }
})
