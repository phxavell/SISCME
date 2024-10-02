import {styeleFlexRowCenter} from '@/util/styles'

export const HeaderClass = `
    h-3rem
    md:h-4rem
    header-style
    flex
    flex-1
    gap-0
    justify-content-between
    align-items-center
    pl-3
`
export const styleHeaderBtn = `
    text-white
    transition-colors
    transition-duration-400
    hover:text-gray-400
    ${styeleFlexRowCenter}
`
//TODO checar a responsividade de disversas telas pro icone de nome aqui
export const styleLogoHome = `
    logoHome
`
export const styleAvatar = {
	backgroundColor: `#014983FF`,
	color: `#ffffff`
}
