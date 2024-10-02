import React from 'react'
import { Fieldset } from 'primereact/fieldset'
import '../style.css'
import {styleMainContent} from "@pages/general/Home/style.ts"
import {ProcessoEsterilizacao} from "@pages/general/Home/options-home/ProcessoEsterilizacao.tsx"
import {useHome} from "@pages/general/Home/useHome.ts"
import { GestaoPlantao } from "../options-home/GestaoPlantao"
import { FieldsetOptionsEnfermagem } from '../enums'

export function HomeEnfermagem() {
	const {
		handleMenu,
		optionsCollapsed
	} = useHome(FieldsetOptionsEnfermagem._Length)

	return (
		<div className={styleMainContent}>
			<Fieldset
				legend={ProcessoEsterilizacao.label}
				onToggle={e => {
					handleMenu(FieldsetOptionsEnfermagem.GerencimentoDeEsterilizacao, e.value)
				}}
				collapsed={optionsCollapsed[FieldsetOptionsEnfermagem.GerencimentoDeEsterilizacao]}
				toggleable
				className='p-0'>
				<ProcessoEsterilizacao/>
			</Fieldset>
			<Fieldset
				legend={GestaoPlantao.label}
				onToggle={e => {
					handleMenu(FieldsetOptionsEnfermagem.GestaoPlantao, e.value)
				}}
				collapsed={optionsCollapsed[FieldsetOptionsEnfermagem.GestaoPlantao]}
				toggleable
				className='p-0'>
				<GestaoPlantao/>
			</Fieldset>
		</div>
	)
}
