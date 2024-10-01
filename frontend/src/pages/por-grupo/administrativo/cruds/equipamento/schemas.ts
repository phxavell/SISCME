import { z } from 'zod'

export const newEquipamentosFormSchema = z.object({
	idequipamento: z.number().optional(),
	numero_serie: z.string().nonempty(`Campo Obrigatório`).optional(),
	descricao: z.string().nonempty(`Campo Obrigatório`).optional(),
	data_fabricacao: z.any(),
	registro_anvisa: z.number().optional(),
	capacidade: z.number().optional(),
	fabricante: z.string().optional(),
	fornecedor: z.string().optional(),
	tipo: z.string(),
	ativo: z.union([z.boolean(), z.string().nonempty(`Campo Obrigatório`)])
})

export type EquipamentosFormSchemaType = z.infer<typeof newEquipamentosFormSchema>
