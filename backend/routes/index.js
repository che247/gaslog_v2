import express from "express";
const indexRouter = express.Router();

/* GET home page. */
// router.get("/", function (req, res, next) {
// 	res.render("index", { title: "Express" });
// });

indexRouter.get("/api/test", (req, res, next) => {
	res.send("hellooooooooooooo");
});

export default indexRouter;
