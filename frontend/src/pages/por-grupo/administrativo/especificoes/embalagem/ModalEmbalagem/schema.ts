import { z } from 'zod'

export const EmbalagemSchema = z.object({
	id: z.number().optional(),
	descricao: z.string().nonempty(`Descrição não informada!`),
	valorcaixa: z.string().nonempty(`Valor não informado!`),
})
export type EmbalagemInputs = z.infer<typeof EmbalagemSchema>
