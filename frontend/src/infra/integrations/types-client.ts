export interface ClienteData {
    idcli: number,
    bairrocli: string,
    cepcli: string,
    cidadecli: string,
    cnpjcli: string,
    codigocli: string,
    contatocli: string,
    datacadastrocli: string,
    emailcli: string,
    horacadastrocli: string,
    inscricaoestadualcli: number,
    inscricaomunicipalcli: number,
    nomeabreviado: string,
    nomecli: string,
    nomefantasiacli: string,
    numerocli: string,
    ruacli: string,
    telefonecli: string,
    ufcli: string
    ativo: boolean
    badge?: number

}

export interface ClienteResponse {
    status: number
    data: ClienteData[]
    meta: {
        currentPage: number,
        totalItems: number,
        itemsPerPage: number,
        totalPages: number
    }
}

export const Situacoes = [
	`ATIVO`,
	`INATIVO`,
	`AMBOS`
]

export enum StatusCliente {
    Ambos = `AMBOS`,
    Ativo = `ATIVO`,
    Inativo = `INATIVO`,
}
