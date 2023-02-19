import express from "express";
import { promises as fs, read } from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();

// post request que insere dados ao arquivo accounts.json
router.post('/', async (req, res) => {
    try {
        let account = req.body;
        //variavel que realiza a leitura do arquivo accounts.json
        const data = JSON.parse(await readFile("accounts.json"));
        // atualiza o valor da variavel (data), passando o id como primeiro item do objeto e em seguida incrementa o id+1, e traz os valores restantes do objeto.
        account = { id: data.nextId++, ...account };
        //atualiza o array de cadastros (accounts), inserindo um novo cadastro
        data.accounts.push(account);
        //escreve no arquivo(accounts.json) a atulização da variavel (data)
        await writeFile("accounts.json", JSON.stringify(data,null, 2));
        //retorna para o usuario os valores da nova conta cadastrada
        res.send(account);
    } catch (error) {
        res.status(400).send({error: error.message})
    }
});


export default router;
