import axios from "axios";

export default {
  saveNewGame: function(gameData) {
    return axios.post("/api/games", gameData);
  },
  getDefaultGames: function(name) {
    return axios.get("/api/games/seed/" + name);
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
  addSearchTag: function(dataObj) {
    return axios.put("api/games/search/", dataObj);
  },
  removeSearchTag: function(dataObj) {
    return axios.post("api/games/search/", dataObj);
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
  pushVersion: function(gameData) {
    console.log(gameData);
    return axios.put("/api/games/versions", gameData);
  },
};
