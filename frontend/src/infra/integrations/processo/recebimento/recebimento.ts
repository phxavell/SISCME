import {LoginResponse} from "@infra/integrations/login.ts"
import RemoteAccessClient from "@infra/api/axios-s-managed.ts"
import {RespostaAPI} from "@infra/integrations/types.ts"
import {getMensagemDeErroDistribuicao} from "@infra/integrations/processo/distribuicao/helper_distribuicao.ts"
import {IItemRecebimento} from "@infra/integrations/processo/recebimento/types-recebimento.ts"

export const RecebimentoAPI = {
	DadosParaPDF: async (user: LoginResponse,item:IItemRecebimento): Promise<RespostaAPI<any>> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `caixas-recebidas/${item.recebimento}/`,
				method: `GET`,
				params: {
					sequencial: item.serial
				}
			})
			return data
		} catch (e) {
			throw getMensagemDeErroDistribuicao(e, `Erro ao buscar dados do recebimento.`)
		}
	},
}
