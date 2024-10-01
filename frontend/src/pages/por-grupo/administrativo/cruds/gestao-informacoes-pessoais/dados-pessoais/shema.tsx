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

export const DadosPessoaisSchema = z.object({
	nome: z.string()
		.nonempty(`Campo Obrigatório`),
	contato: z.union([z.string(), z.undefined(), z.null()]),
	coren: z.union([z.string(), z.undefined(), z.null()]),
	email: z.union([z.string(), z.undefined(), z.null()]),
	sexo: z.object({
		sexo: z.string()
	}),
	dtnascimento: z
		.string()
		.nonempty(`Campo Obrigatório`)
		.refine((dateStr) => isValidDate(dateStr), {
			message: `Data inválida. Use o formato dd/mm/yyyy.`,
		}),
	profissao: z.union([z.string(), z.undefined(), z.null()]),
	cpf: z.union([z.string(), z.undefined(), z.null()]),
	cliente: z.union([z.string(), z.undefined(), z.null()]),
	dtcadastro: z.union([z.string(), z.undefined(), z.null()]),
	dtadmissao: z.union([z.string(), z.undefined(), z.null()]),
	matricula: z.union([z.string(), z.undefined(), z.null()]),
	responsável_tecnico: z.union([z.string(), z.undefined(), z.null()]),
})
export type DadosPessoaisInputs = z.infer<typeof DadosPessoaisSchema>
