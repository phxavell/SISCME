import {styleForm} from '@pages/general/Login/style.ts'
import {Button} from 'primereact/button'
import {useState} from 'react'
import {Dialog} from 'primereact/dialog'
import {useModalEmbalagem} from './useModalEmbalagem.ts'
import {Input} from '@/components/Input.tsx'
import {Errors} from '@/components/Errors.tsx'
import {MiniModal} from '@/components/MiniModal'
import {ModalEmbalagemProps} from "@pages/por-grupo/administrativo/especificoes/embalagem/types.ts"
import { buttonCheck } from '@/util/styles/buttonAction.ts'

export function ModalEmbalagem(props: ModalEmbalagemProps) {
	const { visible, onClose } = props
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const {
		handleSubmitEmbalagem,
		handleSubmit,
		register,
		salvando,
		errors,
		isDirty,
		reset
	} = useModalEmbalagem(props)
	const confirmarFecharModal = () => {
		if (isDirty) {
			setMiniModalVisible(true)
		} else {
			onClose(false)
			reset()
		}
	}
	return (
		<>
			<MiniModal
				miniModalVisible={miniModalVisible}
				setMiniModalVisible={setMiniModalVisible}
				reset={reset}
				onClose={() => onClose(false)}
			/>
			<Dialog
				header='Nova Embalagem'
				visible={visible}
				data-testid="modal-embalagem"
				style={{ width: `50vw` }}
				dismissableMask={true}
				closeOnEscape={true}
				focusOnShow={false}
				draggable={false}
				resizable={false}
				onHide={() => {confirmarFecharModal()}}
			>
				<form
					className={styleForm + `flex justify-content-center`}
					onSubmit={handleSubmit(handleSubmitEmbalagem)}
				>
					<div className="mt-2 flex gap-2 w-full">
						<div className='w-12'>
							<Input
								placeholder='Descrição'
								autoFocus={true}
								{...register(`descricao`)}
							/>
							{errors.descricao && <Errors message={errors.descricao.message} />}
						</div>
						<div className='w-5'>
							<Input
								placeholder='Valor'
								{...register(`valorcaixa`)}
							/>
							{errors.valorcaixa && <Errors message={errors.valorcaixa.message} />}

						</div>
					</div>

					<div className="flex justify-content-center">
						<Button
							icon={buttonCheck.icon}
							className={`${buttonCheck.color} mt-5`}
							loading={salvando}
							data-testid="botao-cadastrar-embalagem"
							label={`Cadastrar`}
							type='submit'
						/>
					</div>

				</form>

			</Dialog>
		</>
	)
}
