import { compileStyles } from 'jss-setup/jssStyles';

export const styles = compileStyles(({ spacing, palette, typography }) => ({
    root: {
        position: 'relative',
        padding: spacing(1.5, 2.5),
        border: '1px solid transparent',
        borderRadius: 2,
        fontSize: typography.pxToRem(14),
    },
    dismissible: {
        paddingRight: spacing(7.5),
    },
    close: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: spacing(1.375),
        color: palette.global.white,
        textShadow: `0 1px 0 ${palette.global.white}`,
        opacity: 0.5,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        '-webkit-appearance': 'none',
        lineHeight: 0,
    },
    primary: {
        color: palette.alert.primary.text,
        backgroundColor: palette.alert.primary.background,
        borderColor: palette.alert.primary.border,

        '& hr': {
            borderTopColor: palette.alert.primary.hr,
        },

        '& .alert__link': {
            color: palette.alert.primary.link,
        },
    },
    secondary: {
        color: palette.alert.secondary.text,
        backgroundColor: palette.alert.secondary.background,
        borderColor: palette.alert.secondary.border,

        '& hr': {
            borderTopColor: palette.alert.secondary.hr,
        },

        '& .alert__link': {
            color: palette.alert.secondary.link,
        },
    },
    success: {
        color: palette.alert.success.text,
        backgroundColor: palette.alert.success.background,
        borderColor: palette.alert.success.border,

        '& hr': {
            borderTopColor: palette.alert.success.hr,
        },

        '& .alert__link': {
            color: palette.alert.success.link,
        },
    },
    info: {
        color: palette.alert.info.text,
        backgroundColor: palette.alert.info.background,
        borderColor: palette.alert.info.border,

        '& hr': {
            borderTopColor: palette.alert.info.hr,
        },

        '& .alert__link': {
            color: palette.alert.info.link,
        },
    },
    warning: {
        color: palette.alert.warning.text,
        backgroundColor: palette.alert.warning.background,
        borderColor: palette.alert.warning.border,

        '& hr': {
            borderTopColor: palette.alert.warning.hr,
        },

        '& .alert__link': {
            color: palette.alert.warning.link,
        },
    },
    danger: {
        color: palette.alert.danger.text,
        backgroundColor: palette.alert.danger.background,
        borderColor: palette.alert.danger.border,

        '& hr': {
            borderTopColor: palette.alert.danger.hr,
        },

        '& .alert__link': {
            color: palette.alert.danger.link,
        },
    },
    light: {
        color: palette.alert.light.text,
        backgroundColor: palette.alert.light.background,
        borderColor: palette.alert.light.border,

        '& hr': {
            borderTopColor: palette.alert.light.hr,
        },

        '& .alert__link': {
            color: palette.alert.light.link,
        },
    },
    dark: {
        color: palette.alert.dark.text,
        backgroundColor: palette.alert.dark.background,
        borderColor: palette.alert.dark.border,

        '& hr': {
            borderTopColor: palette.alert.dark.hr,
        },

        '& .alert__link': {
            color: palette.alert.dark.link,
        },
    },
}));
