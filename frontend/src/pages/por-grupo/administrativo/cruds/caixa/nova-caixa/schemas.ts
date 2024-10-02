import { NoEmpty } from '@/components/TextFields/errors'
import { z } from 'zod'
import * as Z from 'zod'


export const NovaCaixaSchema = z.object({
	caixa: z.string().nonempty(NoEmpty),
	cliente: z.number(),
	embalagem: z.number(),
	temperatura: z.string(),
	tipo_caixa: z.number(),
	prioridade: z.number(),
	criticidade: z.number(),
	situacao: z.number(),
	categoria: z.number(),
	instrucoes_uso: z.string().nonempty(`Campo Obrigatório`),
	validade: z.number(),
	descricao: z.string().nonempty(`Campo Obrigatório`),
	foto: z.array(z.instanceof(FileList)),
})
export type TNovaCaixa = Z.infer<typeof NovaCaixaSchema>

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
