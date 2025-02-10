const fetchBestMoviesList = async () => {
    const responseBestMovies = await fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score")
    const bestMoviesList = responseBestMovies.json()
    return bestMoviesList
}
const bestMoviesListCall = await fetchBestMoviesList()
const bestMoviesList = bestMoviesListCall.results

const fetchBestMovie = async () => {
    const responseBestMovie = await fetch(bestMoviesList[0].url)
    const bestMovie = responseBestMovie.json()
    return bestMovie
}
const bestMovie = await fetchBestMovie()

const displayBestMovie = () => {
    const bestMovieImg = document.getElementsByClassName("best-movie-img")[0]
    bestMovieImg.src = bestMovie.image_url
    const bestMovieTitle = document.getElementsByClassName("best-movie-title")[0]
    bestMovieTitle.innerHTML = bestMovie.title
    const bestMovieDescription = document.getElementsByClassName("best-movie-description")[0]
    bestMovieDescription.innerHTML = bestMovie.description
    }
displayBestMovie()
