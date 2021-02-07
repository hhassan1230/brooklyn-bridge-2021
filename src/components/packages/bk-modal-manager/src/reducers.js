import { MODAL_VERTICAL_GUTTER } from './constants';

const OPEN_MODAL = 'OPEN_MODAL';
const UPDATE_MODAL = 'UPDATE_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';

const initialState = {
    type: null,
    id: null,
    title: null,
    component: null,
    moduleName: null,
    contentProps: {},
    anchor: null,
    anchorElementID: null, // provide anchorElementID or anchor not both.
    tooltipAlignment: 'center',
    placement: '',
    section: null,
    logo: null,
    icon: null,
    width: null,
    height: null,
    showBackdrop: false,
    showHeader: true,
    showCloseBtn: true,
    closeOnEsc: true,
    closeOnClickOutside: true,
    headerButtons: [],
    anchorOffset: MODAL_VERTICAL_GUTTER,
    additionalClassNames: '',
    modalHeightAutoShrink: false,
};

export const closeModal = (payload) => ({
    type: CLOSE_MODAL,
    payload,
});

export const openModal = (payload) => ({
    type: OPEN_MODAL,
    payload,
});

export const updateModal = (payload) => ({
    type: UPDATE_MODAL,
    payload,
});

const modalManager = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_MODAL: {
            const payload = action.payload;
            return {
                ...initialState,
                ...payload,
            };
        }
        case UPDATE_MODAL: {
            const payload = action.payload;
            return {
                ...state,
                ...payload,
            };
        }
        case CLOSE_MODAL: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};

export const reducers = { modalManager };
