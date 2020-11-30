import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { CloseIcon } from 'components/Icons/CloseIcon/CloseIcon.component';
import { AlertProps } from './Alert.types';
import { styles } from './Alert.styles';
import testIds from './Alert.test.ids.json';

const useStyles = makeStyles(styles, { name: 'Alert' });

const Alert: React.FC<AlertProps> = ({
    variant,
    children,
    onClose,
    className,
    component,
    ...rest
}) => {
    const classes = useStyles();
    const Component = component || 'div';

    return (
        <Component
            className={`${className} ${classes.root} ${variant && classes[variant]} ${onClose ? classes.dismissible : ''}`}
            role="alert"
            data-test-id={testIds.root}
            {...rest}
        >
            {children}
            {onClose ? (
                <button
                    type="button"
                    className={classes.close}
                    aria-label="Close"
                    onClick={onClose}
                    data-test-id={testIds.close}
                >
                    <CloseIcon />
                </button>
            ) : null}
        </Component>
    );
};

Alert.defaultProps = {
    variant: 'primary',
    className: '',
};

export { Alert };
