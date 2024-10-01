import {
	FileUpload,
	FileUploadHandlerEvent,
	ItemTemplateOptions
} from "primereact/fileupload"
import React, {useEffect, useRef} from "react"
import {
	chooseOptions, styleDialogAnexos, styleDialogOnlySave,
	stylesBotaoExcluirImg,
	stylesDivUploadImg
} from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/styles.ts"
import {Image} from "primereact/image"
import {Tag} from "primereact/tag"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"

// @ts-ignore
export const ModalAnexoDeEvidencias = ({files, setFiles, opeDialog, onClose}) => {

	const onTemplateRemove = (callback: any, fileToRemove: any) => {
		const updatedFiles = files?.filter((file: { name: any }) => file.name !== fileToRemove.name)
		setFiles(updatedFiles)
		callback()
	}
	const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
		const file = inFile as any
		return (
			<div className={stylesDivUploadImg}>
				<Image
					src={file.objectURL}
					alt={file.name}
					height={`180`}
					width={`180`}
					className='p-0'
				/>
				<Tag
					value={props.formatSize}
					severity="info"
				/>
				<Button
					label={`Remover`}
					size={`small`}
					icon="pi pi-times"
					className={stylesBotaoExcluirImg}
					onClick={() => onTemplateRemove(props.onRemove, inFile)}
				/>
			</div>

		)
	}

	const handleUpload = (event: FileUploadHandlerEvent) => {
		setFiles(event.files)
	}
	const uploadRef = useRef<FileUpload>(null)
	useEffect(() => {
		if (opeDialog && files.length) {

			setTimeout(() => {

				// @ts-ignore
				uploadRef.current.setFiles(files)
			}, 100)

		}
	}, [uploadRef, files, opeDialog])
	return (
		<Dialog
			className={styleDialogAnexos}
			header={`Anexo de evidências`}
			visible={opeDialog}
			onHide={onClose}
			position='center'
			modal={true}
			blockScroll={false}
			draggable={false}
			dismissableMask={true}
			closeOnEscape={true}
			pt={styleDialogOnlySave.pt}
			closeIcon={styleDialogOnlySave.icon}
			focusOnShow={false}
		>
			<FileUpload
				ref={uploadRef}
				style={{width: `40rem`}}
				className='mb-5'
				auto

				chooseOptions={chooseOptions}
				multiple
				itemTemplate={itemTemplate}
				customUpload
				uploadHandler={handleUpload}
				accept="image/*"
				emptyTemplate={<p className="m-0">Adicione as imagens das evidências.</p>}
			/>
		</Dialog>
	)

}
