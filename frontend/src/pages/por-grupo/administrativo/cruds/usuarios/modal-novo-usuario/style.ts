export const styleForm = `flex flex-column gap-4 mt-4`
export const styleClassResponsavelTecnico = `ml-1 mr-4 text-gray-200`

export const ptConfig = (isActivie: boolean) => {
	if(isActivie){
		return {	headerAction: () => ({
			className: `bg-blue-600 text-white`
		}),}
	} else {
		return {	headerAction: () => ({
			className: `bg-blue-800 text-white`
		}),}
	}

}
