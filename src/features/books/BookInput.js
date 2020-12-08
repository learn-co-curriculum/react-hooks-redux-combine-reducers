import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { addBook } from "./booksSlice";

function BookInput() {
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
  });

  const dispatch = useDispatch();

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    // use the uuid library to generate a unique ID for our books
    const book = { ...formData, id: uuid() };

    dispatch(addBook(book));
    setFormData({
      title: "",
      authorName: "",
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <input
          type="text"
          onChange={handleChange}
          name="title"
          value={formData.title}
          placeholder="book title"
        />
      </p>
      <p>
        <input
          type="text"
          onChange={handleChange}
          name="authorName"
          value={formData.authorName}
          placeholder="author name"
        />
      </p>
      <input type="submit" />
    </form>
  );
}

export default BookInput;
