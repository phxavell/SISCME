import {
	styleColumnHeader,
	styleContentHeaderRecebimento,
	styleConteudo1,
	styleConteudo2,
	styleEvidencias,
	styleHeaderColumnFill,
	styleRowCenter,
	styleRowCenterHeader,
	stylesDivider,
	styleTitle1,
	styleTitle2,
} from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/styles.ts"
import RenderObject from "@/components/RenderObject.tsx"
import { InputCaixaModal } from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/InputCaixaModal.tsx"
import {useCallback, useState} from "react"

import { THeaderConferenciaRecebimento } from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/schemas.ts"
import { Button } from "primereact/button"
import { Badge } from "primereact/badge"
import { ModalAnexoDeEvidencias } from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/ModalAnexoDeEvidencias.tsx"
import { HeaderShowMessage } from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/HeaderShowMessage.tsx"
import { ModalIndicadorProducao } from "../../producao/modal-producao/ModalIndicadorProducao"

export const HeaderModalConferencia: THeaderConferenciaRecebimento = (props) => {
	const {
		conteudo,
		openDialog,
		itensCaixaChecada,
		hadleSubmitInput,
		focusAtual,

		indicador,
		setIndicador,
		isProducao
	} = props
	const [files, setFiles] = useState<File[]>([])
	const [openAnexar, setOpenAnexar] = useState(false)
	const [openIndicador, setOpenIndicador] = useState(false)
	const [labelButtonIndicador, setLabelButtonIndicador] = useState(undefined)

	const handleClick = useCallback(async (v: any) => {
		hadleSubmitInput(v, files)
	}, [files, hadleSubmitInput])

	const templateIndicadores = useCallback(() => {
		if(isProducao) {//indicadores
			return (
				<Button
					label={labelButtonIndicador ?? `Selecione um indicador`}
					outlined
					//TODO => REMOVER HIDDEN QUANDO INDICADORES ENTRAR
					className={`border-white text-white hidden`}
					onClick={() => {
						setOpenIndicador(true)
					}}
				/>
			)
		}
	}, [setOpenIndicador, labelButtonIndicador, isProducao])

	return (
		<div className={styleColumnHeader}>
			<div className={styleContentHeaderRecebimento}>
				<div className={styleHeaderColumnFill}>
					<div className={styleRowCenter}>
						<div className={styleRowCenter}>
							<div className={styleTitle1}>Serial:</div>
							<div className={styleConteudo1}>
								<RenderObject
									data={conteudo}
									keyObject="serial"
								/>
							</div>
						</div>
						<div className={styleRowCenter}>
							<div className={styleTitle1}>Quantidade:</div>
							<div className={styleConteudo1}>
								<RenderObject
									data={conteudo}
									keyObject="total_itens"
								/>
							</div>
						</div>
					</div>
					<div className={styleRowCenter}>
						<div className={styleTitle2}>Cliente:</div>
						<div className={styleConteudo2}>
							<RenderObject data={conteudo} keyObject="cliente" />
						</div>
					</div>
				</div>
				<div className={styleRowCenterHeader}>
					{templateIndicadores()}
					<Button
						label={`Evidências`}
						outlined
						icon={`pi pi-images`}
						iconPos={`right`}
						className={styleEvidencias}
						onClick={() => {
							setOpenAnexar(true)
						}}
					>
						<Badge value={files?.length} size={`large`} />
					</Button>
					<HeaderShowMessage itensCaixaChecada={itensCaixaChecada} />
					<InputCaixaModal
						showModal={openDialog}
						handleInput={handleClick}
						focusAtual={focusAtual}
						modalIndicador={openIndicador}
					/>
				</div>
			</div>
			<div className={stylesDivider} style={{ height: `2px` }}></div>
			<ModalAnexoDeEvidencias
				files={files}
				onClose={() => {
					setOpenAnexar(false)
				}}
				opeDialog={openAnexar}
				setFiles={setFiles}
			/>

			<ModalIndicadorProducao
				onClose={() => {
					setOpenIndicador(false)
				}}
				opeDialog={openIndicador}
				indicador={indicador}
				setIndicador={setIndicador}
				setLabelIndicador={setLabelButtonIndicador}
			/>
		</div>
	)
}
