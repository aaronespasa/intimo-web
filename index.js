const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    fs.readFile("./index.html", (err, data) => {
        if(err) throw err;
        return res.send(data);
    });
    res.close();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});