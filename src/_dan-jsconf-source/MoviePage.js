import { React } from 'react';
import Spinner from './Spinner';
import { movieDetailsJSON, movieReviewsJSON } from './api/data';
import { fetchMovieDetails, fetchMovieReviews } from './api/'
import { createFetcher, Placeholder } from './future';

export default function MoviePage(props) {
    return (
        <>
            <MovieDetails id={props.id} />
            <MovieReviews id={props.id} />
            {/* <Placeholder
                delayMs={1000}
                fallback={<Spinner size="medium" />}
            >
                <MovieReviews id={props.id} />
            </Placeholder> */}
        </>
    )
}

// const movieDetailsFetcher = createFetcher(
//     fetchMovieDetails,
// );

function MovieDetails(props) {
    const movie = movieDetailsFetcher.read(props.id);
    // const movie = movieDetailsJSON[props.id];
    return (
        <div className="MovieDetails">
            <MoviePoster src={movie.poster} />
            <h1>{movie.title}</h1>
            <MovieMetrics {...movie} />
        </div>
    );
}

const imageFetcher = createFetcher(
    (src) => new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(src);
        image.src = src;
    }),
);

function Img(props) {
    return (
        <img
            {...props}
            src={imageFetcher.read(props.src)}
        />
    )
}

function MoviePoster(props) {
    return (
        <div className="MoviePoster">
            <Img src={props.src} alt="Poster" />
        </div>
    );
}

function MovieMetrics(props) {
    return (
        <>
            <div className="MovieMetrics-tomato">
                <h4>Tomatometer</h4>
                <p>
                    {props.fresh ? '🍎' : '🍏'}
                    {' '}
                    {props.rating}
                </p>
                <div className="MovieMetrics-audience">
                    <h4>Audience</h4>
                    <p>{props.audience}</p>
                </div>
                <div className="MovieMetrics-consensus">
                    <h4>Critics Consensus</h4>
                    <p>{props.consensus}</p>
                </div>
            </div>
        </>
    )
}

// const movieReviewsFetcher = createFetcher(
//     fetchMovieReviews,
// );

function MovieReviews(props) {
    const reviews = movieReviewsFetcher.read(props.id);
    // const reviews = movieReviewsJSON[props.id];
    return (
        <div className="MovieReviews">
            {reviews.map(review =>
                <MovieReview
                    key={review.id}
                    {...review}
                />
            )}
        </div>
    );
}

function MovieReview(props) {
    return (
        <blockquote className="MovieReview">
            <figure>
            </figure>
        </blockquote>
    );
}