export const mock_dados = {
	"status": `success`,
	"data": {
		"total": 3,
		"total_finalizado": 3,
		"total_em_andamento": 1,
		"total_horas": `144`,
		"por_tipo_manutencao": [
			{
				"tipo_manutencao": `PREVENTIVA`,
				"quantidade": 2
			},
			{
				"tipo_manutencao": `AJUSTE`,
				"quantidade": 1
			}
		],
		"por_equipamento": [
			{
				"idequipamento": 1,
				"quantidade": 2,
				"equipamento": `TERMODESINFECCAO1`
			},
			{
				"idequipamento": 2,
				"quantidade": 1,
				"equipamento": `AUTOCLAVE01`
			}
		],
		"por_equipamento_em_manutencao": [
			{
				"idequipamento": 1,
				"quantidade": 1,
				"equipamento": `TERMODESINFECCAO1`
			}
		]
	}
}
