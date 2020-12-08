// Action Creators
export const addAuthor = (author) => {
  return {
    type: "authors/add",
    payload: author,
  };
};

export const removeAuthor = (id) => {
  return {
    type: "authors/remove",
    payload: id,
  };
};

export const addBook = (book) => {
  return {
    type: "books/add",
    payload: book,
  };
};

export const removeBook = (id) => {
  return {
    type: "books/remove",
    payload: id,
  };
};

// Reducers
const initialState = {
  authors: [], //array of authors
  books: [], // array of books
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "books/add":
      return {
        ...state,
        books: [...state.books, action.payload],
      };

    case "books/remove":
      const newBooks = state.books.filter((book) => book.id !== action.payload);
      return {
        ...state,
        books: newBooks,
      };

    case "authors/add":
      return {
        ...state,
        authors: [...state.authors, action.payload],
      };

    case "authors/remove":
      const newAuthors = state.authors.filter(
        (author) => author.id !== action.payload
      );
      return {
        ...state,
        authors: newAuthors,
      };

    default:
      return state;
  }
}
