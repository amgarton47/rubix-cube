const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 4747;
const favicon = require('serve-favicon');

const app = express();

app.use(favicon(path.join(__dirname,'public','favicon.ico')));

app.use(express.static(path.join(__dirname , "public")));

app.get("*", (req,res,next) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

// error handling endware
app.use(function (err, req, res, next) {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });

app.listen(PORT, () => {
    console.log(`app is up. listening at http://localhost:${PORT}`)
})