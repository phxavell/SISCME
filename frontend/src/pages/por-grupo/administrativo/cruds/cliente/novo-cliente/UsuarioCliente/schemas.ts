import { z } from 'zod'

export const usuarioClienteFormSchema = z.object({
	cliente: z.number().optional(),
	cpf: z.string()
		.nonempty(`Campo Obrigatório`),
	nome: z.string()
		.nonempty(`Campo Obrigatório`),
	matricula: z.number(),
	dtnascimento: z.date().nullable(),
	email: z.string().nonempty(`Campo Obrigatório`).optional(),
	contato: z.string(),
	sexo: z.string(),
	apelidousu: z.string().nonempty(`Campo Obrigatório`),
	senhausu: z.string().nonempty(`Campo Obrigatório`),
	confirmasenha: z.string().nonempty(`Campo Obrigatório`).optional(),
}).refine((fields) => fields.senhausu === fields.confirmasenha, {
	path: [`confirmasenha`],
	message: `O campo "Confirme a senha" deve estar igual ao campo "Senha".`
})

export type UsuarioClienteFormSchemaType = z.infer<typeof usuarioClienteFormSchema>
