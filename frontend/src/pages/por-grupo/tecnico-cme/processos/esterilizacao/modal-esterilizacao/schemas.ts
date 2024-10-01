import { NoEmpty } from "@/components/TextFields/errors"
import { z } from "zod"
import * as Z from "zod"


export const NovaCaixaTermoSchema = z.object({
	ciclo: z.string(),
	equipamento: z.string().nonempty(NoEmpty),
	programacao: z.string().nonempty(NoEmpty),
})
export type TNovaCaixa = Z.infer<typeof NovaCaixaTermoSchema>

export const PesquisarCaiasEsterilizacaoSchema = z.object({
	serial: z.string().nonempty(NoEmpty),
	data_de: z.string().nonempty(NoEmpty),
	data_ate: z.string().nonempty(NoEmpty),
	ciclo: z.string(),
	situacao_atual: z.string(),
})

export type TPesquisarCaixasEsterilizacao = Z.infer<typeof PesquisarCaiasEsterilizacaoSchema>

export const ItemCaixaSchema = z.object({
	item: z.object({
		id: z.number(),
		valor:z.string(),
		idIndex: z.number().optional()
	}),
	quantidade: z.number().default(1),
	criticidade: z.number().default(1),
	id: z.number().optional()
})

export type TItemCaixa = Z.infer<typeof ItemCaixaSchema>
