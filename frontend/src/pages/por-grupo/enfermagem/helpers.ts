export const descricaoFormatadaHelp = ({
	coordenacao,
	enfermeiro_expurgo,
	enfermeiro_preparo,
	enfermeiro_distribuicao,
	tecnico_expurgo,
	tecnico_instrumental,
	tecnico_ventilatorio,
	tecnico_autoclave,
	tecnico_producao,
	tecnico_distribuicao,
	folgas,
	faltas,
	ferias,
	licenca_medica,
	licenca_maternidade,
	atestado

}: any) => {
	return `
        PLANTÃO    /  /

        COORDENAÇÃO: ${coordenacao}

        * ENFERMEIRO POR SETOR:
        EXPURGO: ${enfermeiro_expurgo}
        PREPARO: ${enfermeiro_preparo}
        DISTRIBUIÇÃO: ${enfermeiro_distribuicao}

        TÉCNICOS DE ENFERMAGEM POR SETOR:
        * EXPURGO: ${tecnico_expurgo}
        * INSTRUMENTAL: ${tecnico_instrumental}
        * VENTILATÓRIO: ${tecnico_ventilatorio}
        * AUTOCLAVE: ${tecnico_autoclave}
        * PRODUÇÃO: ${tecnico_producao}
        * DISTRIBUIÇÃO: ${tecnico_distribuicao}

        * FOLGAS: ${folgas}

        * FALTAS: ${faltas}

        * FÉRIAS: ${ferias}

        LICENÇA MÉDICA: ${licenca_medica}

        LICENÇA MATERNIDADE: ${licenca_maternidade}

        ATESTADO: ${atestado}

        RECEBIMENTO DE PLANTÃO


        -----------------------X---------------------------------------------------------------------------X------------------------
        >>DESCRIÇÃO SETOR RECEPÇÃO E LIMPEZA<<



        INFORMAÇÕES DECORRENTES DO PLANTÃO:



        -----------------------X---------------------------------------------------------------------------X------------------------
        >>DESCRIÇÃO SETOR PREPARO<<



        INFORMAÇÕES DECORRENTES DO PLANTÃO:



        -----------------------X---------------------------------------------------------------------------X------------------------
        >>DESCRIÇÃO SETOR DISTRIBUIÇÃO<<



        INFORMAÇÕES DECORRENTES DO PLANTÃO:
    `
}
