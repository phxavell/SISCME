import { z } from 'zod'

export const indicadorFormSchema = z.object({
	codigo: z.string().optional(),
	descricao: z.string().optional(),
	foto: z.any(),
	tipo: z.string().optional(),
	fabricante: z.string().optional(),
})

export type IndicadoresFormSchemaType = z.infer<typeof indicadorFormSchema>;


export const associarFormSchema = z.object({
	lote: z.union([z.number(), z.string()]),
	quantidade: z.union([z.number(), z.null()]),
})

export type AssociarFormSchemaType = z.infer<typeof associarFormSchema>;


export const loteFormSchema = z.object({
	codigo: z.string().optional(),
	indicador: z.number().optional(),
	fabricacao: z.union([z.date(), z.string()]).optional(),
	vencimento: z.union([z.date(), z.string()]).optional(),
})

export type LoteFormSchemaType = z.infer<typeof loteFormSchema>;
