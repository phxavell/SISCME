import { z } from "zod"

const TIPO = {
	INSUMO: `INSUMO`,
	ROUPARIA: `ROUPARIA`,
	RESPIRATORIO: `RESPIRATORIO`,
	INSTRUMENTALAVULSO: `INSTRUMENTAL AVULSO`,
	CONTEINER: `CONTEINER`,
	TERMODESINFECCAO: `TERMODESINFECCAO`,
}
enum DescricaoErros {
	CampoNumerico=`Esperada entrada numérica`,
	CampoObrigatorio=`Campo obrigatório`
}
export const etiquetaFormSchema = z
	.object({

		biologico: z.string().optional(),
		servico: z.string().min(1, `Campo obrigatório`),
		ciclo_autoclave: z.string().optional(),
		ciclo_termodesinfectora: z.string().optional(),
		datavalidade: z.string().min(1, `Campo obrigatório`),
		cautela: z.union([z.number(), z.null(), z.string()]).optional(),
		termodesinfectora: z
			.number({ invalid_type_error: DescricaoErros.CampoNumerico, required_error:DescricaoErros.CampoObrigatorio})
			.optional(),
		peso: z.string().optional().default(``),
		qtd: z.number({ invalid_type_error: DescricaoErros.CampoObrigatorio , required_error:DescricaoErros.CampoObrigatorio }),
		autoclave: z
			.number({ invalid_type_error: DescricaoErros.CampoNumerico })
			.optional(),
		seladora: z.number({ invalid_type_error: DescricaoErros.CampoNumerico }).optional(),
		setor: z.union([z.number(), z.undefined(), z.string()]).optional(),
		temperatura: z.string().optional(),
		tipoetiqueta: z.string().min(1, `Campo obrigatório`),
		idproduto: z.number({ invalid_type_error: `Campo obrigatório` }),
		idcomplemento: z
			.number()
			.optional(),
	})
	.superRefine((data, ctx) => {
		const {
			tipoetiqueta,
			autoclave,
			termodesinfectora,
			ciclo_autoclave,
			ciclo_termodesinfectora,
		} = data
		// console.log(`superRefine`, data)
		const addIssue = (path: string[], message: string) => {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path,
				message,
			})
		}

		if (tipoetiqueta === TIPO.INSUMO || tipoetiqueta === TIPO.ROUPARIA) {
			if (autoclave === undefined) {
				addIssue([`autoclave`], `Campo obrigatório.`)
			}
			if (ciclo_autoclave === undefined) {
				addIssue([`ciclo_autoclave`], `Campo obrigatório.`)
			}
		}

		if (tipoetiqueta === TIPO.RESPIRATORIO) {
			if (termodesinfectora === undefined) {
				addIssue([`termodesinfectora`], `Campo obrigatório.`)
			}
			if (ciclo_termodesinfectora === undefined) {
				addIssue([`ciclo_termodesinfectora`], `Campo obrigatório.`)
			}
		}

		if (
			tipoetiqueta === TIPO.INSTRUMENTALAVULSO ||
            tipoetiqueta === TIPO.CONTEINER
		) {
			if (autoclave === undefined) {
				addIssue([`autoclave`], `Campo obrigatório`)
			}
			if (ciclo_autoclave === undefined) {
				addIssue([`ciclo_autoclave`], `Campo obrigatório.`)
			}
			if (termodesinfectora === undefined) {
				addIssue([`termodesinfectora`], `Campo obrigatório`)
			}
			if (ciclo_termodesinfectora === undefined) {
				addIssue([`ciclo_termodesinfectora`], `Campo obrigatório.`)
			}
		}

		if (tipoetiqueta === TIPO.TERMODESINFECCAO) {
			if (termodesinfectora === undefined) {
				addIssue([`termodesinfectora`], `Campo obrigatório.`)
			}
			if (ciclo_termodesinfectora === undefined) {
				addIssue([`ciclo_termodesinfectora`], `Campo obrigatório.`)
			}
		}
	})

export type EtiquetaFormSchemaType = z.infer<typeof etiquetaFormSchema>;

export enum EMensagensNulas {
    ZeroSeladoras = `Nenhuma seladora cadastrada.`,
}
