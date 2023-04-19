const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const targetISBN = parseInt(req.params.isbn);
  const targetBook = books[targetISBN];
  if (!targetBook) {
    return res.status(404).json({ message: "ISBN not found." });
  } else {
    return res.status(200).json(targetBook);
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // get array of matching book objects
  const matchingBooks = Object.values(books).filter(
    (book) => book.author === req.params.author
  );
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify({ matchingBooks }, null, 4));
  } else {
    return res.status(404).json({ message: "No books by that author." });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const matchingTitle = Object.values(books).filter(
    (book) => book.title === req.params.title
  )[0];
  if (matchingTitle) {
    return res.status(200).json(matchingTitle);
  } else {
    return res.status(404).json({ message: "Title not found." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
