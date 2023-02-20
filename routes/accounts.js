import express from "express";
import { promises as fs, read } from "fs";
import { compileFunction } from "vm";

const { readFile, writeFile } = fs;
const router = express.Router();

// post request que insere dados ao arquivo accounts.json
router.post('/', async (req, res) => {
    try {
        let account = req.body;
        //variavel que realiza a leitura do arquivo accounts.json no formato JSON
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

router.get('/', async (req, res) => {
    try {
        //variavel que realiza a leitura do arquivo accounts.json no formato JSON
        const data = JSON.parse(await readFile("accounts.json"));
        //deleta o nextId da variavel (data)
        delete data.nextId;
        //retorna para o usuario os valores das contas cadastradas
        res.send(data);
    } catch (error) {
        res.status(400).send({error: error.message})
    }
});

//get request que busca a conta por id
router.get('/:id', async (req, res) => {
    try {
        //variavel que realiza a leitura do arquivo accounts.json no formato JSON
        const data = JSON.parse(await readFile("accounts.json"));
        //variavel que tras do data as contas por id informado no req.params
        const contaIdividual = data.accounts.find(contaIdividual => contaIdividual.id === parseInt(req.params.id));
        //deleta a informação do id do cliente trazendo somente o nome e o valor da conta
        delete contaIdividual.id;
        //retorna para o usuario o nome e o valor da conta solicitada
        res.send(contaIdividual);
    } catch (error) {
        res.status(400).send({error: error.message})
    }
});


router.delete('/:id', async (req, res) => {
    try {
        //variavel que realiza a leitura do arquivo accounts.json no formato JSON
        const data = JSON.parse(await readFile("accounts.json"));
        //atualiza o valor do account.json trazendo deletado o id da conta informada
        data.accounts = data.accounts.filter(contaIdividual => contaIdividual.id !== parseInt(req.params.id));
        //sobrescreve o valor da variavel (data) com o filter realizado
        await writeFile("accounts.json", JSON.stringify(data,null, 2));
        //confirma para o usuario que a conta foi deletada
        res.send("Conta removida com sucesso");
        res.end();
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

export default router;


