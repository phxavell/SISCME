import { z } from 'zod'

export const newClientFormSchema = z.object({
	idcli: z.number().optional(),
	nomecli: z.string().nonempty(`Campo Obrigatório`),
	cnpjcli: z.string().nonempty(`Campo Obrigatório`),
	nomeabreviado: z.string().nonempty(`Campo Obrigatório`),
	nomefantasiacli: z.string().optional(),
	ruacli: z.string().optional(),
	numerocli: z.string().optional(),
	bairrocli: z.string().optional(),
	cepcli: z.string().optional(),
	cidadecli: z.string().optional(),
	ufcli: z.string().optional(),
	inscricaoestadualcli: z.number().optional(),
	inscricaomunicipalcli: z.number().optional(),
	telefonecli: z.string().optional(),
	emailcli: z.string().optional(),
	datacadastrocli: z.string().optional(),
	horacadastrocli: z.string().optional(),
	codigocli: z.string().optional(),
	contatocli: z.string().optional(),
})
