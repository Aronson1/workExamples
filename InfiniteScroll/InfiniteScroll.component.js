import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import withStyles from '@material-ui/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { Loader } from 'components/Loader/Loader.component';
import { styles } from './InfiniteScroll.styles';

class InfiniteScroll extends React.Component {
    throttledScrollListener = null;
    element = null;

    componentDidMount() {
        const { scrollElement } = this.props;
        /**
         * TODO: [AK] I know we should not use querySelector but
         *  this is a special case where refs... are simply not working
         *  and simply I have no idea how to solve it.
         *  Try to refactor this in future.
         */
        this.element = document.querySelector(scrollElement);
        this.throttledScrollListener = throttle(this._onDocumentScroll, 300);
        this.element.addEventListener('scroll', this.throttledScrollListener, {
            passive: true,
            capture: true,
        });
    }

    componentWillUnmount() {
        this.element.removeEventListener('scroll', this.throttledScrollListener, {
            passive: true,
            capture: true,
        });
        this.throttledScrollListener = null;
        this.element = null;
    }

    _onDocumentScroll = () => {
        const { onEdge, loading, canLoadMore } = this.props;

        if (loading || !canLoadMore) {
            return;
        }

        if (this._isScrolledNearEnd()) {
            onEdge();
        }
    };

    _isScrolledNearEnd = () => {
        const { distance } = this.props;
        const { element } = this;
        const threshold = distance || element.clientHeight * 1.5;
        const height = element.scrollHeight;
        const scrolled = element.scrollTop + element.clientHeight;

        return scrolled + threshold > height;
    };

    render() {
        const {
            classes,
            loading,
            canLoadMore,
            children,
        } = this.props;

        return (
            <>
                {children}
                {loading ? <Loader /> : null}
                {!canLoadMore ? (
                    <div className={classes.message}>
                        <Typography variant="body2" color="textSecondary" className={classes.messageText}>
                            To już wszystko!
                        </Typography>
                    </div>
                ) : null}
            </>
        );
    }
}

InfiniteScroll.propTypes = {
    classes: PropTypes.object.isRequired,
    scrollElement: PropTypes.string.isRequired,
    onEdge: PropTypes.func,
    distance: PropTypes.number,
    loading: PropTypes.bool,
    canLoadMore: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

InfiniteScroll.defaultProps = {
    onEdge: () => {},
    distance: 0,
    loading: false,
    canLoadMore: false,
    children: null,
};

const Component = withStyles(styles)(InfiniteScroll);

export { Component as InfiniteScroll };
