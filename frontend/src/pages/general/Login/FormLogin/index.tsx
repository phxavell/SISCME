import React, { useMemo, useState} from 'react'
import {
	styleBtnLogado,
	styleBtnLogin,
	styleCardLoginForm,
	styleErrorVacuoLogin,
	styleForm,
	styleImg,
	styleMessageLogin
} from '@pages/general/Login/style.ts'
import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useAuth} from '@/provider/Auth'
import {Button} from 'primereact/button'
import {EtapaLogin} from '@pages/general/Login'
import {InputText} from 'primereact/inputtext'
import {classNames} from 'primereact/utils'
import {logoSISCME} from '@/util/styles'
import {Password} from "primereact/password"
import {Message} from "primereact/message"
import {defaultValues, LoginFormInputs, loginFormSchema} from "@pages/general/Login/FormLogin/schemas.ts"
import {AlertaCapsLockAtivo} from "@pages/general/Login/FormLogin/AlertaCapsLockAtivo.tsx"
import {ModalMessageApi} from "@/components/modals/ModalMessagemApi/ModalMessageApi.tsx"
import {TMessageAlert} from "@/components/modals/ModalMessagemApi/types.ts"

// @ts-ignore
export function FormLogin({setEtapaLogin}) {
	// const navigate = useNavigate();
	// const from = "/"// location.state?.from?.pathname || "/";
	const {
		control,
		handleSubmit,
		formState: {errors}
	} = useForm<LoginFormInputs>({
		resolver: zodResolver(loginFormSchema),
		defaultValues
	})
	const [loading, setLoading] = useState<boolean>(false)
	const [timeForFreeClick, setTimeForFreeClick] = useState(0)
	const {signin, estaLogado} = useAuth()
	const [openErro, setOpenErro] = useState(false)
	const [messageErro, setMessageErro] = useState<any>()

	const handleLogin = useMemo(() => {
		return (data: LoginFormInputs) => {
			if (!estaLogado && !loading) {
				setLoading(true)
				const user = {
					username: data.username,
					password: data.password
				}
				signin(user).then(() => {
					setLoading(false)
				}).catch(async (e) => {
					setMessageErro({
						type: TMessageAlert.Error,
						description: e.message
					})
					setOpenErro(true)
					setTimeout(() => {
						setLoading(false)
					}, timeForFreeClick)
					setTimeForFreeClick(timeForFreeClick + 200)
				})
			}
		}
	}, [estaLogado, loading, signin, timeForFreeClick])

	const showBtnEntrar = useMemo(() => {
		if (estaLogado) {
			setTimeout(() => {
				setEtapaLogin(EtapaLogin.ESCOLHAPERFIL)
			}, 400)
			return <Button
				icon="pi pi-check"
				disabled
				className={styleBtnLogado}
			/>
		} else {
			if (loading) {
				return <Button
					loading={loading}
					className={styleBtnLogin}
				/>
			} else {
				return <Button
					data-testid="btnentrar"
					label="Entrar"
					loading={loading}
					className={styleBtnLogin}
					style={{backgroundColor: `var(--blue-color)`}}
					type='submit'
				/>
			}
		}
	}, [estaLogado, loading, setEtapaLogin])

	// @ts-ignore
	const getFormErrorMessage = (name) => {
		// @ts-ignore
		if(errors[name]){
			// @ts-ignore
			return 	<Message className={styleMessageLogin} severity="error" text={errors[name].message} />
		}
		return <div style={styleErrorVacuoLogin}></div>
	}

	return (
		<div className={styleCardLoginForm}>
			<ModalMessageApi
				messageErrorApi={messageErro}
				visibleModalError={openErro}
				setVisibleModalError={setOpenErro}
			/>
			<img
				src={logoSISCME}
				className={styleImg}
				alt="Logo no login"/>
			<form
				className={styleForm}
				onSubmit={handleSubmit(handleLogin)}>
				<Controller
					name="username"
					control={control}
					render={({field, fieldState}) => (
						<div className="flex flex-column">
							<span className="p-float-label">
								<InputText
									autoFocus
									disabled={loading}
									id={field.name}
									value={field.value}
									className={classNames({
										'p-invalid': fieldState.error,
										'w-full': true
									})}
									onChange={(e) => field.onChange(e.target.value)}/>
								<label
									htmlFor={field.name}
									className={classNames({'p-error': errors.username})}>Usuário</label>
							</span>
							{getFormErrorMessage(field.name)}
						</div>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({field}) => (
						<div className="flex flex-column">
							<span className="p-float-label mt-4">
								<Password
									id={field.name}
									inputId={field.name}
									value={field.value}
									className={`w-full `}
									inputClassName={`w-full`}
									toggleMask
									feedback={false}
									onChange={(e) => field.onChange(e.target.value)}
								/>

								<label
									htmlFor={field.name}
									className={`${ errors?.password ? `p-error`:``} p-info`}
								>
                                    Senha
								</label>

							</span>
							{getFormErrorMessage(field.name)}
							<AlertaCapsLockAtivo/>
						</div>
					)}
				/>
				<div>
					{showBtnEntrar}
				</div>

			</form>
		</div>
	)
}
