import { z } from 'zod'

export const TipoCaixaSchema = z.object({
	descricao: z.string().nonempty(`Descrição não informada!`),
	id: z.number().optional(),

})
export type TipoCaixaInputs = z.infer<typeof TipoCaixaSchema>

export type TipoCaixaProps = {
    id: number,
    descricao: string,
    criado_por: {
        id: number,
        username: string,
        nome: string,
    }
    criado_em: string,
    atualizado_em: string,
    atualizado_por: {
        id: number,
        username: string,
        nome: string,
    }
}
