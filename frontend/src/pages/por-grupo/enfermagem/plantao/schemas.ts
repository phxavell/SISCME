import { z } from "zod"

export const plantaoFormSchema = z.object({
	coordenacao: z.string(),
	enfermeiro_expurgo: z.string(),
	enfermeiro_preparo: z.string(),
	enfermeiro_distribuicao: z.string(),
	tecnico_expurgo: z.string(),
	tecnico_instrumental: z.string(),
	tecnico_ventilatorio: z.string(),
	tecnico_autoclave: z.string(),
	tecnico_producao: z.string(),
	tecnico_distribuicao: z.string(),
	folgas: z.string(),
	faltas: z.string(),
	ferias: z.string(),
	licenca_medica: z.string(),
	licenca_maternidade: z.string(),
	atestado: z.string(),
})

export type PlantaoFormSchemaType = z.infer<typeof plantaoFormSchema>
