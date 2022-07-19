import express from "express";
var router = express.Router();

router
  .route("/")
  .options((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "oaxaca.gob.mx");
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    response.setHeader("Access-Control-Allow-Methods", "POST, GET");
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.sendStatus(200);
  })
  .get((request, response, next) => {
    let { INFO } = require("../configs/info");
    response.render("index", { ...INFO });
  });

export default router;
