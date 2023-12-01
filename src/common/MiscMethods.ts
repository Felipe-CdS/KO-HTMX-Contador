import { Equal, LessThan, getCustomRepository } from "typeorm";
import { Transaction } from "../entities/Transaction";
import { IRepartitionTable, ITaxRow } from "../entities/TaxTable";
import { MonthExpenses } from "../entities/MonthExpenses";
import { User } from "../entities/User";
import axios from "axios";
import https from "https";
import { readFile } from "fs/promises";
import { dbSource } from "../database";
import { SubTransaction } from "../entities/SubTransaction";
import { SubMonthExpenses } from "../entities/SubMonthExpenses";
import { EmailUserJunction } from "../entities/EmailUserJunction";
import { TaxUserJunction } from "../entities/TaxUserJunction";

const getTransactionComissionTotal = async function(tx: Transaction) {
    const subTransactionRepository = dbSource.getRepository(SubTransaction);
    var comission_total = 0 as number;

    var subTxArray = await subTransactionRepository.find({
        where: { fk_transaction_id: Equal(tx) }
    });

    subTxArray.map((e) => {
        comission_total += Number(e.comission_value);
    });
    return comission_total;
};

const getTransactionISSTotal = async function(tx: Transaction) {
    const subTransactionRepository = dbSource.getRepository(SubTransaction);
    var iss_total = 0 as number;

    var subTxArray = await subTransactionRepository.find({
        where: { fk_transaction_id: Equal(tx) }
    });

    subTxArray.map((e) => {
        iss_total += Number(e.iss_value);
    });
    return iss_total;
};

const getRBT12 = async function(tx: Transaction) {
    const transactionRepository = dbSource.getRepository(Transaction);
    const year = new Date(tx.transaction_date).getFullYear();
    const month = new Date(tx.transaction_date).getMonth();

    var RBT12 = 0 as number;
    var last12MonthsArray = await transactionRepository.find({
        where: {
            fk_user_id: Equal(tx.fk_user_id),
            fk_tax_id: Equal(tx.fk_tax_id),
            transaction_date: LessThan(new Date(`${year}-${month + 1}-01  00:00:00.00000`)),
        },
        order: { transaction_date: "DESC" },
        take: 12,
    });

    if (last12MonthsArray.length == 0)
        return Number(await getTransactionComissionTotal(tx)) * 12;

    if (last12MonthsArray.length < 12) {
        for (var i = 0; i < last12MonthsArray.length; i++)
            RBT12 += Number(await getTransactionComissionTotal(last12MonthsArray[i]));

        RBT12 /= last12MonthsArray.length;
        return RBT12 * 12;
    }

    for (var i = 0; i < last12MonthsArray.length; i++)
        RBT12 += Number(await getTransactionComissionTotal(last12MonthsArray[i]));

    return RBT12;
};

const getEffectiveTaxPercentage = async function(tx: Transaction) {
    var taxTable = tx.fk_tax_id;
    var rbt_12 = await getRBT12(tx);

    var rangeRow = null as ITaxRow;

    taxTable.rows.map((elem) => {
        if (rbt_12 >= elem.min_value && rbt_12 <= elem.max_value) rangeRow = elem;
    });

    if (!rangeRow)
        throw new Error(
            "Desculpe, algo deu errado... Aparentemente a sua receita bruta dos ultimos 12 meses ultrapassou o limite de faturamento anual do Simples Nacional. Consulte o seu contador para mais detalhes.",
        );

    var effectiveRate =
        (rbt_12 * rangeRow.tax_percentage - rangeRow.discount_value) / rbt_12;

    return effectiveRate;
};

const getRepartitionTablePercentage = async function(tx: Transaction) {
    var taxTable = tx.fk_tax_id;
    var rbt_12 = await getRBT12(tx);
    var rangeRow = null as ITaxRow;
    var repatitionRange = null as IRepartitionTable;

    for (let i = 0; i < taxTable.rows.length; i++) {
        let elem = taxTable.rows[i];
        if (rbt_12 >= elem.min_value && rbt_12 <= elem.max_value) {
            rangeRow = elem;
            break;
        }
    }

    taxTable.repartition_table.map((elem) => {
        if (elem.range == rangeRow.range) repatitionRange = elem;
    });

    return repatitionRange.ISS;
};

const buildTransactionResponse = async function(tx: Transaction) {
    const subTransactionRepository = dbSource.getRepository(SubTransaction);

    var comission_entries = (
        await subTransactionRepository.find({
            where: { fk_transaction_id: Equal(tx) }
        })
    ).map((e) => {
        let holder = {
            commission_id: e.subtransaction_id,
            commission_value: Number(e.comission_value),
            iss_value: Number(e.iss_value),
            insurer_name: null,
        };

        if (e.fk_insurer_id) holder.insurer_name = e.fk_insurer_id.insurer_name;

        return holder;
    });

    var response = {
        id: tx.transaction_id,
        user_id: tx.fk_user_id.user_id,
        username: tx.fk_user_id.username,
        tax_name: tx.fk_tax_id.tax_name,
        transaction_date: tx.transaction_date,
        tax_identifier: tx.fk_tax_id.number_identifier,
        rbt_12: await getRBT12(tx),
        comission_total: await getTransactionComissionTotal(tx),
        iss_total: await getTransactionISSTotal(tx),
        effective_tax_percentage: await getEffectiveTaxPercentage(tx),
        repartition_table_iss_percentage: await getRepartitionTablePercentage(tx),
        comission_entries,
    };

    return response;
};

const buildExpensesResponse = async function(monthExpensesObj: MonthExpenses) {
    const subMonthExpensesRep = dbSource.getRepository(SubMonthExpenses);

    var month_entries = (
        await subMonthExpensesRep.find({
            where: { fk_month_expense_id: Equal(monthExpensesObj) }
        })
    ).map((e) => {
        let holder = {
            sub_expense_id: e.sub_expense_id,
            description: e.description,
            quantity: Number(e.quantity),
            unit_value: Number(e.unit_value),
            created_at: e.created_at,
        };
        return holder;
    });

    month_entries.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));

    var response = {
        username: monthExpensesObj.fk_user_id.username,
        month: monthExpensesObj.month,
        year: monthExpensesObj.year,
        month_entries,
    };

    return response;
};

const buildSingleUserResponse = async function(user: User) {
    const taxUserJunctionRepository = dbSource.getRepository(TaxUserJunction);
    const emailUserJunctionRepository = dbSource.getRepository(EmailUserJunction);

    let elemJunctionsArray = [];
    let elemEmailsArray = [];
    let allJunctions = await taxUserJunctionRepository.find({
        where: { fk_user_id: Equal(user) }
    });
    let AllEmails = await emailUserJunctionRepository.find({
        where: { fk_user_id: Equal(user) }
    });

    for (let j = 0; j < allJunctions.length; j++) {
        elemJunctionsArray.push(allJunctions[j].fk_table_id.number_identifier);
    }

    for (let j = 0; j < AllEmails.length; j++) {
        elemEmailsArray.push(AllEmails[j].email);
    }

    return {
        user_id: user.user_id,
        cnpj_number: user.cnpj_number,
        username: user.username,
        email: user.email,
        emails: elemEmailsArray,
        updated_at: user.updated_at,
        tax_types: elemJunctionsArray,
    };
};

const authenticateAPI = async function() {
    const AUTH_URL = "https://autenticacao.sapi.serpro.gov.br/authenticate";

    const AUTH_TOKEN = Buffer.from(
        process.env.API_CONSUMER_KEY + ":" + process.env.API_CONSUMER_SECRET,
    ).toString("base64");

    var cert_file = await readFile("./src/static/certificate-062024.pfx");

    var auth_resp = "";
    var jwt_token = "";

    try {
        const response = await axios.request({
            url: AUTH_URL,
            method: "POST",
            headers: {
                Authorization: "Basic " + AUTH_TOKEN,
                "Role-Type": "TERCEIROS",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            httpsAgent: new https.Agent({
                pfx: cert_file,
                passphrase: "1234",
            }),
        });
        auth_resp = response.data.access_token;
        jwt_token = response.data.jwt_token;
    } catch (error) {
        console.log(error);
        throw new Error("Erro na autenticação do certificado");
    }

    return [auth_resp, jwt_token];
};

const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export {
    buildTransactionResponse,
    buildExpensesResponse,
    buildSingleUserResponse,
    authenticateAPI,
    formatter,
};
