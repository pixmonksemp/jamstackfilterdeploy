import axios from 'axios';
import {COMMON_URL} from '../common/common-api-constants';
import store from "../../store/index";
import { ToastContainer, toast } from 'react-toastify';


export const GET_FILTER_DATA = 'GET_FILTER_DATA';
export const GET_FILTER_DATA_SUCCESS = 'GET_FILTER_DATA_SUCCESS';
export const GET_FILTER_DATA_FAILURE = 'GET_FILTER_DATA_FAILURE';

export const GET_COMPETITON_DATA = 'GET_COMPETITON_DATA';
export const GET_COMPETITON_DATA_SUCCESS = 'GET_COMPETITON_DATA_SUCCESS';
export const GET_COMPETITON_DATA_FAILURE = 'GET_COMPETITON_DATA_FAILURE';

export const CLEAR_COMPETITOR_REDUCER_DATA = 'CLEAR_COMPETITOR_REDUCER_DATA';
export const CLEAR_FILTER_REDUCER_DATA = 'CLEAR_FILTER_REDUCER_DATA';

export const GET_CITY_PINCODE = 'GET_CITY_PINCODE';
export const GET_CITY_PINCODE_SUCCESS = 'GET_CITY_PINCODE_SUCCESS';
export const GET_CITY_PINCODE_FAILURE = 'GET_CITY_PINCODE_FAILURE';


export function clearCompetitorReducerData() {
    return {
        type: CLEAR_COMPETITOR_REDUCER_DATA,
        payload: []
    };
}

export function clearFilterReducerData() {
    return {
        type: CLEAR_FILTER_REDUCER_DATA,
        payload: []
    };
}

export function getFilterData(data) {
    const request = axios({
        method: 'get',
        url: COMMON_URL+`multirequestfeceted/${data}`,
    });

    return {
        type: GET_FILTER_DATA,
        payload: request
    };
}

export function getFilterDataSuccess(data) {
    return {
        type: GET_FILTER_DATA_SUCCESS,
        payload: data
    };
}

export function getFilterDataFailure(error) {
    return {
        type: GET_FILTER_DATA_FAILURE,
        payload: error
    };
}

///////////////competitor

export function getCompetitorData(data) {
    const request = axios({
        method: 'post',
        data: data,
        url: COMMON_URL+`competitor`,
    });

    return {
        type: GET_COMPETITON_DATA,
        payload: request
    };
}

export function getCompetitorDataSuccess(data) {
    return {
        type: GET_COMPETITON_DATA_SUCCESS,
        payload: data
    };
}

export function getCompetitorDataFailure(error) {
    return {
        type: GET_COMPETITON_DATA_FAILURE,
        payload: error
    };
}