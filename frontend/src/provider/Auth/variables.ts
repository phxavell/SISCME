// @ts-ignore
export const setLocalStorage = (key, value) => {
	window.localStorage.setItem(key, JSON.stringify(value))
}

// @ts-ignore
export const getLocalStorage = (key, initialValue) => {
	const value = window.localStorage.getItem(key)
	return value ? JSON.parse(value) : initialValue
}

export const getLocalStoragePerfil = (key: string, initialValue: string) => {

	const value = window.localStorage.getItem(key)
	return value ? value.replaceAll(`"`, ``) : initialValue

}
