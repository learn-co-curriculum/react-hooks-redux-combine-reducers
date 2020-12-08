import { combineReducers } from "redux";
import authorsReducer from "./features/authors/authorsSlice";
import booksReducer from "./features/books/booksSlice";

const rootReducer = combineReducers({
  authors: authorsReducer,
  books: booksReducer,
});

export default rootReducer;
