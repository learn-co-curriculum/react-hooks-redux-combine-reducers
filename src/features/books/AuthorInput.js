import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { useDispatch } from "react-redux";
import { addAuthor } from "./booksSlice";

function AuthorInput() {
  const [authorName, setAuthorName] = useState("");
  const dispatch = useDispatch();

  function handleAuthorChange(event) {
    setAuthorName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const author = { authorName, id: uuid() };
    dispatch(addAuthor(author));
    setAuthorName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <input
          type="text"
          onChange={handleAuthorChange}
          name="authorName"
          value={authorName}
          placeholder="author name"
        />
      </p>
      <input type="submit" />
    </form>
  );
}

export default AuthorInput;
