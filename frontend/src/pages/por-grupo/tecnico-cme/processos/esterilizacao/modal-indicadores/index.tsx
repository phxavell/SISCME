import React, { useCallback } from "react"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { styleActionHeader } from "@/components/RowTemplate"
import { Button } from "primereact/button"
import { styleHeaderTitle } from "@/pages/por-grupo/administrativo/cruds/caixa/styles-caixa"
import { useModalIndicadores } from "./useModalIndicadores"

interface ModalIndicadoresProps {
    visible: boolean;
    onClose: any
	values: any
	onCloseIniciar: any
}

export const ModalIndicadores = (
	{
		visible,
		onClose,
		values,
		onCloseIniciar
	}: ModalIndicadoresProps
) => {
	const {
		indicadores,
		indicador, setIndicador,
		handleIniciarEsterilizacaoTeste
	} = useModalIndicadores(values, onCloseIniciar)

	const templateHeader = useCallback(() => {
		return (
			<div className={styleHeaderTitle}>
				<div className="text-md md:text-2xl mr-5">
                	Selecionar um indicador
				</div>
				<Button
					onClick={handleIniciarEsterilizacaoTeste}
					label="Iniciar ciclo de teste"
					className={styleActionHeader(`green`, `600`, `400`) + `h-3rem mr-2`}
					style={{ color: `white` }}
				/>
			</div>

		)
	}, [handleIniciarEsterilizacaoTeste])

	return (
		<Dialog
			style={{ width: `48vw` }}
			data-testid='esterilizacao-modal'
			header={templateHeader}
			draggable={false}
			resizable={false}
			dismissableMask={true}
			closeOnEscape={true}
			onHide={() => {
				onClose()
			}}
			contentClassName="flex justify-content-center"
			visible={visible}
			position="top"
		>
			<Dropdown className="w-30rem mt-1"
				value={indicador}
				emptyMessage='Nenhum resultado encontrado.'
				emptyFilterMessage='Nenhum resultado encontrado.'
				onChange={(e) => {
					setIndicador(e.value)
				}}
				filter
				placeholder="Selecione um indicador"
				options={indicadores}
				optionLabel='valor'
				optionValue="id"
			/>

		</Dialog>
	)
}
