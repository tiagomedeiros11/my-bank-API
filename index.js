//importing project libraries and files
import express from "express";
import winston from "winston";
import accountsRouter from "./routes/accounts.js";
import {promises as fs} from "fs";


//declaretions this variables and formats of api files
const app = express();
const {combine, timestamp, label, printf} = winston.format;
const myFortmat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "my-bank-api.log", level: "info" })
    ],
    format: combine(
        label({ label: "my-bank-api" }),
        timestamp(),
        myFortmat
        )
});
app.use(express.json());
const {writeFile, readFile} = fs;

//path for the routing files
app.use("/accounts", accountsRouter)




//
app.listen(3000,async ()=>{
    //try catch que caso o arquivo exista ele escreve, do contrario ele cria o arquivo escrevendo os dados
    try {
        await readFile("accounts.json")
        logger.info("API started")  
    } catch (error) {
        //variavel que cria as contas no arquivo
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        writeFile("accounts.json", JSON.stringify(initialJson)).then(()=>{
            logger.info("Created file and API started")
        }).catch(err => {logger.error(err)});
    }
});