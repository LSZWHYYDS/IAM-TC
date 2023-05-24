/*jshint esversion: 6 */
import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import { asyncSessionStorage } from "redux-persist/storages";
import thunk from "redux-thunk";
import rootReducer from "../reducers/index";

const enhancer = compose(applyMiddleware(thunk), autoRehydrate());
const mainStore = createStore(rootReducer, enhancer);
persistStore(mainStore, {
    storage: asyncSessionStorage
});

export default mainStore;