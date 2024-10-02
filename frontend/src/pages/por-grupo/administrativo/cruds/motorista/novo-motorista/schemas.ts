import { z } from 'zod'

function isValidDate(dateStr: string) {
	const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
	if (!dateRegex.test(dateStr)) {
		return false
	}

	const [day, month, year] = dateStr.split(`/`).map(Number)

	const currentYear = new Date().getFullYear()
	if (year < 1900 || year > currentYear) {
		return false
	}

	if (month < 1 || month > 12) {
		return false
	}

	const daysInMonth = new Date(year, month, 0).getDate()
	if (day < 1 || day > daysInMonth) {
		return false
	}

	return true
}

export const driverFormSchema = z.object({
	idprofissional: z.number().optional(),
	cpf: z.string().nonempty(`Campo Obrigatório`),
	nome: z.string().nonempty(`Campo Obrigatório`),
	matricula: z.number(),
	dtnascimento: z
		.string()
		.nonempty(`Campo Obrigatório`)
		.refine((dateStr) => isValidDate(dateStr), {
			message: `Data inválida. Use o formato dd/mm/yyyy.`,
		}),
	email: z.string().nonempty(`Campo Obrigatório`),
	contato: z.string(),
	sexo: z.string().nonempty(`Campo Obrigatório`),
	apelidousu: z.string().nonempty(`Campo Obrigatório`),
	senhausu: z.string().nonempty(`Campo Obrigatório`),
	confirmasenha: z.string().nonempty(`Campo Obrigatório`),
}).refine((fields) => fields.senhausu === fields.confirmasenha, {
	path: [`confirmasenha`],
	message: `As senhas precisam ser iguais`
})

export type DriverFormSchemaType = z.infer<typeof driverFormSchema>
