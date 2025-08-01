const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 8080

require('./db/mongoose')

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
dotenv.config();
app.use(cookieParser());

const userRouter = require("./routers/user");
const storeRouter = require("./routers/store");
const productRouter = require("./routers/products");
const categoryRouter = require("./routers/category");
const importAndExportRouter = require("./routers/import-export");

app.use(userRouter);
app.use(storeRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(importAndExportRouter);
 
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/front-end/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
    });
}

app.listen(port, () => { console.log("All Done Successfully") });

