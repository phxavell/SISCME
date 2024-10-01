import {colorTitleAndIconModalAlertStyle} from "./helps.ts"
import {TMessageAlert} from "@/components/modals/ModalMessagemApi/types.ts"

export const divContentModalAlertStyle = `
w-full
flex
flex-column
justify-content-center
align-items-center
gap-3
`
export const divHeaderModalAlertStyle = (messageErrorApi: TMessageAlert) => `
h-2rem
w-full
m-0
${colorTitleAndIconModalAlertStyle(messageErrorApi)?.backgrond}
border-2
${colorTitleAndIconModalAlertStyle(messageErrorApi)?.border}
border-round-top
`
export const iconModalAlertStyle = (messageErrorApi: TMessageAlert) => `
mt-2
border-round-md
pi
pi-exclamation-triangle
shadow-6
 ${colorTitleAndIconModalAlertStyle(messageErrorApi)?.backgrond}
 text-white
 p-2
 text-center
 text-8xl
 `
export const titleModalAlertStyle = (messageErrorApi: TMessageAlert) => `
m-0 ${colorTitleAndIconModalAlertStyle(messageErrorApi)?.textColor}
text-5xl`
export const styleHeaderMessageApi = {
	width: `30vw`,
	boxShadow: `0px 9px 46px 8px rgba(0, 0, 0, 0.356),
                0px 24px 38px 3px rgba(0, 0, 0, 0.360),
                0px 11px 15px rgba(0, 0, 0, 0.342)`

}
export const styleContentMessageAPI = `
m-0
text-center
text-gray-600
w-10
modal-description
`
