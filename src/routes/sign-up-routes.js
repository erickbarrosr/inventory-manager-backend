import express from "express";
import SignUpController from "../controllers/sign-up-controller.js";

const routes = express.Router();

routes.post("/sign-up", SignUpController.signUp);

export default routes;
