import { z } from "zod"

export const complementoForm = z.object({
	descricao: z.string().min(1, `Campo Obrigatório`),
})
