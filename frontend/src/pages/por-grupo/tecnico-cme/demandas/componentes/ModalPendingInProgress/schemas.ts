import { z } from 'zod'

export const pendingFormSchema = z.object({
	retorno: z.boolean().optional(),
	solicitacao_esterilizacao: z.number().optional(),
	motorista: z.union([z.number(), z.undefined()]),
	veiculo: z.number(),
	idcoleta: z.number().optional()
})

export type PendingFormType = z.infer<typeof pendingFormSchema>
