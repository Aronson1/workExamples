import { fromJS, List } from 'immutable';
import * as dispatchActions from '../actions/dispatch.actions';

const initialState = fromJS({
    data: null,
    changingStatus: false,
    generatingInvoice: false,
    invoiceLink: '',
    changeLocationItems: List(),
    correctionInvoices: List(),
    loadingCorrectionInvoices: false,
    loadingDispatchHistory: false,
    dispatchHistory: List(),
    lpLineIdPairs: List(),
});

const dispatchReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case dispatchActions.GET_DISPATCH_REQUEST:
            return state.merge({
                data: null,
                invoiceLink: '',
            });
        case dispatchActions.GET_DISPATCH_SUCCESS:
            return state.merge({
                data: payload.data,
            });
        case dispatchActions.ABORT_DISPATCH_DELIVERY_REQUEST:
        case dispatchActions.CHANGE_DISPATCH_LOCATION_REQUEST:
        case dispatchActions.RESET_PIN_REQUEST:
        case dispatchActions.ExecuteLinesActionsResponse.REQUEST:
            return state.merge({
                changingStatus: true,
            });
        case dispatchActions.ABORT_DISPATCH_DELIVERY_SUCCESS:
        case dispatchActions.CHANGE_DISPATCH_LOCATION_SUCCESS:
        case dispatchActions.ExecuteLinesActionsResponse.SUCCESS:
            return state.merge({
                data: payload.data,
                changingStatus: false,
            });
        case dispatchActions.ABORT_DISPATCH_DELIVERY_FAILURE:
        case dispatchActions.CHANGE_DISPATCH_LOCATION_FAILURE:
        case dispatchActions.RESET_PIN_FAILURE:
        case dispatchActions.RESET_PIN_SUCCESS:
        case dispatchActions.ExecuteLinesActionsResponse.FAILURE:
            return state.merge({
                changingStatus: false,
            });
        case dispatchActions.GET_AVAILABLE_LOCATIONS_SUCCESS:
            return state.merge({
                changeLocationItems: List(payload.locations),
            });
        case dispatchActions.GET_AVAILABLE_LOCATIONS_FAILURE:
            return state.merge({
                changeLocationItems: List(),
            });
        case dispatchActions.GENERATE_INVOICE_REQUEST:
            return state.merge({
                generatingInvoice: true,
            });
        case dispatchActions.GENERATE_INVOICE_SUCCESS:
            return state.merge({
                generatingInvoice: false,
                invoiceLink: payload.invoiceLink,
            });
        case dispatchActions.GENERATE_INVOICE_FAILURE:
            return state.merge({
                generatingInvoice: false,
            });
        case dispatchActions.GENERATE_INVOICE_ABORT:
            return state.merge({
                generatingInvoice: false,
                invoiceLink: '',
            });
        case dispatchActions.GET_CORRECTION_INVOICES_REQUEST:
            return state.merge({
                correctionInvoices: List(),
                loadingCorrectionInvoices: true,
            });
        case dispatchActions.GET_CORRECTION_INVOICES_DATA_RECEIVED:
            return state.merge({
                correctionInvoices: List(payload.data),
            });
        case dispatchActions.GET_CORRECTION_INVOICES_SUCCESS:
        case dispatchActions.GET_CORRECTION_INVOICES_FAILURE:
            return state.merge({
                loadingCorrectionInvoices: false,
            });
        case dispatchActions.GET_DISPATCH_HISTORY_REQUEST:
            return state.merge({
                loadingDispatchHistory: true,
            });
        case dispatchActions.GET_DISPATCH_HISTORY_SUCCESS:
            return state.merge({
                dispatchHistory: payload.data.entries,
                loadingDispatchHistory: false,
            });
        case dispatchActions.GET_DISPATCH_HISTORY_FAILURE:
            return state.merge({
                dispatchHistory: List(),
                loadingDispatchHistory: false,
            });
        case dispatchActions.PUT_LP_AND_LINEID_PAIRS:
            return state.merge({
                lpLineIdPairs: List(payload),
            });
        default:
            return state;
    }
};

export { dispatchReducer };
