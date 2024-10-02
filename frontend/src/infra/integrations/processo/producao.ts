import RemoteAccessClient from '../../api/axios-s-managed.ts'
import { LoginResponse } from '@infra/integrations/login.ts'
export interface PreparoResponse {
    data:   Preparo[];
    meta:   Meta;
    status: string;
   }

export interface Preparo {
    ciclo:           string;
    cliente:         string;
    nome_caixa:      string;
    serial:          string;
    ultimo_registro: Date;
   }

export interface Meta {
    currentPage:  number;
    itemsPerPage: number;
    next:         string;
    previous:     null;
    totalItems:   number;
    totalPages:   number;
   }
export interface ProdutoProducao {
    id: number
    produto: string
    quantidade: number
    quantidade_checada: number
    check: boolean
}

export interface CaixaPreaparoPros {
	files: any;
	fotos: any;
    cautela?: number
    serial: string
	lote: any
    produtos: Array<ProdutoProducao>
    quantidade: number
    quantidade_checada: number
    check: boolean
    nome_caixa: string
    total_itens: number
    cliente: string
}

export interface ProdutoProducaoPost {
    id: number
    produto: string
    quantidade: number
}

export namespace NProducao {
    export enum Methods {
        // Get = `logistica/recebimento-aguardando-conferencia/`,
        Get = `processo/preparo/itens-a-preparar/`,
        Post = `processo/preparo/`,
    }

    export enum ErrosExcetion {
        Get = `Erro ao buscar caixas.`,
        ArrayNotValid = `Não foi possível confirmar o recebimento da caixa, array de caixas verificadas inválido.`,
        Post = `Não foi possível confirmar o recebimento da caixa.`,
        GetBy = `Erro ao buscar dados da caixa.`
    }

    export type TMapItemCaixa = (
        itemCaixa: ProdutoProducao
    ) => ProdutoProducaoPost

    export interface BodyProducaoPost {
        serial: string
        caixa_completa: boolean
        produtos: ProdutoProducaoPost[]
    }

    export type TMakeBody = (
        caixaPura: CaixaPreaparoPros,
        itensVerificados: ProdutoProducao[]
    ) => BodyProducaoPost
}

const makeBodyProducaoPost: NProducao.TMakeBody = (
	caixaPura,
	itensVerificados
) => {
	const formData = new FormData()
	const caixa_completa_ = itensVerificados.findIndex(conforme => !conforme.check) === -1
	const produtos = itensVerificados.map((item) => {
		return {...item, conforme: item.check}
	})
	formData.append(`caixa_completa`, JSON.stringify(caixa_completa_))
	formData.append(`produtos`, JSON.stringify(produtos))
	formData.append(`serial`, JSON.stringify(caixaPura.serial))
	formData.append(`cautela`, JSON.stringify(caixaPura.cautela))
	if(caixaPura.lote) {
		formData.append(`lote`, JSON.stringify(caixaPura.lote))
	}
	if(caixaPura.files) {
		caixaPura.files.forEach((foto: any, index: any) => {
			formData.append(`foto${index + 1}`, foto)
		})
	}
	return formData as any
}
export const ProducaoAPI = {
	listGeral: async (user: LoginResponse, page: number): Promise<PreparoResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: NProducao.Methods.Get,
				method: `GET`,
				params: {page}
			})
			return data

		} catch (e) {
			throw NProducao.ErrosExcetion.Get
		}
	},

	finalizarChecagem: async (
		user: LoginResponse,
		caixaPura: any,
		caixasVerificadas: ProdutoProducao[],
	) => {
		if (!Array.isArray(caixasVerificadas)) {
			throw NProducao.ErrosExcetion.ArrayNotValid
		}
		const body: NProducao.BodyProducaoPost =
            makeBodyProducaoPost(caixaPura, caixasVerificadas)

		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: NProducao.Methods.Post,
				method: `POST`,
				headers: {
					'Content-Type': `multipart/form-data`,
				},
				data: body
			})
			return data
		} catch (e) {
			// @ts-ignore
			throw e.response?.data?.error?.message || NPreRecebiomento.ErrosExcetion.Post
		}
	},
	bipBox: async (user: LoginResponse, sequencial: string): Promise<CaixaPreaparoPros> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `caixa/${sequencial}`,
				method: `GET`
			})
			return {
				...data.data,
				produtos: data.data.produtos?.map((item: any) => (
					{
						...item,
						quantidade_checada: item.quantidade,
						check: true
					}))
			}
		} catch (e: any) {
			if (e.response?.data?.error?.message) {
				throw e.response?.data?.error?.message
			}
			throw NProducao.ErrosExcetion.GetBy
		}
	},

}
