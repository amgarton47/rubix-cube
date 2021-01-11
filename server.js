const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 4747;

const app = express();

app.use(express.static(path.join(__dirname , "public")));

app.get("/", (req,res,next) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(PORT, () => {
    console.log(`app is up. listening at http://localhost:${PORT}`)
})