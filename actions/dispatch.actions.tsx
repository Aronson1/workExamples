/* eslint-disable */
import { LocationsService } from 'modules/locations/services/locations.service';
import { InfoMessage } from 'modules/messenger/classes/InfoMessage.class';
import { SuccessMessage } from 'modules/messenger/classes/SuccessMessage.class';
import { getActiveShopSelector } from 'modules/shops/selectors/shops.selectors';
import React from 'react';
import { AppMonitoring } from 'services/appMonitoring.service';
import { MonitoringEvent } from 'services/appMonitoring.types';
import { DownloadInvoiceMessage } from '../components/DispatchDetails/DownloadInvoiceMessage/DownloadInvoiceMessage.component';
import { DispatchesService } from '../services/dispatches.service';
import { DispatchLineService } from '../services/dispatchLine.service';
import { DispatchDetails } from '../types/Dispatch.types';
import { ExecuteLinesActions } from './dispatch.actions.types';

const prefix = '[dispatches]';

export const GET_DISPATCH_REQUEST = `${prefix}: GET DISPATCH REQUEST`;
export const GET_DISPATCH_SUCCESS = `${prefix}: GET DISPATCH SUCCESS`;
export const GET_DISPATCH_FAILURE = `${prefix}: GET DISPATCH FAILURE`;

const getDispatch = dispatchId => async (dispatch) => {
    dispatch({
        type: GET_DISPATCH_REQUEST,
    });

    try {
        const data = await DispatchesService.getDispatch(dispatchId);
        const mergedData = await DispatchesService.mergeMissingDetails(data);

        dispatch({
            type: GET_DISPATCH_SUCCESS,
            payload: { data: mergedData },
        });
    } catch (error) {
        dispatch({
            type: GET_DISPATCH_FAILURE,
            error,
        });
    }
};

export const ABORT_DISPATCH_DELIVERY_REQUEST = `${prefix}: ABORT DISPATCH DELIVERY REQUEST`;
export const ABORT_DISPATCH_DELIVERY_SUCCESS = `${prefix}: ABORT DISPATCH DELIVERY SUCCESS`;
export const ABORT_DISPATCH_DELIVERY_FAILURE = `${prefix}: ABORT DISPATCH DELIVERY FAILURE`;

const abortDispatchDelivery = dispatchId => async (dispatch) => {
    dispatch({
        type: ABORT_DISPATCH_DELIVERY_REQUEST,
    });
    AppMonitoring.track(MonitoringEvent.DISPATCH_DELIVERY_ABORTED);

    try {
        const data = await DispatchesService.abortDispatchDelivery(dispatchId);
        const mergedData = await DispatchesService.mergeMissingDetails(data);

        dispatch({
            type: ABORT_DISPATCH_DELIVERY_SUCCESS,
            payload: { data: mergedData },
            message: new InfoMessage((
                <>
                    Anulowano przesyłkę {dispatchId}.<br />
                    Przesłka jest w trakcie anulacji.
                </>
            )),
        });
    } catch (error) {
        dispatch({
            type: ABORT_DISPATCH_DELIVERY_FAILURE,
            error,
        });
    }
};

export const GET_AVAILABLE_LOCATIONS_REQUEST = `${prefix}: GET AVAILABLE LOCATIONS REQUEST`;
export const GET_AVAILABLE_LOCATIONS_SUCCESS = `${prefix}: GET AVAILABLE LOCATIONS SUCCESS`;
export const GET_AVAILABLE_LOCATIONS_FAILURE = `${prefix}: GET AVAILABLE LOCATIONS FAILURE`;

const getLocations = () => async (dispatch, getState) => {
    const state = getState();
    const activeShop = getActiveShopSelector(state);

    dispatch({
        type: GET_AVAILABLE_LOCATIONS_REQUEST,
    });
    AppMonitoring.track(MonitoringEvent.DISPATCH_LOCATION_CHANGED);

    try {
        const response = await LocationsService.getLocations(activeShop.goldId);

        dispatch({
            type: GET_AVAILABLE_LOCATIONS_SUCCESS,
            payload: {
                locations: response.items,
            },
        });
    } catch (error) {
        dispatch({
            type: GET_AVAILABLE_LOCATIONS_FAILURE,
            error,
        });
        throw error;
    }
};

export const CHANGE_DISPATCH_LOCATION_REQUEST = `${prefix}: CHANGE DISPATCH LOCATION REQUEST`;
export const CHANGE_DISPATCH_LOCATION_SUCCESS = `${prefix}: CHANGE DISPATCH LOCATION SUCCESS`;
export const CHANGE_DISPATCH_LOCATION_FAILURE = `${prefix}: CHANGE DISPATCH LOCATION FAILURE`;

const changeDispatchLocation = (dispatchId, newLocation) => async (dispatch) => {
    dispatch({
        type: CHANGE_DISPATCH_LOCATION_REQUEST,
    });

    try {
        const data = await DispatchesService.changeDispatchLocation(dispatchId, newLocation.uuid);
        const mergedData = await DispatchesService.mergeMissingDetails(data);

        dispatch({
            type: CHANGE_DISPATCH_LOCATION_SUCCESS,
            payload: { data: mergedData },
            message: new InfoMessage((
                <>
                    Zmieniono lokalizację przesyłki {dispatchId}.<br />
                    na: {newLocation.name}
                </>
            )),
        });
    } catch (error) {
        dispatch({
            type: CHANGE_DISPATCH_LOCATION_FAILURE,
            error,
        });
        throw error;
    }
};

export const CHANGE_LOCATION_DIALOG_CLEANUP = `${prefix}: CHANGE LOCATION DIALOG CLEANUP`;

const changeLocationDialogCleanup = () => (dispatch) => {
    dispatch({
        type: CHANGE_LOCATION_DIALOG_CLEANUP,
    });
};

export const GENERATE_INVOICE_REQUEST = `${prefix}: GENERATE INVOICE REQUEST`;
export const GENERATE_INVOICE_SUCCESS = `${prefix}: GENERATE INVOICE SUCCESS`;
export const GENERATE_INVOICE_FAILURE = `${prefix}: GENERATE INVOICE FAILURE`;
export const GENERATE_INVOICE_ABORT = `${prefix}: GENERATE INVOICE ABORT`;

const generateInvoice = dispatchId => (dispatch) => {
    dispatch({
        type: GENERATE_INVOICE_REQUEST,
    });

    const invoiceGenerator = DispatchesService.generateInvoice(dispatchId);
    invoiceGenerator.promise
        .then(({ link }) => {
            dispatch({
                type: GENERATE_INVOICE_SUCCESS,
                payload: {
                    invoiceLink: link,
                },
                message: new SuccessMessage(<DownloadInvoiceMessage link={link} />, 10000),
            });
        })
        .catch((error) => {
            if (error.code === 'ABORTED') {
                return;
            }

            dispatch({
                type: GENERATE_INVOICE_FAILURE,
                error,
            });
        });

    const abort = () => {
        invoiceGenerator.abort();
        dispatch({
            type: GENERATE_INVOICE_ABORT,
            message: new InfoMessage('Anulowano generowanie faktury.'),
        });
    };

    return {
        promise: invoiceGenerator.promise,
        abort,
    };
};

export const RESET_PIN_REQUEST = `${prefix}: RESET PIN REQUEST`;
export const RESET_PIN_SUCCESS = `${prefix}: RESET PIN SUCCESS`;
export const RESET_PIN_FAILURE = `${prefix}: RESET PIN FAILURE`;

const resetPin = dispatchId => async (dispatch) => {
    dispatch({
        type: RESET_PIN_REQUEST,
    });
    AppMonitoring.track(MonitoringEvent.DISPATCH_PIN_RESET);

    try {
        await DispatchesService.resetPin(dispatchId);

        dispatch({
            type: RESET_PIN_SUCCESS,
            message: new InfoMessage('Nowy PIN został wysłany'),
        });
    } catch (error) {
        dispatch({
            type: RESET_PIN_FAILURE,
            error,
        });
    }
};

export enum ExecuteLinesActionsResponse {
    REQUEST,
    SUCCESS,
    FAILURE,
}

const executeLinesActions: ExecuteLinesActions = (dispatchId, actions, options) => (dispatch): Promise<DispatchDetails> => {
    dispatch({
        type: ExecuteLinesActionsResponse.REQUEST,
    });
    AppMonitoring.track(MonitoringEvent.DISPATCH_DETAILS_LINE_ACTION_EXECUTED);

    return DispatchLineService.executeActions(dispatchId, actions, options)
        .then(async (response) => {
            const mergedData = await DispatchesService.mergeMissingDetails(response);

            dispatch({
                type: ExecuteLinesActionsResponse.SUCCESS,
                payload: {
                    data: mergedData,
                },
                message: new SuccessMessage('Powodzenie wykonania akcji.'),
            });
            return mergedData;
        })
        .catch((error) => {
            dispatch({
                type: ExecuteLinesActionsResponse.FAILURE,
                error,
            });
            throw error;
        });
};

export const GET_CORRECTION_INVOICES_REQUEST = `${prefix}: GET CORRECTION INVOICES REQUEST`;
export const GET_CORRECTION_INVOICES_DATA_RECEIVED = `${prefix}: GET CORRECTION INVOICES DATA RECEIVED`;
export const GET_CORRECTION_INVOICES_SUCCESS = `${prefix}: GET CORRECTION INVOICES SUCCESS`;
export const GET_CORRECTION_INVOICES_FAILURE = `${prefix}: GET CORRECTION INVOICES FAILURE`;

const getCorrectionInvoices = (dispatchData: DispatchDetails) => (dispatch) => {
    dispatch({
        type: GET_CORRECTION_INVOICES_REQUEST,
    });

    const onDataReceived = (data) => {
        dispatch({
            type: GET_CORRECTION_INVOICES_DATA_RECEIVED,
            payload: {
                data,
            },
        });
    };

    const ret = DispatchesService.getAllGeneratedCorrections(dispatchData, onDataReceived);

    ret.promise
        .then(() => {
            dispatch({
                type: GET_CORRECTION_INVOICES_SUCCESS,
            });
        })
        .catch(() => {
            dispatch({
                type: GET_CORRECTION_INVOICES_FAILURE,
                error: new Error('Nie udało się wczytać informacji o korektach.'),
            });
        });

    return {
        abort: ret.abort,
    };
};

export const GET_DISPATCH_HISTORY_REQUEST = `${prefix}: GET DISPATCH HISTORY REQUEST`;
export const GET_DISPATCH_HISTORY_SUCCESS = `${prefix}: GET DISPATCH HISTORY SUCCESS`;
export const GET_DISPATCH_HISTORY_FAILURE = `${prefix}: GET DISPATCH HISTORY FAILURE`;

const getDispatchHistory = (dispatchId: DispatchDetails['dispatchId']) => async (dispatch) =>  {
    dispatch({
        type: GET_DISPATCH_HISTORY_REQUEST,
    });

    try {
        const data = await DispatchesService.getDispatchHistory(dispatchId);
        
        dispatch({
            type:  GET_DISPATCH_HISTORY_SUCCESS,
            payload: { data },
        });
    } catch (error) {
        dispatch({
            type: GET_DISPATCH_HISTORY_FAILURE,
            error: new Error('Nie udało się wczytać historii zdarzeń.'),
        });
    }
}

export const PUT_LP_AND_LINEID_PAIRS = `${prefix} PUT LP AND LINEID PAIRS`;

const putLpAndLineIdPairs = (lpLineIdPairs) => (dispatch) => {
    dispatch({
        type: PUT_LP_AND_LINEID_PAIRS,
        payload: lpLineIdPairs,
    });
}

export {
    getDispatch,
    abortDispatchDelivery,
    getLocations,
    changeDispatchLocation,
    changeLocationDialogCleanup,
    generateInvoice,
    resetPin,
    executeLinesActions,
    getCorrectionInvoices,
    getDispatchHistory,
    putLpAndLineIdPairs,
};
