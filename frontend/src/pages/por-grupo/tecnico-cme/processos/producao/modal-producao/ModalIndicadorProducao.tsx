import {Dialog} from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import {useCallback, useEffect, useState} from "react"
import {IndicadoresAPI} from "@infra/integrations/administrativo/indicadores/indicadores.ts"
import { useAuth } from "@/provider/Auth"

// @ts-ignore
export const ModalIndicadorProducao = (props: any) => {

	const {
		opeDialog,
		onClose,
		setIndicador,
		indicador,
		setLabelIndicador
	} = props

	const {user} = useAuth()

	const [indicadores, setIndicadores] = useState<any>()

	const listarIndicadores = useCallback(() => {
		IndicadoresAPI.formOptions(user, `classe 05`).then((data) => {
			setIndicadores(data)
		}).catch(()=>{
		})
	}, [user])

	useEffect(() => {
		if(opeDialog){
			listarIndicadores()
		}
	}, [listarIndicadores,opeDialog ])

	const handleIndicadorChange = (e: any) => {
		const selectedIndicador = e.value
		setIndicador(selectedIndicador)
		setLabelIndicador(selectedIndicador?.valor)
	}
	return (
		<Dialog
			header={`Selecione um indicador`}
			style={{width: `35vw`}}
			visible={opeDialog}
			onHide={onClose}
			position='center'
			modal={true}
			blockScroll={false}
			draggable={false}
			dismissableMask={true}
			closeOnEscape={true}
			closeIcon='pi pi-save text-green-500'
			focusOnShow={false}
		>
			<Dropdown
				filter
				className="w-full mt-2"
				placeholder="Selecionar Indicador"
				value={indicador}
				onChange={handleIndicadorChange}
				emptyFilterMessage='Nenhum resultado encontrado.'
				emptyMessage='Nenhum resultado encontrado.'
				options={indicadores?.data ?? []}
				optionLabel="valor"
				showClear
			/>

		</Dialog>
	)

}
