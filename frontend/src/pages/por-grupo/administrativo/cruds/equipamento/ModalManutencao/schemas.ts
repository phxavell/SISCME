import { z } from 'zod'

export const newManutencaoFormSchema = z.object({
	tipo: z.string(),
	inicio_planejado: z.date().optional(),
	fim_planejado: z.date().optional(),
	equipamento: z.number().optional(),
	id: z.number().optional(),
	descricao: z.string().optional()
})

export type ManutencaoFormSchemaType = z.infer<typeof newManutencaoFormSchema>
