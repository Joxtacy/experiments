import express from "express";

const app = express();
const port = 3004;

app.get("/", (req: any, res: any) => {
	console.log(req.query);
	if (req.query.herp === undefined) {
		res.send("Hello World!");
	} else {
		res.send(`Hello ${req.query.herp}!`);
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
