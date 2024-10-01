export type RespostaAPI<T> = {
	status: string,
	data: T[],
	meta: {
		currentPage: number
		itemsPerPage: number,
		totalItems: number
		totalPages: number
	}
}
