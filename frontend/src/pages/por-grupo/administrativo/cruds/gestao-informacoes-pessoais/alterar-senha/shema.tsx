import { z } from 'zod'

export const AlterarSenhaSchema = z.object({
	novaAtual: z.string()
		.nonempty(`Campo Obrigatório`),
	novaSenha: z.string()
		.nonempty(`Campo Obrigatório`),
	confirmarSenha: z.string()
		.nonempty(`Campo Obrigatório`),
}).refine((fields) => fields.novaSenha === fields.confirmarSenha, {
	path: [`confirmarSenha`],
	message: `As senhas precisam ser iguais`
})
export type AlterarSenhaInputs = z.infer<typeof AlterarSenhaSchema>
