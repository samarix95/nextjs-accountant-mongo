import { combineReducers } from 'redux';

import * as types from './types';

// COUNTER REDUCER
const counterReducer = (state = 0, { type }) => {
    switch (type) {
        case types.INCREMENT:
            return state + 1
        case types.DECREMENT:
            return state - 1
        case types.RESET:
            return 0
        default:
            return state
    }
}

// INITIAL TIMER STATE
const initialTimerState = {
    lastUpdate: 0,
    light: false,
}

// TIMER REDUCER
const timerReducer = (state = initialTimerState, { type, payload }) => {
    switch (type) {
        case types.TICK:
            return {
                lastUpdate: payload.ts,
                light: !!payload.light,
            }
        default:
            return state
    }
}

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

// COMBINED REDUCERS
const reducers = {
    counter: counterReducer,
    timer: timerReducer,
    snackbar: snackbarReducer,
    userWallets: userWalletsReducer,
}

export default combineReducers(reducers)