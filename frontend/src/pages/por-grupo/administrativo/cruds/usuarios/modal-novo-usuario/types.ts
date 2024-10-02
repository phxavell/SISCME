import moment from 'moment'
import { z } from 'zod'
export interface IModalNovoUsuario {
    showModal: boolean
	onClose: () => void
}

export enum ETabUsuario {
	DadosPessoais = 0,
	DadosAdicionais = 1,
	DadosUsuario = 2
}

export const UsuariosSchema = z.object({
	Profissional: z.object({
		idprofissional: z.number().optional(),
		cpf: z.string().optional(),
		nome: z.string().optional(),
		matricula: z.number().nullable().optional(),
		coren: z.string().optional(),
		dtnascimento: z.any().transform((date) => moment(date).format(`YYYY-MM-DD`)).optional(),
		dtadmissao: z.any().transform((date) => moment(date).format(`YYYY-MM-DD`) ).optional(),
		rt: z.string().default(`N`),
		email: z.string().optional(),
		contato: z.string().optional(),
		sexo: z.string().optional(),
		idprofissao: z.number().optional(),
	}),
	Usuario: z.object({
		username: z.string().optional(),
		grupos: z.number().array().optional(),
	})
})
export type UsuariosInputs = z.infer<typeof UsuariosSchema>
