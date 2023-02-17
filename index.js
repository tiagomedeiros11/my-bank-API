//importing project libraries and files
import express from "express";
import accountsRouter from "./routes/accounts.js";
import {promises as fs} from "fs";


//declaretions this variables and formats of api files
const app = express();
app.use(express.json());
const {writeFile, readFile} = fs;

//path for the routing files
app.use("/accounts", accountsRouter)





//
app.listen(3000,async ()=>{
    //try catch que caso o arquivo exista ele escreve, do contrario ele cria o arquivo escrevendo os dados
    try {
        await readFile("accounts.json")
        console.log("Api started");
    } catch (error) {
        //variavel que cria as contas no arquivo
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        writeFile("accounts.json", JSON.stringify(initialJson)).then(()=>{
            console.log("Created file and API started");
        }).catch(err => {console.error(err)});
    }
});