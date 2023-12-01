import { AxiosRequestConfig } from "axios";
import { Transaction } from "../../entities/Transaction";

export class APIRequestsFactory {
    private static genericTemplate(userCNPJ: string): IgenericTemplate {
        return {
            contratante: {
                numero: "74038795000163",
                tipo: 2,
            },
            autorPedidoDados: {
                numero: "74038795000163",
                tipo: 2,
            },
            contribuinte: {
                numero: userCNPJ,
                tipo: 2,
            },
            pedidoDados: null,
        };
    }

    public static getTemplateAuthenticatedHeaders(AUTH_TOKEN: string, JWT_TOKEN: string) {
        return {
            Authorization: "Bearer " + AUTH_TOKEN,
            jwt_token: JWT_TOKEN,
            "Content-Type": "application/json",
            accept: "text/plain",
        };
    }

    public static getTemplateCONSULTIMADECREC14(
        transaction: Transaction,
        AUTH_TOKEN: string,
        JWT_TOKEN: string,
    ): AxiosRequestConfig {
        const API_URL = "https://gateway.apiserpro.serpro.gov.br/integra-contador/v1/Consultar";

        var genericHolder = this.genericTemplate(transaction.fk_user_id.cnpj_number);

        genericHolder.pedidoDados = {
            idSistema: "PGDASD",
            idServico: "CONSULTIMADECREC14",
            versaoSistema: "1.0",
            dados: `{ "periodoApuracao": ${transaction.getFormattedDate()} }`,
        };

        return {
            url: API_URL,
            method: "POST",
            headers: this.getTemplateAuthenticatedHeaders(AUTH_TOKEN, JWT_TOKEN),
            data: genericHolder,
        };
    }

    public static getTemplateTRANSDECLARACAO11(
        transaction: Transaction,
        AUTH_TOKEN: string,
        JWT_TOKEN: string,
        commission_total: number,
        array_holder: any,
        calcDASParts: any,
    ): AxiosRequestConfig {
        const API_URL = "https://gateway.apiserpro.serpro.gov.br/integra-contador/v1/Declarar";

        var genericHolder = this.genericTemplate(transaction.fk_user_id.cnpj_number);

        let dataJSON = {
            cnpjCompleto: transaction.fk_user_id.cnpj_number,
            pa: transaction.getFormattedDate(),
            indicadorTransmissao: true,
            indicadorComparacao: true,
            declaracao: {
                tipoDeclaracao: 1,
                receitaPaCompetenciaInterno: commission_total,
                receitaPaCompetenciaExterno: 0.0,
                estabelecimentos: [
                    {
                        cnpjCompleto: transaction.fk_user_id.cnpj_number,
                        atividades: [
                            {
                                idAtividade: 15,
                                valorAtividade: commission_total,
                                receitasAtividade: [
                                    {
                                        valor: commission_total,
                                    },
                                ],
                            },
                        ],
                    },
                ],
                receitasBrutasAnteriores: array_holder,
            },
            valoresParaComparacao: calcDASParts,
        };
        genericHolder.pedidoDados = {
            idSistema: "PGDASD",
            idServico: "TRANSDECLARACAO11",
            versaoSistema: "1.0",
            dados: JSON.stringify(dataJSON),
        };

        return {
            url: API_URL,
            method: "POST",
            headers: this.getTemplateAuthenticatedHeaders(AUTH_TOKEN, JWT_TOKEN),
            data: genericHolder,
        };
    }

    public static getTemplateGERARDAS12(
        AUTH_TOKEN: string,
        JWT_TOKEN: string,
        transaction: Transaction,
    ): AxiosRequestConfig {
        const API_URL = "https://gateway.apiserpro.serpro.gov.br/integra-contador/v1/Emitir";

        var genericHolder = this.genericTemplate(transaction.fk_user_id.cnpj_number);

        genericHolder.pedidoDados = {
            idSistema: "PGDASD",
            idServico: "GERARDAS12",
            versaoSistema: "1.0",
            dados: `{ "periodoApuracao": "${transaction.getFormattedDate()}" }`,
        };

        return {
            url: API_URL,
            method: "POST",
            headers: this.getTemplateAuthenticatedHeaders(AUTH_TOKEN, JWT_TOKEN),
            data: genericHolder,
        };
    }
}
interface IpedidoDados {
    idSistema: string;
    idServico: string;
    versaoSistema: string;
    dados: string;
}

interface IgenericTemplate {
    contratante: {
        numero: string;
        tipo: number;
    };
    autorPedidoDados: {
        numero: string;
        tipo: number;
    };
    contribuinte: {
        numero: string;
        tipo: number;
    };
    pedidoDados: IpedidoDados;
}
