import React, { PureComponent } from 'react';
import Spinner from './Spinner';
import MoviePageList from './MoviePageList';
import MoviePage from './MoviePage';
import { createFetcher, Placeholder, Loading } from './future';

const moviePageFetcher = createFetcher(
    () => import('./MoviePage'),
);

function MoviePageLoader(props) {
    const MoviePage = moviePageFetcher.read().default;
    return <MoviePage {...props} />;
}

export default class App extends PureComponent {

    state = {
        currentId: null,
        showDetail: false,
    };

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.showDetail !== this.state.showDetail &&
            prevState.currentId !== this.state.currentId
        ) {
            window.scrollTo(0, 0);
        }
    }

	deferSetState(state) {
		ReactDOM.unstable_deferredUpdates(() => {
			this.setState(state);
		});
    }

    handleMovieClick = (id) => {
        this.setState({
            currentId: id,
            showDetail: true,
        });

        // this.deferSetState({
        //     showDetail: true,
        // })
    }

    handleBackClick = () => {
        this.setState({
            currentId: null,
            showDetail: false,
        });
    }
    
    render() {
        const { currentId, showDetail } = this.state;
        return (
            <div className="App">
                {/* <Loading>
                    {isLoading => showDetail ?
                        this.renderDetail(currentId) :
                        this.renderList(
                            isLoading ?
                                currentId :
                                null
                        )
                    }
                </Loading> */}
                {showDetail ?
                    this.renderDetail(currentId) :
                    this.renderList()
                }
            </div>
        )
    }

    renderMovieDetail(id) {
        return (
            <>
                <button
                    className="App-back"
                    onClick={this.handleBackClick}>
                {'👈'}
                </button>
                <MoviePage id={id} />
                {/* <Placeholder
                    delayMs={1500}
                    fallback={<Spinner size="large" />}
                >
                    <MoviePageLoader id={id} />
                </Placeholder> */}
            </>
        );
    }

    renderList(loadingId) {
        return (
            <MovieListPage
                loadingId={loadingId}
                onMovieClick={this.handleMovieClick}
            />
        );
    }
}