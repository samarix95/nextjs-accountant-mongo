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

// Initial Add Category Dialog state
const initialAddCategoryDialogState = {
    openDialog: false,
    isSpending: false,
    categoryName: '',
    categoryDescription: '',
}

// Add Category Dialog reducer
const addCategoryDialogReducer = (state = initialAddCategoryDialogState, { type, payload }) => {
    switch (type) {
        case types.OPEN_ADD_CATEGORY_DIALOG:
            return {
                openDialog: true,
                isSpending: payload.isSpending,
                categoryName: payload.categoryName,
                categoryDescription: payload.categoryDescription,
            }
        case types.CLOSE_ADD_CATEGORY_DIALOG:
            return initialAddCategoryDialogState
        default:
            return state
    }
}

// Initial Edit Category Dialog state
const initialEditCategoryDialogState = {
    openDialog: false,
    id: null,
    isSpending: false,
    categoryName: '',
    categoryDescription: '',
}

// Edit Category Dialog reducer
const editCategoryDialogReducer = (state = initialEditCategoryDialogState, { type, payload }) => {
    switch (type) {
        case types.OPEN_EDIT_CATEGORY_DIALOG:
            return {
                openDialog: true,
                id: payload.id,
                isSpending: payload.isSpending,
                categoryName: payload.categoryName,
                categoryDescription: payload.categoryDescription,
            }
        case types.CLOSE_EDIT_CATEGORY_DIALOG:
            return initialEditCategoryDialogState
        default:
            return state
    }
}

// Initial Delete Category Dialog state
const initialDeleteCategoryDialogState = {
    openDialog: false,
    id: null,
    name: "",
}

// Delete Category Dialog reducer
const deleteCategoryDialogReducer = (state = initialDeleteCategoryDialogState, { type, payload }) => {
    switch (type) {
        case types.OPEN_DELETE_CATEGORY_DIALOG:
            return {
                openDialog: true,
                id: payload.id,
                name: payload.name,
            }
        case types.CLOSE_DELETE_CATEGORY_DIALOG:
            return initialDeleteCategoryDialogState
        default:
            return state
    }
}

// Initial Edit Budget Dialog state
const editBudgetDialogState = {
    openDialog: false,
    balanceId: null,
}

// Edit Budget Dialog reducer
const editBudgetDialogReducer = (state = editBudgetDialogState, { type, payload }) => {
    switch (type) {
        case types.OPEN_EDIT_BUDGET:
            return {
                openDialog: payload.openDialog,
                balanceId: payload.balanceId,
            }
        case types.CLOSE_EDIT_BUDGET:
            return editBudgetDialogState
        default:
            return state
    }
}

// Initial Edit Budget History Dialog state
const editBudgetHistoryDialogState = {
    openDialog: false,
    balanceId: null,
    historyId: null,
}

// Edit Budget History Dialog reducer
const editBudgetHistoryDialogReducer = (state = editBudgetHistoryDialogState, { type, payload }) => {
    switch (type) {
        case types.OPEN_EDIT_BUDGET_HISTORY:
            return {
                openDialog: payload.openDialog,
                balanceId: payload.balanceId,
                historyId: payload.historyId,
            }
        case types.CLOSE_EDIT_BUDGET_HISTORY:
            return editBudgetHistoryDialogState
        default:
            return state
    }
}

// Initial Edit Budget History Dialog state
const deleteBudgetHistoryDialogState = {
    openDialog: false,
    balanceId: null,
}

// Edit Budget History Dialog reducer
const deleteBudgetHistoryDialogReducer = (state = deleteBudgetHistoryDialogState, { type, payload }) => {
    switch (type) {
        case types.OPEN_DELETE_BUDGET_HISTORY:
            return {
                openDialog: payload.openDialog,
                balanceId: payload.balanceId,
            }
        case types.CLOSE_DELETE_BUDGET_HISTORY:
            return deleteBudgetHistoryDialogState
        default:
            return state
    }
}

// Initial Delete Budget Dialog state
const deleteBudgetDialogState = {
    openDialog: false,
    balanceId: null,
}

// Delete Budget Dialog reducer
const deleteBudgetDialogReducer = (state = deleteBudgetDialogState, { type, payload }) => {
    switch (type) {
        case types.OPEN_DELETE_BUDGET:
            return {
                openDialog: payload.openDialog,
                balanceId: payload.balanceId,
            }
        case types.CLOSE_DELETE_BUDGET:
            return deleteBudgetDialogState
        default:
            return state
    }
}

// Initial User wallets state
const initialUserWalletsState = {
    loading: false,
    selectedId: null,
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
        case types.SET_SELECTED_WALLET:
            return {
                ...state,
                selectedId: payload.id,
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

// Initial User balances state
const initialUserBalancesState = {
    loading: false,
    data: [],
    error: null,
}

// User balances reducer
const userBalancesReducer = (state = initialUserBalancesState, { type, payload }) => {
    switch (type) {
        case types.GET_BALANCE_PENDING:
            return {
                ...state,
                loading: true,
            };
        case types.GET_BALANCE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                data: payload.data,
            };
        case types.GET_BALANCE_ERROR:
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
    addCategoryDialog: addCategoryDialogReducer,
    editCategoryDialog: editCategoryDialogReducer,
    deleteCategoryDialog: deleteCategoryDialogReducer,
    editBudgetDialog: editBudgetDialogReducer,
    deleteBudgetDialog: deleteBudgetDialogReducer,
    editBudgetHistoryDialog: editBudgetHistoryDialogReducer,
    deleteBudgetHistoryDialog: deleteBudgetHistoryDialogReducer,
    userWallets: userWalletsReducer,
    userCategories: userCategoriesReducer,
    userBalances: userBalancesReducer,
}

export default combineReducers(reducers)
