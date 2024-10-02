import {StyleSheet} from "@react-pdf/renderer"

const geral = {
	page: {
		display: `flex`,
		padding: `30px 20px 20px 30px`,
		flexDirection: `column`,
		backgroundColor: `#ffffff`
	},
	pageEtiqueta: {
		display: `flex`,
		padding: `10px`,
		flexDirection: `column`,
		backgroundColor: `#ffffff`
	},
	pageEtiquetaTripla: {
		display: `flex`,
		padding: `0`,
		flexDirection: `column`,
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1
	},
	logo: {
		// height: `32px`,
	},
	logoMin: {
		marginTop: `2px`,
		marginBottom:`2px`
	},
	container: {
		flexDirection: `row`,
		alignItems: `stretch`,
		justifyContent: `space-between`
	},
	containerTable: {
		flexDirection: `column`,
	},
	row: {
		display: `flex`,
		flexDirection: `row`,
	},
	column: {
		flexDirection: `column`,
	},
	pageNumber: {
		position: `absolute`,
		fontSize: 10,
		bottom: 20,
		left: 30,
		right: 20,
		textAlign: `center`,
		color: `grey`,
	},
	rodapeText: {
		color: `black`,
		fontSize: 10,
		fontWeight: `normal`,
		width: `auto`
	},
}
const header = {
	headerBorderAll: {
		padding: `4px 8px 0px 4px`,
		flexDirection: `column`,
		borderWidth: 2,
		borderColor: `#0e0606`,
		borderStyle: `solid`,
		borderRadius: `0%`,
		alignItems: `flex-start`,
		justifyContent: `space-between`
	},
	rowHeader: {
		display: `flex`,
		flexDirection: `row`,
		alignItems: `baseline`,
		marginBottom:`1px`,
		height: `18px`,
		justifyContent: `space-between`,
		//border: '1px solid orange',
		width: `100%`
	},
	rowHeaderEtiqueta: {
		display: `flex`,
		flexDirection: `row`,
		alignItems: `baseline`,
		height: `18px`,
		justifyContent: `space-between`,
		//border: '1px solid orange',
		width: `100%`
	},
	headerTitle: {
		color: `black`,
		fontSize: `8px`,
		height: `15px`,

		fontWeight: `bold`,
		fontStyle: `normal`,
	},
	headerTitleEtiqueta: {
		color: `black`,
		fontSize: `7px`,
		height: `12px`,
		fontFamily: `Lato Bold`,
		fontStyle: `normal`,
	},
	headerLabel: {
		height: `8px`,
		color: `black`,
		fontSize: `14px`,
		fontFamily: `Open Sans`,
		marginLeft: `4px`,
		textAlign:`center`,

		textTransform: `uppercase`,
		fontWeight: `normal`,
		width: `auto`
	},
	headerLabelEtiqueta: {
		height: `8px`,
		color: `black`,
		fontFamily: `Lato`,
		fontSize: `6px`,
		marginLeft: `2px`,
		// backgroundColor: `red`,
		textTransform: `uppercase`,
		textOverflow: `ellipsis`,
		fontWeight: `normal`,
		width: `auto`
	},
	headerLabelEtiquetaTripla: {
		// height: `8px`,
		color: `black`,
		fontFamily: `Lato`,
		fontSize: `6px`,
		marginLeft: `2px`,
		// backgroundColor: `red`,
		textTransform: `uppercase`,
		textOverflow: `ellipsis`,
		fontWeight: `normal`,
		width: `auto`
	},
	headerTitleEtiquetaTripla: {
		color: `black`,
		fontSize: `6px`,
		height: `8px`,
		fontFamily: `Lato Bold`,
		fontWeight: `bold`,
		fontStyle: `normal`,
		// backgroundColor: `blue`
	},
}
const naoUsados = {
	itemContent: {
		display: `flex`,
		flexDirection: `column`,
		alignItems: `flex-start`,
		justifyContent: `space-between`,
	},
	bottomBorder: {
		borderBottomWidth: 1,
		borderBottomColor: `#516680`,
		borderBottomStyle: `solid`,
		borderRadius: `2%`,
	},
	detailColumn: {
		flexDirection: `column`,
		flexGrow: 9,
		textTransform: `uppercase`,
	},
	linkColumn: {
		flexDirection: `column`,
		flexGrow: 2,
		alignSelf: `flex-end`,
	},
	subtitle: {
		fontSize: 10,
		fontFamily: `Lato`,
	},
	link: {
		fontFamily: `Lato`,
		fontSize: 10,
		color: `black`,
		textDecoration: `none`,
		alignSelf: `flex-end`,
	},
	grid: {
		maxWidth: `400px`,
		margin: `0 auto`,
		border: `1px solid #ccc`,
	},
}
const linhaDeDados = {
	flexGrow1: {

		width: `10%`,
		height: `100%`,
		alignItems: `baseline`
	},
	flex20p: {

		width: `20%`,
		height: `100%`,
		alignItems: `baseline`
	},
	flex25p: {

		width: `25%`,
		height: `100%`,
		alignItems: `baseline`
	},
	flex30p: {

		width: `30%`,
		height: `100%`,
		alignItems: `baseline`
	},
	flex40p: {
		width: `40%`,
		height: `100%`,
		alignItems: `baseline`
	},
	flex50p: {
		width: `50%`,
		height: `100%`,
		alignItems: `baseline`
	},
	baseLine: {
		alignItems: `baseline`,
	},
	flexGrow2: {
		height: `100%`,
		width: `50%`,
		display: `flex`,
		textAlign: `justify`,

		alignItems: `baseline`
	},
	flexGrow3: {
		height: `100%`,
		width: `40%`,
		justifyContent: `space-between`,
		alignItems: `baseline`
	},
	itemRow: {
		fontSize: 12,
		fontFamily: `Lato`,
	},
	borderBottom: {
		borderBottom: `2px solid black`
	},
	itemHeader: {
		display: `flex`,
		flexDirection: `row`,
		alignItems: `baseline`,
		height: `18px`,
		justifyContent: `space-between`,
		fontSize: 16,
		//border: '1px solid orange',
		width: `100%`
	},
	itemHeaderStronger: {
		display: `flex`,
		flexDirection: `row`,
		alignItems: `baseline`,
		height: `16px`,
		fontFamily:`Lato Bold`,
		fontWeight:`900`,
		color:`black`,
		justifyContent: `space-between`,
		fontSize: 16,
		//border: '1px solid orange',
		width: `100%`
	},
	itemLabel: {
		fontFamily: `Lato`,
		fontSize: 12,
		color: `black`,
		textTransform: `uppercase`,
	},
	itemLabelTotal: {
		fontFamily: `Lato`,
		fontSize: 12,
		color: `black`,
	},
	itemHeaderStronger2: {
		display: `flex`,
		flexDirection: `row`,
		alignItems: `baseline`,
		height: `12px`,
		fontFamily:`Lato Bold`,
		fontWeight:`900`,
		color:`black`,
		justifyContent: `space-between`,
		fontSize: 12,
		//border: '1px solid orange',
		width: `100%`
	},

}
export const styles = StyleSheet.create({
	...geral,
	...header,
	...naoUsados,
	...linhaDeDados,
	name: {
		fontSize: 24,
		fontFamily: `Lato Bold`,
		textAlign: `center`,
		alignSelf: `center`
	},
	name18: {
		fontSize: 18,
		fontFamily: `Lato Bold`,
		textAlign: `center`,
		alignSelf: `center`
	},
	itemgrid: {
		margin: `5px`,
		//@ts-ignore
		background: `green`,
		textAlign: `center`,
		fontSize: `1.5em`
	},
})
// @ts-ignore
export const stylesHeader2 = StyleSheet.create({
	...header,
	...geral,
	baseLine: {
		alignItems: `baseline`,
	},
	rowHeader2: {
		display: `flex`,
		flexDirection: `row`,
		alignItems: `baseline`,
		height: `16px`,
		justifyContent: `flex-start`,
		//border: '1px solid orange',
	},
	borderBottom: {
		borderBottom: `2px solid black`,
		padding: `0px 0px`,
	},
	fg5: {
		width: `41%`,
		// backgroundColor:`green`,
	},
	fg4: {
		width: `33%`,
		// backgroundColor:`red`
	},
	fg2: {
		width: `17%`,
		// backgroundColor:`blue`
	},
	fg3: {
		width: `25%`,
		// backgroundColor:`orange`
	},
})
