//modulos externos
import inquirer from "inquirer";
import chalk, { Chalk } from "chalk";

//modulos internos
import fs from "fs";

operation();
function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      switch (action) {
        case "Criar Conta":
          createAccount();
          break;
        case "Consultar Saldo":
          getAccountBallance();
          break;
        case "Depositar":
          deposit();
          break;
        case "Sacar":
          withdraw();
          break;
        case "Sair":
          console.log(chalk.bgBlue.black("Obrigado por usar o Accounts"));
          process.exit();
        default:
          console.log(chalk.bgRed.blackBright("Ação não reconhecida"));
      }
    })
    .catch((err) => console.log(err));
}

//create an account
function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco"));
  console.log(chalk.green("Defina as opções da sua conta a seguir:"));

  buildAccount();
}

//Criando a conta
function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome!")
        );
        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance":0}',
        function (err) {
          console.log(err);
        }
      );
      console.log(chalk.green("Parabéns, sua conta foi criada"));
      operation();
    })
    .catch((err) => console.log(err));
}

//deposit
function deposit() {
  inquirer
    .prompt([{ name: "accountName", message: "Qual o nome da sua conta?" }])
    .then((answer) => {
      const accountName = answer["accountName"];

      //verify is account exits
      if (!checkAccount(accountName)) {
        return deposit();
      }
      inquirer
        .prompt([{ name: "amount", message: "Quando você deseja depositar" }])
        .then((answer) => {
          const amount = answer["amount"];

          //add and amount
          addAmount(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black("Esta conta não existe, escolha outro nome"));
    return false;
  }
  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    );
    return deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );
  console.log(
    chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`)
  );
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });

  return JSON.parse(accountJSON);
}

//show account balance
function getAccountBallance() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      //verify if exists
      if (!checkAccount(accountName)) {
        return getAccountBallance();
      }

      const accountData = getAccount(accountName);

      console.log(
        chalk.bgBlue.black(
          `O saldo da conta ${accountName} é de R$: ${accountData.balance}`
        )
      );

      operation();
    })
    .catch((err) => console.log(err));
}

//witdraw an ammount from user account
function withdraw() {
  inquirer
    .prompt([{ name: "accountName", message: "Qual o nome da sua conta?" }])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return withdraw();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja sacar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          removeAmount(accountName, amount);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(chalk.bgRed.black("Ocorreu um erro, tente mais tarde"));

    return withdraw();
  }

  if (accountData.balance < amount) {
    console.log(
      chalk.bgRed.black("O valor de saque é maior que o valor da conta.")
    );
    return withdraw();
  }
  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(chalk.green(`Foi realizado um saque de R$ ${amount} da sua conta`));
  operation();
}
