import {z} from 'zod'

import {EstoqueDistribuicao} from "@infra/integrations/processo/distribuicao/types-distribuicao.ts"

export const DistribuicaoSchema = z.object({
	setor: z.number(),
})
export const DistribuicaoEstoqueSchema = z.object({
	clientes: z.array(z.number()),
})
export type DistribuicaoInputs = z.infer<typeof DistribuicaoSchema>
export type DistribuicaoFiltros = z.infer<typeof DistribuicaoEstoqueSchema>

export interface IRealizarDistribuicao {
    visible: boolean,
    onClose: any,
    clienteSelecionado: EstoqueDistribuicao | undefined
}
