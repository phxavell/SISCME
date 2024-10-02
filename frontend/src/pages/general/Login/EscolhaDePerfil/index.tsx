import { btnProsseguir, styleCardLogin, tituloApresentacao } from '@pages/general/Login/style.ts'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Button } from 'primereact/button'
import { Descricoes, SeletorDePerfil } from '@/components/SeletorDePerfil'
import { useAuth } from '@/provider/Auth'
import { useNavigate } from 'react-router-dom'
import { RoutersPathName } from '@/routes/schemas.ts'
import { Perfis } from '@/infra/integrations/login.ts'

export function EscolhaDePerfil() {

	const { perfil } = useAuth()
	const navigate = useNavigate()
	// const from = "/"// location.state?.from?.pathname || "/";

	const showClassProsseguir = useMemo(() => {
		if (perfil?.length) {
			return btnProsseguir
		}
		return `hidden`
	}, [perfil])

	const handleClickProsseguir = useCallback(() => {
		navigate(RoutersPathName.Home)
	}, [navigate])

	const getDescription = useMemo(() => {
		switch (perfil) {
		case Perfis.Cliente:
			return Descricoes.Cliente
		case Perfis.Tecnico:
			return Descricoes.Tecnico
		case Perfis.Administrador:
			return Descricoes.Administrador
		case Perfis.Transportador:
			return Descricoes.Transportador
		case Perfis.Enfermagem:
			return Descricoes.Enfermagem
		default:
			return Descricoes.None
		}
	}, [perfil])

	useEffect(() => {
		if (perfil?.length) {
			handleClickProsseguir()
		}
	}, [handleClickProsseguir, perfil])

	return (
		<div className={styleCardLogin}>
			<h5 className={tituloApresentacao}>
                Só mais um passo.
			</h5>
			<h5 className={tituloApresentacao}>
                Escolha seu perfil de trabalho:
			</h5>

			<SeletorDePerfil
				styleButton={undefined}
				styleIdSubMenu={undefined}
				openFast={true} />
			<h6 className={tituloApresentacao}>
				{getDescription}
			</h6>
			<Button
				className={showClassProsseguir}
				label="Prosseguir"
				onClick={handleClickProsseguir}
				aria-controls="popup_menu_perfil"
				aria-haspopup
				outlined
			/>
		</div>
	)
}
