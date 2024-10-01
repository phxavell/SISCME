export const mock_dados = {
	"status": `success`,
	"data": {
		"total": {
			"recebimento": 60,
			"distribuicao": 30,
			"aproveitamento": 26.67,
			"diurno": {
				"recebimento": 40,
				"distribuicao": 25,
				"aproveitamento": 40.00
			},
			"noturno": {
				"recebimento": 20,
				"distribuicao": 10,
				"aproveitamento": 12.67
			}
		},

		"por_cliente": [
			{
				"cliente": {
					"id": 8,
					"nome": `Hospital 1`
				},
				"qtd_recebimento": 25,
				"qtd_distribuicao": 7,
				"aproveitamento": 28.0,
				"diurno": {
					"qtd_recebimento": 60,
					"qtd_distribuicao": 16,
					"aproveitamento": 26.67
				},
				"noturno": {
					"qtd_recebimento": 60,
					"qtd_distribuicao": 16,
					"aproveitamento": 26.67
				}
			},
			{
				"cliente": {
					"id": 7,
					"nome": `Hospital 2`
				},
				"qtd_recebimento": 25,
				"qtd_distribuicao": 7,
				"aproveitamento": 28.0,
				"diurno": {
					"qtd_recebimento": 60,
					"qtd_distribuicao": 16,
					"aproveitamento": 26.67
				},
				"noturno": {
					"qtd_recebimento": 60,
					"qtd_distribuicao": 16,
					"aproveitamento": 26.67
				}
			},
		]
	}
}
