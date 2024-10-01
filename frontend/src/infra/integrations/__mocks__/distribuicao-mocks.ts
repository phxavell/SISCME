export const distribuicaData = {
	"status": `success`,
	"data": [
		{
			"id": 1,
			"cliente": `HOSPITAL GERAL DE PALMAS`,
			"data": `13/11/2023 17:12`,
			"quantidade_caixas": 3
		},
		{
			"id": 2,
			"cliente": `HOSPITAL GERAL DE PALMAS`,
			"data": `14/11/2023 17:12`,
			"quantidade_caixas": 4
		},
		{
			"id": 3,
			"cliente": `HOSPITAL GERAL DE PALMAS`,
			"data": `15/11/2023 17:12`,
			"quantidade_caixas": 13
		},
		{
			"id": 4,
			"cliente": `HOSPITAL GERAL DE PALMAS`,
			"data": `16/11/2023 17:12`,
			"quantidade_caixas": 17
		},
		{
			"id": 5,
			"cliente": `HOSPITAL GERAL DE PALMAS`,
			"data": `17/11/2023 17:12`,
			"quantidade_caixas": 22
		}
	],
	"meta": {
		"currentPage": 1,
		"totalItems": 5,
		"itemsPerPage": 1,
		"totalPages": 20,
		"next": `http://localhost:8000/api/processo/distribuicao/?page=2`,
		"previous": null
	}
}
export const pdfData = {
	"cliente": `HOSPITAL GERAL DE PALMAS`,
	"data_distribuicao": `13/11/2023 17:12`,
	"usuario": `Adminstrador`,
	"id": 31965,
	"data": [
		{
			"serial": `BJPEP-HGP018`,
			"nome_caixa": `PEQUENO PROCEDIMENTO P.S`
		},
		{
			"serial": `BAND KERRISON002`,
			"nome_caixa": `BANDEJA DE KERRISON`
		},
		{
			"serial": `BAND KERRISON001`,
			"nome_caixa": `BANDEJA DE KERRISON`
		},
		{
			"serial": `BJCAF-HGP001`,
			"nome_caixa": `BANDEJA DE CAF`
		},
		{
			"serial": `BJPEP-HGP003`,
			"nome_caixa": `PEQUENO PROCEDIMENTO P.S`
		},
		{
			"serial": `BDBL-MDR003`,
			"nome_caixa": `BLOQUEI0`
		},
		{
			"serial": `BDACH-HGP001`,
			"nome_caixa": `ACESSO CENTRAL HEMODIALISE`
		},
		{
			"serial": `CXMTT002`,
			"nome_caixa": `CX DE MASTECTOMIA I II N. UTILIZA`
		},
		{
			"serial": `PN-HMDR006`,
			"nome_caixa": `PARTO NORMAL-HMDR`
		},
		{
			"serial": `CDLHGP012`,
			"nome_caixa": `CAIXA DE LAPAROTMIA I ,II,III,,IV,V E VI`
		}
	]
}
