import { z } from 'zod'

export const ProductSchema = z.object({
	idproduto: z.number().optional(),
	descricao: z.string().nonempty(`Descrição produto não informada!`),
	idtipopacote: z.number(),
	idsubtipoproduto: z.number(),
	embalagem: z.string().nonempty(`Descrição não informada!`),
	status: z.number().optional(),
	situacao: z.boolean().optional(),
	foto: z.array(z.instanceof(FileList)),
})
export type ProductInputs = z.infer<typeof ProductSchema>

export const barreiraSteril = [
	{
		embalagem: `GRAU`
	},
	{
		embalagem: `SMS`
	},
	{
		embalagem: `SACOLA PLASTICA`
	}
]
