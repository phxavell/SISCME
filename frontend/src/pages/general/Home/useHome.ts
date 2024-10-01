import {useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react'

export const useHome = (optionsLength: number) => {
	const navigation = useNavigate()

	const goRouter = (rota: string) => {
		navigation(rota)
	}

	const [optionsCollapsed, setOptionsCollapsed] = useState<boolean[]>(Array(optionsLength).fill(true))

	useEffect(() => {
		if(optionsLength){
			const options = [...Array(optionsLength).fill(true)]
			options[0] = false
			setOptionsCollapsed(options)
		}

	}, [optionsLength])

	const handleMenu = (option: number, value: boolean) => {
		const optionOpen = [...optionsCollapsed].fill(true)
		optionOpen[option] = value
		setOptionsCollapsed(optionOpen)
	}

	return {
		goRouter,
		handleMenu,
		optionsCollapsed, setOptionsCollapsed
	}
}
