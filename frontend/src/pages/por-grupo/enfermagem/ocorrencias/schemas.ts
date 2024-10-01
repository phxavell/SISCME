import {z} from "zod"

export const OcorrenciaSchema = z.object({
	tipo: z.string(),
	setor: z.number(),
	indicador: z.number(),
	cliente: z.number(),
	profissional: z.number(),
	data_ocorrencia: z.date(),
	datetime_ocorrencia:z.date(),
	hora_ocorrencia: z.date(),
	descricao: z.string().min(1,`Descrição necessária, comece por um template.`),
})
export type TOcorrencia = z.infer<typeof OcorrenciaSchema>
export const OcorrenciaFecharSchema = z.object({
	acao: z.string()//.min(1,`Descrição necessária, comece por um template.`),
})
export type TOcorrenciaFechar = z.infer<typeof OcorrenciaFecharSchema>
export const OcorrenciaAnexarSchema = z.object({
	foto: z.array(z.instanceof(FileList)),
})
export type TOcorrenciaAnexar = z.infer<typeof OcorrenciaAnexarSchema>
