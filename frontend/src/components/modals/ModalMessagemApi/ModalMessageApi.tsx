import {Dialog} from "primereact/dialog"
import {ProgressBar} from "primereact/progressbar"
import {
	divContentModalAlertStyle,
	divHeaderModalAlertStyle,
	iconModalAlertStyle, styleContentMessageAPI,
	styleHeaderMessageApi,
	titleModalAlertStyle
} from "./styles.ts"
import {IMessagemApi} from "@/components/modals/ModalMessagemApi/types.ts"
import { useEffect, useState } from "react"
import  "./style.css"
export const ModalMessageApi = (props: IMessagemApi) => {

	const [valueProgressBar, setValueProgressBar] = useState(100)
	const {

		visibleModalError,
		setVisibleModalError,

		messageErrorApi,
	}= props



	useEffect(() => {
		const handleKeyDown = (event: any) => {
			if(visibleModalError) {
				if (event.key === `Escape`) {
					setVisibleModalError(false)
				}
			}
		}
		document.addEventListener(`keydown`, handleKeyDown)
		let interval: any
		let intervalModal: any
		if(visibleModalError) {
			const decreaseProgressBar = () => {
				setValueProgressBar((prevValue) => {
					if (prevValue === 0) {
						return prevValue
					}

					return prevValue - 25
				})
			}
			setTimeout(()=> {
				decreaseProgressBar()
			}, 200)
			interval = setInterval(() => decreaseProgressBar(), 1000)

			return () => {

				clearInterval(interval)
				clearInterval(intervalModal)
				document.removeEventListener(`keydown`, handleKeyDown)
			}
		}
	  }, [visibleModalError,setVisibleModalError])

	useEffect(()=>{
		if(valueProgressBar===0){
			setTimeout(()=> {
				setVisibleModalError(false)
				setValueProgressBar(100)
			}, 800)

		}
		return ()=> {
		}
	}, [valueProgressBar, setVisibleModalError])

	if(!messageErrorApi){
		return <></>
	}
	return (
		<Dialog
			visible={visibleModalError}
			resizable={false}
			draggable={false}
			header={<div className={divHeaderModalAlertStyle(messageErrorApi?.type ?? ``)} />}
			closeOnEscape
			closable={false}
			headerClassName="m-0 p-0 mb-0 pb-0 sha"
			contentClassName="mb-0 p-0"

			onHide={() => setVisibleModalError(false)}
			style={styleHeaderMessageApi}
		>
			<div className="bg-white h-full w-full">
				<div className={divContentModalAlertStyle}>
					<i className={iconModalAlertStyle(messageErrorApi?.type ?? ``)}/>
					<h1 className={titleModalAlertStyle(messageErrorApi?.type ?? ``)}>
						{messageErrorApi?.type ?? ``}
					</h1>
					<h3
						className={styleContentMessageAPI}>
						{messageErrorApi?.description ?? ``}
					</h3>
				</div>
				<ProgressBar
					value={valueProgressBar}
					style={{ height: `4px` }}
					className="mt-4"
					showValue={false}

				/>

			</div>

		</Dialog>

	)

}
