import { z } from 'zod'

export const ProfissaoSchema = z.object({
	id: z.number().optional(),
	descricao: z.string().nonempty(`Descrição não informada!`),
})
export type ProfissaoInputs = z.infer<typeof ProfissaoSchema>
