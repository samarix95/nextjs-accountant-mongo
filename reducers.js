import { combineReducers } from 'redux';

import * as types from './types';

// Initial Snackbar state
const initialSnackbatState = {
    open: false,
    message: "Initial message",
    type: "info",
}

// Snackbar reducer
const snackbarReducer = (state = initialSnackbatState, { type, payload }) => {
    switch (type) {
        case types.OPEN_SNACKBAR:
            return {
                open: payload.open,
                message: payload.message,
                type: payload.type,
            }
        case types.CLOSE_SNACKBAR:
            return {
                open: false,
                message: state.message,
                type: state.type,
            }
        default:
            return state
    }
}

// Initial User wallets state
const initialUserWalletsState = {
    loading: false,
    data: [],
    error: null,
}

// User wallets reducer
const userWalletsReducer = (state = initialUserWalletsState, { type, payload }) => {
    switch (type) {
        case types.GET_WALLET_PENDING:
            return {
                ...state,
                loading: true,
            };
        case types.GET_WALLET_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                data: payload.data,
            };
        case types.GET_WALLET_ERROR:
            return {
                ...state,
                loading: false,
                error: payload.error,
            };
        default:
            return state;
    }
}

// Initial User categories state
const initialUserCategoriesState = {
    loading: false,
    data: [],
    error: null,
}

// User categories reducer
const userCategoriesReducer = (state = initialUserCategoriesState, { type, payload }) => {
    switch (type) {
        case types.GET_CATEGORY_PENDING:
            return {
                ...state,
                loading: true,
            };
        case types.GET_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                data: payload.data,
            };
        case types.GET_CATEGORY_ERROR:
            return {
                ...state,
                loading: false,
                error: payload.error,
            };
        default:
            return state;
    }
}

// COMBINED REDUCERS
const reducers = {
    snackbar: snackbarReducer,
    userWallets: userWalletsReducer,
    userCategories: userCategoriesReducer,
}

export default combineReducers(reducers)
