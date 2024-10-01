import { Dialog } from 'primereact/dialog'
import { useMemo } from 'react'
import moment from 'moment'
import { ProfissaoProps } from '..'
import RenderObject from '@/components/RenderObject'


export interface ModalPropsProfissional {
    visible: boolean
    onClose: (prop: boolean) => void
    profissaoData: ProfissaoProps
}
export function ModalProfissaoVisualizacao({ visible, onClose, profissaoData }: ModalPropsProfissional) {
	const idSetor = `#${profissaoData.id}`
	const dataAtualizacao = moment(profissaoData.atualizado_em)
		.format(`DD/MM/YYYY HH:mm`)
	const dataCriacao = moment(profissaoData.criado_em)
		.format(`DD/MM/YYYY HH:mm`)

	const criadoPor = profissaoData?.criado_por

	const atualizadoPor = profissaoData?.atualizado_por

	const CriadoPor = useMemo(() => {

		if (criadoPor?.nome) {
			return (
				<div className="flex flex-row justify-content-between">
					<h3 className="flex flex-row p-0 m-0">
                        Criado por: <div className="ml-2 font-normal"><RenderObject data={criadoPor} keyObject='nome' /></div>
					</h3>
					<h3 className="flex flex-row p-0 m-0 font-normal">Em: {dataCriacao}</h3>
				</div>
			)
		} else {
			return (
				<div className="flex flex-row justify-content-between">
					<h3 className="flex flex-row p-0 m-0">
                        Criado por: <div className="ml-2 font-normal"><RenderObject data={criadoPor} keyObject='nome' /></div>
					</h3>
				</div>
			)
		}

	}, [criadoPor, dataCriacao])
	const AtualizadoPor = useMemo(() => {
		if (atualizadoPor?.nome) {
			return (
				<div className="flex flex-row justify-content-between">
					<h3 className="flex flex-row p-0 m-0">
                        Atualizado por: <div className="ml-2 font-normal"><RenderObject data={atualizadoPor} keyObject='nome' /></div>
					</h3>
					<h3 className="flex flex-row p-0 m-0 te font-normal">Em: {dataAtualizacao}</h3>
				</div>
			)
		} else {
			return (
				<div className="flex flex-row justify-content-between">
					<h3 className="flex flex-row p-0 m-0">
                        Atualizado por: <div className="ml-2 font-normal"><RenderObject data={atualizadoPor} keyObject='nome' /></div>
					</h3>
				</div>
			)
		}
	}, [atualizadoPor, dataAtualizacao])
	return (
		<Dialog
			header={idSetor}
			visible={visible}
			data-testid="modal-profissao"
			style={{ width: `50vw` }}
			draggable={false}
			resizable={false}
			onHide={() => {
				onClose(false)
			}}
		>
			<div className="w-full">
				<div className="w-full flex flex-row ">
					<div className="w-full flex flex-column gap-3">
						<h3 className="flex flex-row p-0 m-0">Descrição: <div className="ml-2 font-normal">{profissaoData?.descricao}</div></h3>
						{CriadoPor}
						{AtualizadoPor}
					</div>
				</div>
			</div>
		</Dialog>
	)
}
