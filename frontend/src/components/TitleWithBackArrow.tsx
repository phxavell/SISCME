import { backArrowIcon, buttonBack, divButtonBackAndTitle, titleStyle } from "@/util/styles"
import { Button } from "primereact/button"
import { useNavigate } from "react-router-dom"
import React from "react"

type Title = {
    title: string, page?:any
}

export const TitleWithBackArrow:React.FC<Title> = (props) => {
	const {title, page} = props
	const navigate = useNavigate()
	return (
		<div className={divButtonBackAndTitle}>
			<Button
				icon={backArrowIcon}
				className={buttonBack}
				onClick={() => navigate(page ?? `/home`)}
			/>
			<h1 className={titleStyle}>{title}</h1>
			<div></div>
		</div>
	)
}
