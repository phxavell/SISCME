import {Message} from "primereact/message"
import {styleMessageLogin} from "@pages/general/Login"
import React, {useEffect, useState} from "react"

export const AlertaCapsLockAtivo = ()=> {

	const [capsLockEnabled, setCapsLockEnabled]  = useState(false)
	useEffect(() => {
		function handleKeyPress(event: KeyboardEvent) {
			if (event.getModifierState && event.getModifierState(`CapsLock`)) {
				setCapsLockEnabled(true)
			} else {
				setCapsLockEnabled(false)
			}
		}
		document.addEventListener(`keydown`, handleKeyPress)
		return () => {
			document.removeEventListener(`keydown`, handleKeyPress)
		}
	}, [])
	if(capsLockEnabled){
		// @ts-ignore
		return <Message className={styleMessageLogin}
			severity="warn"
			text="Caps Lock ativado" />
	}
	return <div ></div>
}
