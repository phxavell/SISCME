import { z } from 'zod'

export const TipoProductSchema = z.object({
	descricao: z.string().nonempty(`Descrição não informada!`),
	id: z.number().optional(),

})
export type TipoProductInputs = z.infer<typeof TipoProductSchema>
