# Redux Combine Reducers

## Objectives

1. Write action creators and reducers to modify application state
2. Build Redux's `combineReducers()` function
3. Use the `combineReducers()` function to delegate different pieces of state to each reducer

## Introduction

So far we have been using a single reducer to return a new state when an action
is dispatched. This works great for a small application where we only need our
reducer to manage the state of one resource. However, as you will see, when
working with multiple resources, placing all of this logic in one reducer
function can quickly become unwieldy.

Enter `combineReducers()` to save the day! In this lab, we'll see how Redux's
`combineReducers()` function lets us delegate different pieces of state to
separate reducer functions.

We'll do this in the context of a book application that we'll use to keep track
of programming books that we've read.

We want our app to do two things:

1. Keep track of all the books we've read: title, author, description.
2. Keep track of the authors who wrote these books.

#### Determine Application State Structure

Our app will need a state object that stores two types of information:

1. All our books, in an array
2. Our authors, also in an array

Each of these types of information — all our books, and the authors
— should be represented on our store's state object. We want to think of
our store's state structure as a database. We will represent this as a belongs
to/has many relationship, in that a book belongs to an author and an author has
many books. So this means each author would have its own id, and each book would
have an authorId as a foreign key.

With that, we can set the application state as:

```js
const initialState = {
  authors: [], //array of authors
  books: [], // array of books
};
```

So our state object will have two top-level keys, each pointing to an array. For
now, let's write a single reducer to manage both of these resources.

```js
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
```

This is the current set up in `src/features/books/booksSlice.js`, and it
works. You can see, however, by working with just two resources, the size of our
reducer increased significantly. Moreover, by placing each resource in the same
reducer, we are coupling these resources together, where we would prefer to
maintain their separation. By creating separate reducers for each resource in an
application, we can keep our code organized as our applications get more
complicated.

## Refactor by using combineReducers

The `combineReducers()` function allows us to write two or more separate
reducers, then pass each reducer to the `combineReducers()` function to produce
the reducer we wrote above. Then we pass that combined reducer to the store in
`src/index.js`. Let's write some code, and then we'll walk through it below.

First, let's reorganize our code:

```
src
├── features
│   ├── authors
│   │   ├── AuthorInput.js
│   │   ├── Authors.js
│   │   └── authorSlice.js
│   └── books
│       ├── BookInput.js
│       ├── Books.js
│       └── bookSlice.js
└── reducers.js
```

Start by creating separate folders for the code related to each 'domain' of our
app: authors and books. Move your component code into the appropriate folders,
and update your imports in `App.js`. Then, create a new `authorSlice.js` file.
Update the `authorSlice.js` file with this code:

```js
// ./src/features/authors/authorSlice.js

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

// Reducers
const initialState = [];

export default function authorsReducer(state = initialState, action) {
  switch (action.type) {
    case "authors/add":
      return [...state, action.payload];

    case "authors/remove":
      return state.filter((author) => author.id !== action.payload);

    default:
      return state;
  }
}
```

Then, update the `bookSlice.js` file like this:

```js
// ./src/features/books/bookSlice.js

// Action Creators
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
const initialState = [];

export default function booksReducer(state = initialState, action) {
  switch (action.type) {
    case "books/add":
      return [...state, action.payload];

    case "books/remove":
      return state.filter((book) => book.id !== action.payload);

    default:
      return state;
  }
}
```

Also, fix the imports for the action creators in your components.

Finally, create a new file for our combined reducers:

```js
// src/reducers.js
import { combineReducers } from "redux";
import authorsReducer from "./features/authors/authorsSlice";
import booksReducer from "./features/books/booksSlice";

const rootReducer = combineReducers({
  authors: authorsReducer,
  books: booksReducer,
});

export default rootReducer;
```

There's a lot of code there, so let's unpack it a bit:

```javascript
import { combineReducers } from "redux";
import authorsReducer from "./features/authors/authorsSlice";
import booksReducer from "./features/books/booksSlice";

const rootReducer = combineReducers({
  authors: authorsReducer,
  books: booksReducer,
});

export default rootReducer;
```

Through `combineReducer`, we're telling **Redux** to produce a reducer which
will return a state that has both a key of `books` with a value equal to the
return value of the `booksReducer()` _and_ a key of `authors` with a value
equal to the return value of the `authorsReducer()`. Now if you look at the
`booksReducer()` and the `authorsReducer()` you will see that each returns a
default state of an empty array.

We'll also need to import our new root reducer in the `src/index.js` file:

```js
import { createStore } from "redux";
import rootReducer from "./reducer";

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

By passing our `rootReducer` to the `createStore` method, the application
maintains its initial state of `{ books: [], authors: [] }`, just as it did when
we had one reducer. From the application's perspective nothing has changed.

#### Examining Our New Reducers

Now if we examine the `authorsReducer()`, notice that this reducer only
concerns itself with its own _slice_ of the state. This makes sense. Remember that
ultimately the array that the `authorsReducer()` returns will be the value to
the key of authors. Similarly the `authorsReducer()` only receives as its
state argument the value of `state.authors`, in other words the authors array.

So examining the `authorsReducer()`, we see that we no longer retrieve the
list of authors with a call to `state.authors`, but can access the list of
authors simply by calling `state`.

```javascript
const initialState = [];

export default function authorsReducer(state = initialState, action) {
    case "authors/add":
      return [...state, action.payload];

    case "authors/remove":
      return state.filter(
        (author) => author.id !== action.payload
      );

    default:
      return state;
  }
}
```

#### Dispatching Actions

The `combineReducer()` function returns to us one large reducer that looks like
the following:

```javascript
const initialState = {
  authors: [], //array of authors
  books: [], // array of books
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "books/add":
      return; // ...
    case "books/remove":
      const newBooks = state.books.filter((book) => book.id !== action.payload);
      return; // ...
    // ...
  }
}
```

Because of this, we can dispatch actions the same way we always did.
`store.dispatch({ type: 'books/add', { title: 'Snow Crash', author: 'Neal Stephenson' } });`
will hit our switch statement in the reducer and add a new author. One thing to
note, is that if you want to have more than one reducer respond to the same
action, you can.

For example, in our application, when a user inputs information about a book,
the user _also_ inputs the author's name. It would be handy if, when a user
submits a book with an author, that author is also added to our author array.

The action dispatched doesn't change:
`store.dispatch({ type: 'books/add', { title: 'Snow Crash', author: 'Neal Stephenson' } });`.
Our `booksReducer` can stay the same for now:

```javascript
const initialState = [];

export default function booksReducer(state = initialState, action) {
  switch (action.type) {
    case "books/add":
      return [...state, action.payload];

    case "books/remove":
      return state.filter((book) => book.id !== action.payload);

    default:
      return state;
  }
}
```

However, in `authorsReducer`, we can _also_ include a switch case for
`"books/add"`:

```js
import { v4 as uuid } from 'uuid';

const initialState = [];

export default function authorsReducer(state = initialState, action) {
    case "authors/add":
      return [...state, action.payload];

    case "authors/remove":
      return state.filter(
        (author) => author.id !== action.payload
      );

    case "books/add":
      const existingAuthor = state.find(
        (author) => author.authorName === action.payload.authorName
      );
      if (existingAuthor) {
        return state;
      } else {
        return [...state, { authorName: action.payload.authorName, id: uuid() }];
      }

    default:
      return state;
  }
}
```

In the new `"books/add"` case, we're checking to see if an `authorName` matches
with the name dispatched from the `BookInput` component. If the name already
exists, state is returned unchanged. If the name is not present, it is added to
the author array. Use the example above to modify the `authorReducer` reducer
and you can see the effect. We have two separate forms, one for adding just
authors, and one that adds books _and_ authors.

**Note:** We're using a useful package, `uuid`, to handle unique ID generation.
With this refactor, since we are creating an author ID from within the reducer
instead of in `AuthorInput.js`, we need to import it here as well.

## Conclusion

In React/Redux apps where we're using and storing many resources in our store,
keeping reducers separated helps us organize code and separate concerns. Actions
can cause multiple reducers to modify their own state, but we can still keep all
modifications to a _particular_ resource within its own separate file.

#### Resources

- [Combining Reducers](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#combining-reducers)
- [Implementing Combine Reducers from Scratch](https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch)
