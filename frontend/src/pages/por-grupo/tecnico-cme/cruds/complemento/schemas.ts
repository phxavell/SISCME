import { z } from "zod"

export const complementoFormSchema = z.object({
	descricao: z.string().nonempty(`Campo Obrigatório`),
	status: z.string().nonempty(`Campo Obrigatório`)

})

export type ComplementoFormSchemaType = z.infer<typeof complementoFormSchema>
