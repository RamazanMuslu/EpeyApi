import express from "express";
import { search, info, images, getInfo } from "../controllers/epey";

export default (router: express.Router) => {
  router.get("/epey/search", search);
  router.get("/epey/searchInfo", getInfo);
  router.get("/epey/info/:id", info);
  router.get("/epey/images/:id", images);
};
