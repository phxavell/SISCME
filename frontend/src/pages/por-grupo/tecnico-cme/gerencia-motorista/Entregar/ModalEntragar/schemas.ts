import { z } from 'zod'

export const pendingDriverFormSchema = z.object({
	motoristas: z.string(),
	veiculos: z.object({
		placa: z.string()
	}),
})

export type PendingDriverFormType = z.infer<typeof pendingDriverFormSchema>
