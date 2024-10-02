import { Input } from "../Input"

type ColumnEditorOptions<T> = {
    value: T;
    editorCallback?: (value: T) => void;
};

export const TextEditor = <T extends string>(options: ColumnEditorOptions<T>) => {
	return (
		<Input
			type="text"
			value={options.value}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
				if (options.editorCallback) {
					options.editorCallback(e.target.value as T)
				}
			}}
		/>
	)
}
