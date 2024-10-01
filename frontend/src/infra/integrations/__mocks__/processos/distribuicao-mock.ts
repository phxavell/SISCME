export const get_seriaisDisponiveis = {
	"status": `success`,
	"data": [
		{
			"serial": `BAN1010`,
			"descricao": `BANDEJA ANTISSEPSIA`,
			"cliente": `HPS 28 DE AGOSTO`,
			"situacao": `Em estoque`,
			"quantidade_itens": 3,
			"ultimo_registro": `19/02/2024 18:08`
		},
		{
			"serial": `BAN1014`,
			"descricao": `BANDEJA ANTISSEPSIA`,
			"cliente": `HPS 28 DE AGOSTO`,
			"situacao": `Em estoque`,
			"quantidade_itens": 3,
			"ultimo_registro": `19/02/2024 18:08`
		},
		{
			"serial": `BAN1015`,
			"descricao": `BANDEJA ANTISSEPSIA`,
			"cliente": `HPS 28 DE AGOSTO`,
			"situacao": `Em estoque`,
			"quantidade_itens": 3,
			"ultimo_registro": `19/02/2024 18:08`
		},

	]
}
export const get_clientes_com_estoque_parado = {
	"status":`success`,
	"data":[
		{
			"cliente_id":1,
			"nome_cliente":`HOSPITAL E PRONTO-SOCORRO 28 DE AGOSTO`,
			"nome_fantasia":`HPS 28 DE AGOSTO`,
			"estoque_info":{
				"total_estoque":18,
				"total_caixas_criticas":17,
				"caixas_criticas":[
					{
						"idcaixa":1,
						"modelo":`BAN1`,
						"descricao":`BANDEJA ANTISSEPSIA`,
						"produzido_em":`19/02/2024 22:08`,
						"sequencial":`BAN1015`,
						"dias_parados":32
					},
					{
						"idcaixa":1,
						"modelo":`BAN1`,
						"descricao":`BANDEJA ANTISSEPSIA`,
						"produzido_em":`19/02/2024 22:08`,
						"sequencial":`BAN1015`,
						"dias_parados":32
					},
					{
						"idcaixa":1,
						"modelo":`BAN1`,
						"descricao":`BANDEJA ANTISSEPSIA`,
						"produzido_em":`19/02/2024 22:08`,
						"sequencial":`BAN1014`,
						"dias_parados":32
					},
					{
						"idcaixa":1,
						"modelo":`BAN1`,
						"descricao":`BANDEJA ANTISSEPSIA`,
						"produzido_em":`19/02/2024 22:08`,
						"sequencial":`BAN1014`,
						"dias_parados":32
					},
					{
						"idcaixa":1,
						"modelo":`BAN1`,
						"descricao":`BANDEJA ANTISSEPSIA`,
						"produzido_em":`19/02/2024 22:08`,
						"sequencial":`BAN1010`,
						"dias_parados":32
					}
				]
			}
		}
	]
}
