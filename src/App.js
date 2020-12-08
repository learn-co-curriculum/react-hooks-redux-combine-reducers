import React from "react";
import AuthorInput from "./components/AuthorInput";
import Authors from "./components/Authors";
import BookInput from "./components/BookInput";
import Books from "./components/Books";

function App() {
  return (
    <div>
      <div>
        <h2>Authors</h2>
        <AuthorInput />
        <Authors />
      </div>
      <div>
        <h2>Book</h2>
        <BookInput />
        <Books />
      </div>
    </div>
  );
}

export default App;
