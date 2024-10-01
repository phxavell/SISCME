import React from 'react'
import '../style.css'
import {styleMainContent} from "@pages/general/Home/style.ts"
import { useHome } from '../useHome'
import { Fieldset } from 'primereact/fieldset'
import { GerenciamentoRelatorios } from '../options-home/GerenciamentoDeRelatorios'
import { FieldsetOptionsGerencia } from '../enums'

export function HomeGerencia() {
	const {
		handleMenu,
		optionsCollapsed
	} = useHome(FieldsetOptionsGerencia._Length)

	return (
		<div className={styleMainContent}>
			<Fieldset
				legend={GerenciamentoRelatorios.label}
				onToggle={e => {
					handleMenu(FieldsetOptionsGerencia.GerenciamentoRelatorios, e.value)
				}}
				collapsed={optionsCollapsed[FieldsetOptionsGerencia.GerenciamentoRelatorios]}
				toggleable
				className='p-0'>
				<GerenciamentoRelatorios/>
			</Fieldset>
		</div>
	)
}
