const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

const getAllBooks = () => {
  return books;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Missing username or password" });
  } else if (doesExist(username)) {
    return res.status(404).json({ message: "user already exists." });
  } else {
    users.push({ username: username, password: password });
    return res
      .status(200)
      .json({ message: "User successfully registered.  Please login." });
  }
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const targetISBN = parseInt(req.params.isbn);
  const targetBook = await books[targetISBN];
  if (!targetBook) {
    return res.status(404).json({ message: "ISBN not found." });
  } else {
    return res.status(200).json(targetBook);
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  // get array of matching book objects
  const matchingBooks = Object.values(await books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books by that author." });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const matchingTitle = Object.values(await books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  )[0];
  if (matchingTitle) {
    return res.status(200).json(matchingTitle);
  } else {
    return res.status(404).json({ message: "Title not found." });
  }
});

//  Get book review
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;

  new Promise((resolve, reject) => {
      let booksByTitle = Object.values(books).filter(book => book.title === title);
      
      if (booksByTitle.length > 0) {
          resolve(booksByTitle);
      } else {
          reject("No books found with this title");
      }
  })
  .then(books => res.json(books))
  .catch(error => res.status(404).json({ message: error }));
});


public_users.post('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { username, review } = req.body;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }
  if (!username || !review) {
      return res.status(400).json({ message: "Username and review are required" });
  }

  books[isbn].reviews[username] = review; // Add or update review
  return res.json({ message: "Review added/updated successfully", book: books[isbn] });
});

public_users.delete('/review/:isbn/:username', (req, res) => {
  const { isbn, username } = req.params;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username]; // Remove the review
  return res.json({ message: "Review deleted successfully", book: books[isbn] });
});


module.exports.general = public_users;
