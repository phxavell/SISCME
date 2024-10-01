import { NoEmpty } from "@/components/TextFields/errors"
import { z } from "zod"
import * as Z from "zod"


export const NovaCaixaTermoSchema = z.object({
	ciclo: z.string(),
	equipamento: z.string().nonempty(NoEmpty),
	programacao: z.string().nonempty(NoEmpty),
})
export type TNovaCaixa = Z.infer<typeof NovaCaixaTermoSchema>

export const PesquisarCaiasTermoSchema = z.object({
	ciclo: z.string(),
	situacao_atual: z.string(),
	termo: z.string(),
	serial: z.string(),
	data_de: z.string(),
	data_ate: z.string(),

})

export type TPesquisarCaixasTermo = Z.infer<typeof PesquisarCaiasTermoSchema>

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
