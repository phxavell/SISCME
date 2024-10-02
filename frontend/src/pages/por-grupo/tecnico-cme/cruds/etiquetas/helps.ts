import moment from 'moment/moment'

export const validityMonth = [
	{
		amount: `${moment().add(1, `month`).format(`YYYY-MM-DD`)}`,
		dateFormat: `1 Mês, De ${moment().format(`DD/MM/YY`)} até ${moment().add(1, `month`).format(`DD/MM/YY`)}`
	},
	{
		amount: `${moment().add(2, `month`).format(`YYYY-MM-DD`)}`,
		dateFormat: `2 Meses, De ${moment().format(`DD/MM/YY`)} até ${moment().add(2, `month`).format(`DD/MM/YY`)}`
	},
	{
		amount: `${moment().add(3, `month`).format(`YYYY-MM-DD`)}`,
		dateFormat: `3 Meses, De ${moment().format(`DD/MM/YY`)} até ${moment().add(3, `month`).format(`DD/MM/YY`)}`
	},
]

export const seladoraTipo = [
	`SELADORA 01`,
	`SELADORA 02`,
	`SELADORA 03`,
	`SELADORA 04`,
	`SELADORA 05`,
	`SELADORA 06`,
	`SELADORA 07`,
	`SELADORA 08`,
	`SELADORA 09`,
	`SELADORA 10`,
	`SMS`,
	`SELADORA DE PLASTICO`,
	`CONTAINER`
]

export const autoclave = [
	`00`,
	`01`,
	`02`,
	`03`,
	`04`,
	`05`,
	`06`,
	`PEROXIDO`
]

export const tipoImpressaoEtiqueta = [
	`INSUMO`,
	`ROUPARIA`,
	`RESPIRATORIO`,
	`INSTRUMENTAL AVULSO`,
	`TERMODESINFECCAO`,
	`CONTAIER`
]

export const integrador = [
	`SIM,01 QTD`,
	`SIM,02 QTD`,
	`SIM,03 QTD`,
	`NAO`
]

export const termodesinfectora = [
	{
		id: `1`,
		descricao: `TERMO 01`
	},
	{
		id: `2`,
		descricao: `TERMO 02`
	},
	{
		id: `3`,
		descricao: `TERMO 03`
	},
	{
		id: `4`,
		descricao: `TERMO 04`
	},
]
