import {InputText} from 'primereact/inputtext'
import {KeyFilterType} from 'primereact/keyfilter'
import {ChangeEventHandler, forwardRef, ForwardRefRenderFunction} from 'react'

type IProps = {
    id?: string;
    name?: string;
    type?: string;
    placeholder?: string;
    inputClassName?: string
    spanClassName?: string
    disable?: boolean
    keyfilter?: KeyFilterType | undefined
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined
    autoFocus?: boolean
    value?: string
    hidden?: boolean
	dataTestId?: string
}
const InputBase: ForwardRefRenderFunction<HTMLInputElement, IProps> = (props, ref) => {
	const {
		id,
		name,
		type,
		placeholder,
		inputClassName,
		disable,
		keyfilter,
		onChange,
		autoFocus,
		value,
		hidden,
		spanClassName,
		dataTestId,
		...rest
	} = props
	return (
		<span className={`p-float-label ${spanClassName}`}>
			<InputText
				id={id}
				className={`w-full ${inputClassName}`}
				name={name}
				type={type}
				onChange={onChange}
				hidden={hidden}
				ref={ref}
				{...rest}
				disabled={disable}
				keyfilter={keyfilter}
				autoFocus={autoFocus}
				data-testid={dataTestId}
				value={value}
			/>
			<label className='labelInput' htmlFor={id}>{placeholder}</label>
		</span>
	)
}
export const Input = forwardRef(InputBase)
