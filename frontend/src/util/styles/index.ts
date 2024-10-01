import './style.css'

import LogoBringel from "@/assets/outras-logos/BRINGEL-SLOGAN.png"
import LogoSISCME from "@/assets/logo/SISCME-Logo.png"
import LogoBioplus from "@/assets/outras-logos/bioplus-slogan.png"

import LogoBP64 from "@/assets/logos/logos-bp-64px.png"
import LogoBP128 from "@/assets/logos/logos-bp-126px.png"
import LogoBP192 from "@/assets/logos/logos-bp-192px.png"

import logoSISCME from "@/assets/logos/logos-siscme-240px.png"
import LogoBioPlus64 from "@/assets/logos/selos-bioplus-64px.png"
import LogoBioPlus126 from "@/assets/logos/selos-bioplus-126px.png"
import LogoBioPlus192 from "@/assets/logos/selos-bioplus-192px.png"
import LogoGB64 from "@/assets/logos/logos-bringel-64px.png"
import LogoGB128 from "@/assets/logos/logos-bringel-126px.png"
import LogoGB192 from "@/assets/logos/logos-bringel-192px.png"
import LogoNameSISCME240 from "@/assets/logos/SISCME_name.png"

import SeloBP64 from "@/assets/logos/selos-bp-64px.png"
import SeloBP128 from "@/assets/logos/selos-bp-126px.png"
import SeloBP192 from "@/assets/logos/selos-bp-192px.png"
import SeloBPHalf180 from "@/assets/logos/selo-bp-half-192px.png"
import LogoSISCMEVertical from "@/assets/logos/Logo-SISCME-vertical.png"

import LogoGovAM from "@/assets/logos/logo-gov-am.png"
import React from "react"

export const styleFlexRow = `
flex
flex-row
`
export const styeleFlexRowCenter = `
${styleFlexRow}
justify-content-center
align-items-center
`

export const flexScreenCenter = `
flex
w-screen
h-screen
justify-content-center
align-items-center
`

export const titleFlexCss = `
m-0
p-0
mb-4
text-blue-600
text-4xl
`

export const headerTableStyle = {
	backgroundColor: `#204887`,
	color: `#fff`
}
export const headerTableStyleError = {
	backgroundColor: `#EF4444`,
	color: `#fff`
}

export const ContainerFlexColumnDiv = `
w-full
flex
flex-column
align-items-center
text-center
pt-0
px-2
sm:px-3
md:px-4
`
export const ContainerColumnPx = `
w-full
flex
flex-column

align-items-center
text-center
pt-0
px-2
sm:px-3
md:px-5
`
export const FlexResponsive2 = `
w-full
flex
flex-column
lg:flex-row
align-items-top
justify-content-start
h-full
text-center
pt-0
px-2
sm:px-3
md:px-5
lg:px-0
`
export const divButtonBackAndTitle = `
w-full
flex
justify-content-center
align-items-center
text-2xl
`

export const buttonBack = `
h-3rem
bg-blue-600
border-round-3xl
hover:bg-blue-800
absolute
left-0
ml-5
`

export const backArrowIcon = `pi pi-arrow-left text-xl`

export const getCorDeSituacao = (situacao: string) => {
	switch (situacao) {
	case `Aguardando Coleta`:
		return {
			background: `#EF4444`
		}
	case `Processando`:
		return {
			background: `#6366f1`
		}
	case `Entregue`:
		return {
			background: `#22c55e`
		}
	case `Em Transporte`:
		return {
			background: `#22c55e`
		}

	default:
		return {
			background: `#014983`
		}

	}
}

export {
	LogoBringel,
	LogoSISCME,
	LogoBioplus,
	LogoBP192,
	LogoBP128,
	LogoBP64,

	SeloBP64,
	SeloBP128,
	SeloBP192,

	LogoBioPlus64,
	LogoBioPlus126,
	LogoBioPlus192,
	SeloBPHalf180,

	LogoGB64,
	LogoGB128,
	LogoGB192,
	LogoNameSISCME240,

	logoSISCME,
	LogoGovAM,
	LogoSISCMEVertical

}

export const divContainerForm = `flex gap-5 justify-content-between`

export const divSectionForm = `
flex
flex-column
gap-5
w-full
`

export const styleSectionBorder = `
${divSectionForm}
pr-5
border-right-1
border-600
`

export const titleStyle = `
text-2xl
sm:text-base
md:text-lg
lg:text-xl
text-blue-600
text-center
my-3
`

export const titleStyle2 = `
text-2xl
sm:text-base
md:text-lg
lg:text-xl
text-white-600
mt-0
mb-2
`

export const styleCard = `
flex-grow-1
p-0
bg-gradiente-maximum-compatibility-reverse
text-white
`

export const divSectionFormTerm = `flex flex-column wrap`


export const styleContentCard = `
    p-2
    border-round-xl
    bg-gradiente-maximum-compatibility
    col-12
    w-full
    text-white
    my-2
    border-round-sm
    `
export const styleInfor = `
    flex flex-row
    `
export const styleTitle = `
    text-white font-bold mr-1
    `

export const styleNotShowMobile = `
    md:flex
    mt-2
    hidden
    xs:hidden
`
export const styleShowMobile = `
    mt-2
    relative
    gap-2
    md:hidden
    xs:flex
    xs:flex-column
   `

export const classHeaderCard = `
flex
align-items-center
justify-content-between
p-4
py-3
text-gray-200
`

export const heigthTable = `395px`
export const heigthTable2 = `500px`

export const styleTable: React.CSSProperties = {
	minWidth: `100px`,
	height: heigthTable,
	display: `flex`,
	backgroundColor: `#fdfdfd`,
	flexDirection: `column`,
	flexWrap: `nowrap`,
	alignItems: `stretch`,
}

export const heigthTableView = `300px`

export const styleTableView: React.CSSProperties = {
	minWidth: `100px`,
	height: heigthTableView,
	display: `flex`,
	backgroundColor: `#fdfdfd`,
	flexDirection: `column`,
	flexWrap: `nowrap`,
	alignItems: `stretch`,
}

export const styleMessage = {
	borderLeft: `6px solid #1d1f97`,
	borderWidth: `0 0 0 6px`,
	color: `#fff`,
	backgroundColor: `transparent`
}

export const styleMessageChart = (bgColor: string, borderColor: string) => {
	return {
		borderLeft: `6px solid ${borderColor}`,
		borderWidth: `0 0 0 6px`,
		color: `#fff`,
		backgroundColor: bgColor,
		fontSize: `25px`,
		fontWeight: `bold`
	}
}

export const styleContentHeader = `
    flex
    justify-content-between
    align-content-center
`

export const styleColumn = `
    p-2
`

export const styleColumn2 = `
	px-4 py-0
`

export const avatarClassName = `
p-overlay-badge
transition-colors
transition-duration-400
w-full`
export const divNewAndSearchButton = `
flex
align-items-center
justify-content-center
gap-3
my-3
`
