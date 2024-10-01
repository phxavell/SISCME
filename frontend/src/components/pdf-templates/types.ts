export interface ITermoToPDF {
    criado_por: {
        id: number,
        nome: string
    },
    usuario: string,
    ciclo: number,
    programacao: string,
    data_hora_inicio:string,
    datafim: string,
    data_hora_fim: string,
    equipamento: string,
    total_itens: number,
    lote:string,
    itens: {
        cliente: string,
        sequencial: string,
        caixa: string
    }[]
}

export interface IPortifolioToPDF {
    serial: string,
    codigo_modelo: string,
    cliente: string,
    caixa: string,
    tipo: string,
    embalagem: string,
    validade: number,
    quantidade_itens: number,
    itens: {
        id: number,
        produto: string,
        quantidade: number
    }[]
}
export interface IPreparoToPDF {
    caixa: {
        id: number,
        cliente: any,
        descricao: any,
        tipo: any,
        cautela: any,
        sequencial: any,
        temperatura: any,
        itens: any[]
    },
    cautela: number,
    codigo: string,
    ciclo_termodesinfeccao: number,
    responsavel_tecnico_coren: string,
	responsavel_tecnico_nome: string,
    usuario_preparo_coren: string,
    recebimento: {
        usuario: {
            id: number,
            nome: string
        },
        data_hora: string,
        data_recebimento: string,
    }

}

export interface IPreparoToTriploPDF {
    caixa: {
        id: number,
        cliente: any,
        descricao: any,
        tipo: any,
        codigo: any,
        sequencial: any,
        temperatura: any,
        itens: any[],
        quantidade: number
    },
    codigo: string,
    recebimento: {
        usuario: {
            id: number,
            nome: string
        },
        data_hora: string,
        data_recebimento: string,
    },
    barcode: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const preparosMock: IPreparoToTriploPDF[] = [
	{
		caixa: {
			id:1,
			descricao:`Descricao da caixa`, itens: [

			],
			cliente: `Cliente core`,
			codigo: `Codigo`,
			tipo: `CUBARIM`,
			sequencial: `sequencial`,
			temperatura: `134º`,
			quantidade:124
		},
		recebimento: {
			usuario: {
				id: 1,
				nome:`Dom dom jon m ferreira`
			},
			data_hora: `30/10/2023`,
			data_recebimento: `25/10/2023`
		},
		codigo: `123312`,
		barcode: `null`
	}
]


export interface IRelatorioOcorrenciaToPDF {
    titulo: string,
    clientesDropdown: any[],
    selectedClientes: number[],
    dateInterval: Date[],
}
