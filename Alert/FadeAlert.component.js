import React from 'react';
import PropTypes from 'prop-types';
import Fade from '@material-ui/core/Fade';
import { Alert } from './Alert.component';

const FadeAlert = ({ open, children, ...rest }) => (
    <Fade
        in={open}
        appear
        enter
        exit
        mountOnEnter
        unmountOnExit
        tag="div"
    >
        <Alert {...rest}>{children}</Alert>
    </Fade>
);

FadeAlert.propTypes = {
    open: PropTypes.bool,
    ...Alert.propTypes,
};

FadeAlert.defaultProps = {
    open: true,
    ...Alert.defaultProps,
};

export { FadeAlert };
