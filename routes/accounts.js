import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();


router.post('/', (req, res) => {
    let account = req.body;


    res.end();
});


export default router;
