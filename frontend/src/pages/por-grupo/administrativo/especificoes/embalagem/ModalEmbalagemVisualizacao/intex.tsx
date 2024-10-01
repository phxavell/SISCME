import {Dialog} from 'primereact/dialog'
import {useMemo} from 'react'
import moment from 'moment'

import RenderObject from '@/components/RenderObject.tsx'
import {ModalPropsEmbalagem} from "@pages/por-grupo/administrativo/especificoes/embalagem/types.ts"

export function ModalEmbalagemVisualizacao({ visible, onClose, embalagemData }: ModalPropsEmbalagem) {

	const idSetor = `#${embalagemData.id}`
	const dataAtualizacao = moment(embalagemData.atualizado_em)
		.format(`DD/MM/YYYY HH:mm`)
	const dataCriacao = moment(embalagemData.criado_em)
		.format(`DD/MM/YYYY HH:mm`)

	const criadoPor = embalagemData?.criado_por
	const valor = parseFloat(embalagemData?.valorcaixa)

	const valorFormatado = new Intl.NumberFormat(`pt-br`,
		{style: `currency`, currency: `BRL`}).format(valor)

	const atualizadoPor = embalagemData?.atualizado_por

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
			data-testid="modal-visualizar-embalagem"
			style={{ width: `50vw` }}
			dismissableMask={true}
			closeOnEscape={true}
			focusOnShow={false}
			draggable={false}
			resizable={false}
			onHide={() => {
				onClose(false)
			}}
		>
			<div className="w-full">
				<div className="w-full flex flex-row ">
					<div className="w-full flex flex-column gap-3">
						<h3 className="flex flex-row justify-content-between p-0 m-0">
							<div className="flex flex-row">
                                Descrição:<div className="ml-2 font-normal">{embalagemData?.descricao} </div>
							</div>
							<div className="flex flex-row">
                            Valor:<div className="ml-2 font-normal">{valorFormatado}</div>
							</div>
						</h3>
						{CriadoPor}
						{AtualizadoPor}
					</div>
				</div>
			</div>
		</Dialog>
	)
}
