import React from 'react';
import { LoaderPlaceholder } from 'components/LoaderPlaceholder/LoaderPlaceholder.component';

const withInitialLoading = (onInit, Loader) => Component => class WithInitialLoading extends React.PureComponent {
    state = {
        loading: true,
    };
    _isMounted = true;
    _loadPromise = null;

    componentDidMount() {
        this._loadPromise = onInit(this.props).finally(() => {
            if (!this._isMounted) {
                return;
            }
            this.setState({
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { loading } = this.state;
        const LoaderComponent = Loader || <LoaderPlaceholder />;

        return loading ? LoaderComponent : <Component {...this.props} initialization={this._loadPromise} />;
    }
};

export {
    withInitialLoading,
};
