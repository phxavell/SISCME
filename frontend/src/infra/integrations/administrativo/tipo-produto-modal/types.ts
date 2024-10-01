import { z } from 'zod'
export interface TipoProdutoModalProps {
    data:   TipoProdutoModal[];
    meta:   Meta;
   }
export type TipoProdutoProps = {
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
export interface TipoProdutoModal {
    descricao:      string;
    id?:             number;
   }

export interface Meta {
    currentPage:  number;
    itemsPerPage: number;
    totalItems:   number;
    totalPages:   number;
    firstItem: number
    lastItem: number
   }


export const TipoProdutoModalSchema = z.object({
	descricao: z.string().nonempty(`Descrição não informada!`),
	id: z.number().optional(),
})
export type TipoProdutoModalInputs = z.infer<typeof TipoProdutoModalSchema>
