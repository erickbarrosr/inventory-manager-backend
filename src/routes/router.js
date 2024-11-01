import express from "express";
import livros from "./livrosRoutes.js";
import autores from "./autoresRoutes.js";
import signUp from "./sign-up-routes.js";

const initializeRoutes = (app) => {
  app.use(express.json(), livros, autores, signUp);
};

export default initializeRoutes;
