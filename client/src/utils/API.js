import axios from "axios";

export default {
  saveNewGame: function(gameData) {
    return axios.post("/api/games", gameData);
  },
  // Gets all books
  getDefaultGames: function() {
    return axios.get("/api/games/seed");
  },

  saveClones: function(dataObj) {
    return axios.post("/api/games/seed", dataObj);
  },

  getUser: function(username) {
    return axios.get("/api/users/" + username);
  },

  createUser: function(dataObj) {
    return axios.post("/api/users", dataObj);
  },

  updateUserAsSeeded: function(dataObj) {
    return axios.put("/api/users", dataObj);
  },

  getGamesByUser: function(dataObj) {
    return axios.post("/api/games/user", dataObj);
  },
  searchGamesByName: function(searchTerm) {
    return axios.get("/api/games/search/" + searchTerm);
  },
  getGame: function(id) {
    return axios.get("api/games/" + id);
  },
  deleteGame: function(id, user) {
    return axios.delete("api/games/" + id + "/" + user);
  },
  togglePublic: function(id) {
    return axios.put("api/games", id);
  },
  deleteVersion: function(dataObj) {
    return axios.post("/api/games/versions", dataObj);
  },
  // Saves a book to the database
  pushVersion: function(gameData) {
    console.log(gameData);
    return axios.put("/api/games/versions", gameData);
  },
  // sortVersions: function(id) {
  //   return axios.get("/api/games/versions/" + id);
  // }
};
