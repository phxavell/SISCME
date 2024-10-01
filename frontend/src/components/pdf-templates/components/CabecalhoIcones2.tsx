import {Image, Text, View} from "@react-pdf/renderer"
import {styles} from "@/components/pdf-templates/styles.ts"
import {LogoGovAM, LogoSISCMEVertical} from "@/util/styles"
//TODO revisar ícones e estratégia pra este componente
export const CabecalhoIcones2 = (titulo: string) => {
	return (
		<View fixed style={styles.container}>
			<Image
				style={[styles.logo, {width: 150, height: 55}]}
				src={LogoSISCMEVertical}
			/>
			<Text
				style={styles.name16}
			>
				{titulo}
			</Text>
			<Image
				style={styles.logo}
				src={LogoGovAM}
			/>
		</View>
	)
}
