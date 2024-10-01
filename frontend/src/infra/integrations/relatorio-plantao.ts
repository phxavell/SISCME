import RemoteAccessClient from "../api/axios-s-managed"
import {LoginResponse} from "@/infra/integrations/login.ts"
import {AxiosError} from "axios"
import {errorProps} from "@infra/integrations/plantao.ts"

export interface ProfissionalMedia {
    idprofissional__nome: string;
    quantidade_abertos: number;
    quantidade_fechados: number;
    media_duracao: string;
}

export interface RelatorioPlantaoResponse {
    mes_ano: string;
    total_plantoes_mes: number;
    total_plantoes_mes_anterior: number;
    total_plantoes_abertos: number;
    total_plantoes_fechados: number;
    comparacao_com_mes_anterior: number;
    media_por_enfermeira: ProfissionalMedia[];
}

const getMensagemDeErro = (e: any, messageDefault = `Erro não mapeado`) => {
	if (e instanceof AxiosError) {

		if (e.code === `ERR_NETWORK`) {
			return `Erro de conexão com internet.`
		}

		const customError: errorProps = {
			message: e?.response?.statusText ?? messageDefault,
			code: e?.response?.status,
			data: e?.response?.data
		}

		if (customError.data) {
			// TODO ajustar padrão de retorno do backend
			// TODO após ajuste atualizar a lógica abaixo, possível só remover;
			Object.keys(customError.data).map((key) => {
				customError.message = customError.data[key][0]
			})
		}
		if (customError.message) {
			return customError.message
		}
	}
	return messageDefault
}

export const RelatorioPlantaoAPI = {
	listTable: async (user: LoginResponse, mes: string, ano: string): Promise<RelatorioPlantaoResponse[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `plantoes/relatorio-mensal/`,
				method: `GET`,
				params: {mes, ano}
			})
			return data.data[0].media_por_enfermeira
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar dados.`)
		}
	}

}
