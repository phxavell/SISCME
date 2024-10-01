import {ICaixaOptionsResponse} from '@infra/integrations/caixa/types.ts'

export const CaixaMock = {
	opcoesParaFormulario: {
		'embalagens': [
			{
				'id': 9,
				'valor': `P`
			},
			{
				'id': 1,
				'valor': `M`
			},
			{
				'id': 7,
				'valor': `G`
			}
		],
		'tipos_caixa': [
			{
				'id': 1,
				'valor': `CAIXA`
			},
			{
				'id': 2,
				'valor': `BANDEJA`
			},
			{
				'id': 3,
				'valor': `CUBA RIM`
			}
		],
		'temperaturas': [
			{
				'id': 121,
				'valor': `121°C`
			},
			{
				'id': 134,
				'valor': `134°C`
			}
		],
		'categorias_uso': [
			{
				'id': 1,
				'valor': `Cirurgia Cardíaca`
			},
			{
				'id': 2,
				'valor': `Cirurgia Vascular`
			},
			{
				'id': 3,
				'valor': `Cirurgia Geral`
			},
			{
				'id': 4,
				'valor': `Cirurgia Neurológica`
			},
			{
				'id': 5,
				'valor': `Cirurgia Ortopédica`
			},
			{
				'id': 6,
				'valor': `Cirurgia Plástica`
			},
			{
				'id': 7,
				'valor': `Emergência`
			},
			{
				'id': 8,
				'valor': `Outros`
			}
		],
		'situacoes': [
			{
				'id': 1,
				'valor': `Ativo`
			},
			{
				'id': 2,
				'valor': `Inativo`
			},
			{
				'id': 3,
				'valor': `Em Revisão`
			}
		],
		'prioridades': [
			{
				'id': 1,
				'valor': `Urgente`
			},
			{
				'id': 2,
				'valor': `Alta`
			},
			{
				'id': 3,
				'valor': `Média`
			},
			{
				'id': 4,
				'valor': `Baixa`
			}
		],
		'criticidades': [
			{
				'id': 1,
				'valor': `Não Crítico`
			},
			{
				'id': 2,
				'valor': `Semicrítico`
			},
			{
				'id': 3,
				'valor': `Crítico`
			}
		]
	} as ICaixaOptionsResponse
}
