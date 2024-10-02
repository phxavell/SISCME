import React, {useCallback, useEffect, useMemo} from 'react'
import {Controller, useFieldArray} from "react-hook-form"
import {
	classImgPreviewInput,
	styleBtnUploadInput,
	stylesBtnLimparInput,
	stylesImgInput,
	stylesNameImgSelecionado
} from "@/components/input-file/styles.ts"

interface IPropsInputFile {
    name: any
    type: any
    control: any
    watch: any
    register?: any
    id?: string
}

export const InputFile: React.FC<IPropsInputFile> = (props) => {
	const {
		name,
		type, id,
		watch,
		control
	} = props
	//const {onChange, ref, name: nomeDoR,} = register(name)
	const {fields, append, remove, update} = useFieldArray({
		control,
		name: name
	})

	const watchFieldArray = watch(name)
	const controlledFields = fields?.map((field, index) => {
		if (watchFieldArray && watchFieldArray[index]) {
			return {
				...field,
				...watchFieldArray[index]
			}
		} else {
			return {
				...field,

			}
		}
	})

	const validationNameFile = (fileName: string) => {
		if (fileName.length > 20) {
			return fileName.substring(0, 20) + `...`
		}

		return fileName
	}


	useEffect(() => {
		///console.log(fields)
		if (fields.length === 0) {
			//eslint-disable-next-line
			append({files: []})
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fields])

	const idInput = useMemo(() => {
		if (id) {
			return id
		}
		//console.log('erorro de render inicial')
		return `input-file-id`

	}, [id])

	//@ts-ignore
	const handleClickFile = () => {
		document.getElementById(idInput)?.click()
	}

	const styleDivImgMemo = useMemo(() => {
		return `
        ${controlledFields[0]?.files?.length?`bg-transparent `: `bg-white` }
        border-dotted
        border-blue-800
        ${stylesImgInput}
        `
	}, [controlledFields])

	const showImgOrButton = useMemo(() => {
		const fileList = controlledFields[0]?.files
		if (fileList?.length) {
			const imgPreview = URL.createObjectURL(fileList[0])
			if (fileList) {
				return (
					<img
						src={imgPreview}
						className={classImgPreviewInput}
						alt='foto veículo'
					/>
				)
			}
		}

		return (
			<div><i className={styleBtnUploadInput}> Upload</i></div>
		)
	}, [controlledFields]
	)

	const showIconClear = useCallback((onc: any, fieldHook: any) => {
		const fileList = fieldHook.value
		if (fileList?.length) {
			const fileImg = fileList[0]
			if (fileImg) {
				return (
					<div className={stylesBtnLimparInput} >
						<span className={stylesNameImgSelecionado}
							style={{
								marginLeft: `0`,
								marginTop: `0`,
								width:`162px`
							}}
							onClick={(e)=> {
								e.preventDefault()
								e.stopPropagation()
							}}
						>
							{validationNameFile(fileImg?.name)}
						</span>
						<i className='pi pi-trash cursor-pointer text-white  mt-0'
							// @ts-ignore
							onClick={handleClearFileVehicle(onc)}></i>
					</div>
				)
			}
		}
		return <></>
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch(name), fields[0]])

	// ✅ Better solution: the remove action is happened after the second render
	React.useEffect(() => {
		remove(0)
	}, [remove])

	const handleClearFileVehicle = useCallback(() => (e: any) => {
		e.preventDefault()
		e.stopPropagation()
		update(0, {
			...controlledFields[0],
			files: []
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fields, remove])

	return (
		<div className='flex flex-column w-12rem '>
			<div
				className={styleDivImgMemo}
				onClick={handleClickFile}
			>
				{showImgOrButton}
				{fields.map((field, index) => (
					<div key={field.id}>
						<Controller
							render={({field: fieldHook}) => (
								<>
									<input
										id={`foto`}
										ref={fieldHook.ref}
										name={`foto.${index}.files`}
										onChange={(e) => {
											fieldHook.onChange(e?.target?.files)
										}}
										placeholder="Upload an Image"
										accept={type}
										hidden
										type="file"
									/>
									{showIconClear(fieldHook.onChange, fieldHook)}
								</>
							)}
							name={`foto.${index}.files`}
							control={control}
						/>
					</div>
				))}
			</div>
		</div>
	)
}
