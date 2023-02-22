
import express from "express";
import { promises as fs} from "fs";


const { readFile, writeFile } = fs;
const router = express.Router();

// post request que insere dados ao arquivo accounts.json
router.post('/', async (req, res, next) => {
    try {
        let account = req.body;
        
        //validação dos dados obrigatorios
        if (!account.name || account.balance == null) {
            throw new Error("Name e Balance são obrigatorios!!!");
        };
        
        //variavel que realiza a leitura do arquivo accounts.json no formato JSON
        const data = JSON.parse(await readFile("accounts.json"));
        
        // atualiza o valor da variavel (data), passando o id como primeiro item do objeto e em seguida incrementa o id+1, e traz os valores restantes do objeto.
        account = { id: data.nextId++, name: account.name, balance: account.balance  };
        
        //atualiza o array de cadastros (accounts), inserindo um novo cadastro
        data.accounts.push(account);
        
        //escreve no arquivo(accounts.json) a atulização da variavel (data)
        await writeFile("accounts.json", JSON.stringify(data,null, 2));
        
        //retorna para o usuario os valores da nova conta cadastrada
        res.send(account);
        logger.info(`POST /account - ${JSON.stringify(account)}`);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        //variavel que realiza a leitura do arquivo accounts.json no formato JSON
        const data = JSON.parse(await readFile("accounts.json"));
        //deleta o nextId da variavel (data)
        delete data.nextId;
        //retorna para o usuario os valores das contas cadastradas
        res.send(data);
        logger.info("GET /account");

    } catch (error) {
        next(error);
    }
});

//get request que busca a conta por id
router.get('/:id', async (req, res, next) => {
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
        next(error);
    }
});

//get request que busca a conta por nome
router.get('/:nome', async (req, res, next) => {
    try {
        //variavel que realiza a leitura do arquivo accounts.json no formato JSON
        const data = JSON.parse(await readFile("accounts.json"));
        //variavel que tras do data as contas por nome informado no req.params
        const contaIdividual = data.accounts.find(contaIdividual => contaIdividual.name === (req.params.name));
        //deleta a informação do id do cliente trazendo somente o nome e o valor da conta
        delete contaIdividual.id;
        //retorna para o usuario o nome e o valor da conta solicitada
        res.send(contaIdividual);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
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
        logger.info(`DELETE /account/ ${req.params.id}`);

    } catch (error) {
        next(error);
    }
});


//put request que atualiza todos os dados da conta
router.put('/', async (req, res, next) => {
    try {
        //recebe os dados do body da requisição
        let account = req.body;
        //validação dos dados obrigatorios
        if (!account.name || account.balance == null) {
            throw new Error("Name e Balance são obrigatorios!!!")
        }
        //recebe a leitura do arquivo accounts.json no formato JSON
        const data = JSON.parse(await readFile("accounts.json"));
        //recebe o indice do array de accounts que tem o id a ser atualizado
        const index = data.accounts.findIndex(conta => conta.id === account.id);
        //validação caso o id seja inexistente
        if (index === -1) {
        throw new Error("Registro nao encontrado")
        }

        data.accounts[index].balance = account.balance;
        data.accounts[index].name = account.name;

        //ecreve no arquivo(accounts.json) o novo valor da acconut
        await writeFile("accounts.json", JSON.stringify(data,null, 2));

        res.send(`O usuário ${account.name} foi atualizado com sucesso`);
        logger.info(`PUT /account - ${JSON.stringify(account)}`);

    } catch (error) {
        next(error);
    }
});

//metodo que atualiza somente o balance da conta
router.patch('/updateBalance', async (req, res, next) => {
    try {
        let account = req.body;
        //validação dos dados obrigatorios
        if (!account.id || account.balance == null) {
            throw new Error("Id e balance precisam ser preenchido.");
        }
        //recebe a leitura do arquivo accounts.json no formato JSON
        const data = JSON.parse(await readFile("accounts.json"));
       
        //recebe o indice que tem o id a ser atualizado
        const index = data.accounts.findIndex(conta => conta.id === account.id);
       
        //data recebe o novo valor do balance informado
        data.accounts[index].balance = account.balance;
        
       
        //ecreve no arquivo(accounts.json) o novo valor do balance
        await writeFile("accounts.json", JSON.stringify(data,null, 2));
       
        //informa ao usuario que a o valor da conta foi atualizada
        res.send(`Saldo atualizado com sucesso!!!!`);
        logger.info(`PATCH /account / updateBalance - ${JSON.stringify(account)}`);
    } catch (error) {
        next(error);
    }
});

router.use((error, req, res, next) => {
    logger.error(`${req.method} ${req.baseUrl} - ${error.message}`);
    res.status(500).send({error: error.message});
});

export default router;


