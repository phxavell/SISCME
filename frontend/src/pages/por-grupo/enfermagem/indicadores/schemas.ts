import { z } from "zod"

export const indicadorFormSchema = z.object({
	descricao: z.string().nonempty(`Campo Obrigatório`)
})

export type IndicadorFormSchemaType = z.infer<typeof indicadorFormSchema>
