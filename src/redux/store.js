 
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import content from './reducers/contentReducer';
// import { create } from 'domain';


const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
    content
});

const store = createStore(
    reducers, 
    initialState, 
    compose(
        applyMiddleware(...middleware),
        //  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
         )
);

export default store;