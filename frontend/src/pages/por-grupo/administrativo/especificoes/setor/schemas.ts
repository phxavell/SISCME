import { z } from 'zod'

export const SetortSchema = z.object({
	id: z.number().optional(),
	descricao: z.string().nonempty(`Descrição não informada!`),
})
export type SetorInputs = z.infer<typeof SetortSchema>
