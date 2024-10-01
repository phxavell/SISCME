export const styleTitle1 = `
flex
font-semibold
text-xl
`
export const styleTitle2 = `
flex
font-semibold
text-base`

export const styleConteudo1 = ` text-white font-bold text-xl mr-2`
export const styleConteudo2 = `text-white font-semibold text-base mr-2`
export const styleRowCenter = `
flex
flex-row
align-items-center
gap-1
`
export const stylesDivUploadImg = `
flex
flex-column
gap-2
`
export const stylesBotaoExcluirImg = `
p-button-outlined

p-button-danger
text-center
 align-items-center
py-0
my-0
h-2rem
`

export const stylesDivider = `
mx-0
bg-gradiente-maximum-compatibility
my-1
`
export const stylesDivGrid = `
w-full
overflow-y-auto
overflow-x-hidden
h-full`
export const chooseOptions = {
	icon: `pi pi-fw pi-camera`,
	iconOnly: true,
	className: `custom-choose-btn p-button-rounded p-button-outlined`,
}
export const styleInputNumberRecebimento = `
flex
flex-column
gap-0
align-items-center
`
export const styleTitleFildset = `
flex
font-semibold
text-sm
w-full
mr-0
h-4rem
px-3
py-1
border-none
text-overflow-ellipsis
overflow-hidden
text-left
`

export const ptExpandFieldset = {
	legend: {
		className: styleTitleFildset,
	},
	root: {
		className: `border-none border-round`,
	},
}
export const styleRecebimentoItem = (item: any) => {
	return `
w-18rem
my-2
h-9rem
align-items-end
flex
${!item.check ? `greenStyle` : ``}
`
}
export const styleHeaderColumnFill = `
flex
flex-column
h-full
justify-content-between
`
export const styleEvidencias = `
h-3rem
w-12rem
px-2
text-white
mr-auto
lg:mr-0
`
export const efeitoIn = ` flipright animation-duration-100`
export const efeitoOut = ` zoomindown`
export const styleMessageHeader = `text-base `
export const styleContentHeaderRecebimento = `
flex
flex-column
lg:flex-row
justify-content-between
gap-2
`
export const styleRowCenterHeader = `
flex
flex-row
h-full
w-full
align-items-center
justify-content-end
gap-2
`
export const styleColumnHeader = `flex flex-column`
export const styleGridItens = { height: `75vh` }
export const classesGridItens = `
grid
justify-content-center
gap-1
`
export const styleDialogConferencia = `
w-full
h-full
flex
flex-column
`
export const styleDialogAnexos = `
flex
flex-column
overflow-hidden
`
export const styleDialogOnlySave = {
	icon: `pi pi-save`,
	pt: {
		closeButtonIcon: {
			className: ``,
		},
		headerIcons: {
			className: ``,
		},
		closeButton: {
			className: `
					bg-green-500
					hover:bg-green-500
					h-2rem
					w-2rem
					 `,
		},
	},
}
export const styleDialogRecebimento = {
	pt: {
		closeButtonIcon: {
			className: ``,
		},
		headerIcons: {
			className: `ml-2`,
		},
		closeButton: {
			className: ``,
		},
	},
}
