import React from 'react'
import {Fieldset} from 'primereact/fieldset'
import '../style.css'
import {styleMainContent} from '@pages/general/Home/style.ts'
import {ProcessoEsterilizacao} from '@pages/general/Home/options-home/ProcessoEsterilizacao.tsx'
import {useHome} from '@pages/general/Home/useHome.ts'
import {GerenciamentoDeDemandas} from '@pages/general/Home/options-home/GerenciamentoDeDemandas.tsx'
import { FieldsetOptionsTecnico } from '../enums'

export function HomeTecnico() {

	const {
		handleMenu,
		optionsCollapsed,
	} = useHome(FieldsetOptionsTecnico._Length)

	return (
		<div className={styleMainContent}>
			<Fieldset
				legend={`Processo de Esterilização`}
				onToggle={e => {
					handleMenu(FieldsetOptionsTecnico.GerencimentoDeEsterilizacao, e.value)
				}}
				collapsed={optionsCollapsed[FieldsetOptionsTecnico.GerencimentoDeEsterilizacao]}
				toggleable
				className='p-0'>
				<ProcessoEsterilizacao/>
			</Fieldset>
			<Fieldset
				onToggle={e => {
					handleMenu(FieldsetOptionsTecnico.GerencimentoDeDemandas, e.value)
				}}
				collapsed={optionsCollapsed[FieldsetOptionsTecnico.GerencimentoDeDemandas]}
				legend={GerenciamentoDeDemandas.label}
				toggleable
				className='p-0'>
				<GerenciamentoDeDemandas/>
			</Fieldset>

		</div>
	)
}
