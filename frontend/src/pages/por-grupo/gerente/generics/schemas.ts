import { z } from "zod"
import * as Z from "zod"

export const PesquisarRelatoriosOcorrenciasSchema = z.object({
	cliente: z.string(),
	intervalo: z.string(),
})

export type TPesquisarRelatoriosOcorrenciasSchema = Z.infer<typeof PesquisarRelatoriosOcorrenciasSchema>
