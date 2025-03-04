import { combineReducers } from "redux";
import CommonReducer from "../slices/CommonSlice";

export default combineReducers({
  common: CommonReducer
});
