import express from "express";
import epey from "./epey";

const router = express.Router();

export default (): express.Router => {
  epey(router);
  return router;
};
