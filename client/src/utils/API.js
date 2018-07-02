import axios from "axios";

export default {
  saveNewGame: function(gameData) {
    return axios.post("/api/games", gameData);
  },
  // Gets all books
  getUserGames: function() {
    return axios.get("/api/games");
  },
  // Gets the book with the given id
  getBook: function(id) {
    return axios.get("/api/books/" + id);
  },
  // Deletes the book with the given id
  deleteBook: function(id) {
    return axios.delete("/api/books/" + id);
  },
  // Saves a book to the database
  saveBook: function(bookData) {
    return axios.post("/api/books", bookData);
  }
};
