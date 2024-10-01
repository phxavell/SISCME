import {TMessageAlert} from "@/components/modals/ModalMessagemApi/types.ts"

export const colorTitleAndIconModalAlertStyle = (msgType: TMessageAlert) => {
	if ( msgType === TMessageAlert?.Alert) {
		return {
			backgrond: `bg-yellow-500`,
			textColor: `text-yellow-500`,
			border: `border-yellow-500`
		}
	}
	if (msgType === TMessageAlert?.Error) {
		return {
			backgrond: `bg-red-500`,
			textColor: `text-red-500`,
			border: `border-red-500`
		}
	}
	//Success
	return {
		backgrond: `bg-green-500`,
		textColor: `text-green-500`,
		border: `border-green-500`
	}

}
