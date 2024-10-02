import { z } from 'zod'
export interface SubTipoProdutoModalProps {
    data:   SubTipoProdutoModal[];
    meta:   Meta;
   }
export type SubTipoProdutoProps = {
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
export interface SubTipoProdutoModal {
    descricao:      string;
    id?:             number;
   }

export interface Meta {
    currentPage: number
    itemsPerPage: number,
    totalItems: number
    totalPages: number
    firstItem: number
    lastItem: number
   }


export const SubTipoProdutoModalSchema = z.object({
	descricao: z.string().nonempty(`Descrição não informada!`),
	id: z.number().optional(),
})
export type SubTipoProdutoModalInputs = z.infer<typeof SubTipoProdutoModalSchema>
