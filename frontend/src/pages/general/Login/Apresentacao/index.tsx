import {
	styleBtnLoginApresentacao,
	styleCardLogin,
	styleLogoApresentacao,
	styleRow,
	tituloApresentacao
} from '@pages/general/Login/style.ts'
import {Button} from 'primereact/button'
import {Image} from 'primereact/image'
import React, {useCallback, useEffect, useMemo} from 'react'
import {LogoBioPlus192, LogoGB192, logoSISCME} from '@/util/styles'
import {EtapaLogin} from '@pages/general/Login'

// @ts-ignore
export function Apresentacao({show, setShow, setEtapaLogin}) {
	const showBtn = () => {
		if (!show) {
			setTimeout(() => {
				setShow(true)
			}, 1000)
		}
	}
	showBtn()
	const handleClickIconBringel = () => {
		window.open(`http://gbringel.com/`)
	}
	const handleClickIconBioplus = () => {
		window.open(`https://bioplusam.com.br/`)
	}
	const handleClickLogo = useCallback(() => {
		setTimeout(() => {
			setEtapaLogin(EtapaLogin.LOGIN)
		}, 200)
	}, [setEtapaLogin])

	const showButton = useMemo(() => {
		if (show) {
			return (

				<Button
					text
					className={styleBtnLoginApresentacao}
					onClick={handleClickLogo}
					size="large"
				>
					<Image
						src={logoSISCME}
						alt="Image"
					/>

				</Button>
			)
		}
		return <></>
	}, [handleClickLogo, show])

	useEffect(() => {
		setTimeout(() => {
			handleClickLogo()
		}, 1600)
	}, [handleClickLogo])
	return (
		<div className={styleCardLogin}>
			<div className={styleRow}>
				<img
					onClick={handleClickIconBringel}
					src={LogoGB192}
					className={styleLogoApresentacao}
					alt="logo bringel"/>
				<img
					onClick={handleClickIconBioplus}
					src={LogoBioPlus192}
					className={styleLogoApresentacao}
					alt="logo bioplus"/>
			</div>

			{showButton}
			<h6 className={tituloApresentacao}>
                © 2023 Bioplus, Grupo Bringel. Todos os direitos reservados.
			</h6>
		</div>
	)
}
