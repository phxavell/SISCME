import {CSSProperties} from "react"

export const FlexResponsiveRecebimento = `
flex
flex-column
xl:flex-row
w-full

pt-0
px-2
lg:px-0
`
export const styleContainerDireito = `
xl:w-12
w-full
p-0
px-0
`
export const styleContainerEsquerdo = `
h-full w-full

flex flex-row
align-items-start
justify-content-center


mb-3
mx-0
px-0

`
export const styleContainerEsquerdo2 = `
h-full
w-full
lg:w-full
flex flex-column
align-items-start
justify-content-top



mx-0
px-4

`
export const styleCell2_a = `
flex
h-full

lg:w-8
flex-column
m-0
p-0
pr-1

`
export const styleCell2 = `
flex
h-full
w-full
flex-column
m-0
p-0
pr-1

`
export const styleRecebimento4 = `
flex
h-3rem
justify-content-center
align-items-center
align-content-center

text-white
m-0
p-0
secundary-siscme
`
export const styleTabelas = `mt-0 text-sm w-full`

export const styleContainerRecebimento:CSSProperties = {
	height: `88vh`,
	overflowY: `auto`
}
