import { z } from 'zod'

export const ProducaoSchema = z.object({
	serial: z.string().min(1, `Serial obrigatório`),
	cautela: z.number({required_error: `Cautela obrigatória`,
		invalid_type_error: `Cautela obrigatória`,})
})

export type ProducaoSchemaType = z.infer<typeof ProducaoSchema>

export const ModalSubmitSchema = z.object({
	serial: z.string().min(1, `Serial obrigatório`),
	fotoum: z.any().optional(),
	fotodois: z.any().optional(),
	fototres: z.any().optional(),
})

export type ModalSubmitSchemaType = z.infer<typeof ModalSubmitSchema>
