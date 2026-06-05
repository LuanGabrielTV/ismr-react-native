import { Fonts } from '@/constants/theme';

export const Layout = {
    ui: {
        iconSize: 20,
        iconStrokeWidth: 2,
        fontSize: 16,
        fontFamily: Fonts.regular,
        borderRadius: 8
    },
    button: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    header: {
        height: 100,
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 24,
        paddingTop: 50,
        fontFamily: Fonts.title,
    },
    content: {
        height: '100%',
        padding: 12,
        fontFamily: Fonts.title
    },
}