import { z } from 'zod'

export const SterilizationRequestsSchema = z.object({
	serial: z.string().nonempty(),
})


export type SterilizationRequestsType = z.infer<typeof SterilizationRequestsSchema>
