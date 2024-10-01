import { z } from 'zod'

export const SubTipoProductSchema = z.object({
	descricao: z.string().nonempty(`Descrição não informada!`),
	id: z.number().optional(),
})
export type SubTipoProductInputs = z.infer<typeof SubTipoProductSchema>
