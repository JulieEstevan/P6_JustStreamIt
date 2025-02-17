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

const fetchAllGenres = async () => {
    let genreList = []
    for (let page = 1; page <= 5; page++) {
        const responseAllGenres = await fetch(`http://localhost:8000/api/v1/genres/?page=${page}`)
        const resultAllGenres = await responseAllGenres.json()
        genreList = genreList.concat(resultAllGenres.results)
    }
    return genreList
}
const allGenres = await fetchAllGenres()

const fetchBestMoviesByGenre = async (genre) => {
    const responseBestMovies = await fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genre}&page_size=6`)
    const bestMoviesList = responseBestMovies.json()
    return bestMoviesList
}

const fetchMovieById = async (movieId) => {
    const getMovieById = await fetch(`http://localhost:8000/api/v1/titles/${movieId}`)
    const movieById = getMovieById.json()
    return movieById
}

const displayModal = (button) => { 
    const body = document.querySelector("body")
    const modalMovie = document.querySelector(".modal-movie")
    const modalMovieTitle = document.querySelector(".modal-movie-title")
    const modalMovieInfo = document.querySelector(".modal-movie-info")
    const modalMovieDirectors = document.querySelector(".modal-movie-directors")
    const modalMovieImage = document.querySelector(".modal-movie-img")
    const modalMovieDescription = document.querySelector(".modal-movie-description")
    const modalMovieActors = document.querySelector(".modal-movie-actors")
    const modalMovieCloseButton = document.querySelector(".modal-movie-button")
    button.addEventListener("click", async () => {
        const movieId = button.id
        const movieById = await fetchMovieById(movieId)
        modalMovieTitle.innerHTML = movieById.title
        modalMovieInfo.innerHTML = `<span>${movieById.year} - ${(movieById.genres).join(", ")} <br/>
                                    ${movieById.rated} - ${movieById.duration} minutes 
                                    (${(movieById.countries).join(" / ")}) <br/>
                                    IMDB score: ${movieById.imdb_score}/10<span/>`
        modalMovieDirectors.innerHTML = `<span class="modal-movie-directors-1">Réalisé par:</span> 
                                        <br/><span>${(movieById.directors).join(", ")}</span>`
        modalMovieImage.src = movieById.image_url
        modalMovieImage.addEventListener("error", () => {
            modalMovieImage.src = "https://media.istockphoto.com/id/1472933890/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg?s=612x612&w=0&k=20&c=Rdn-lecwAj8ciQEccm0Ep2RX50FCuUJOaEM8qQjiLL0="
        })
        modalMovieDescription.innerHTML = movieById.description
        modalMovieActors.innerHTML = `Avec: <span class="modal-movie-actors-1"><br/> ${(movieById.actors).join(", ")}</span>`
        modalMovieCloseButton.innerHTML = "Fermer"
        if (window.screen.width <= 780) {
            modalMovieCloseButton.innerHTML = "❌"
            modalMovie.insertBefore(modalMovieDescription, modalMovieImage)
        }
        modalMovie.showModal()
        if (modalMovie.hasAttribute("open")) {
            body.style.position = "fixed"
        }
    })
    modalMovieCloseButton.addEventListener("click", () => {
        modalMovie.close()
        body.style.position = "relative"
    })
    body.addEventListener("click", (event) => {
        if (event.target === modalMovie) {
            modalMovie.close()
        }
    })
}

const displayBestMovie = () => {
    const bestMovieImg = document.querySelector(".best-movie-img")
    bestMovieImg.src = bestMovie.image_url
    const bestMovieTitle = document.querySelector(".best-movie-title")
    bestMovieTitle.innerHTML = bestMovie.title
    const bestMovieDescription = document.querySelector(".best-movie-description")
    bestMovieDescription.innerHTML = bestMovie.description
    const bestMovieButton = document.querySelector(".best-movie-button")
    bestMovieButton.id = bestMovie.id
    displayModal(bestMovieButton)
}
displayBestMovie()

const displayGenresSelection = () => {
    const genresSelect = document.querySelector(".movies-category-list")
    allGenres.forEach(genre => {
        const genreOption = document.createElement("option")
        genreOption.innerHTML = genre.name
        genresSelect.appendChild(genreOption)
    })
}
displayGenresSelection()

const displayBestMoviesByGenre = async (genre, container) => {
    const movieCardTemplate = document.querySelector("#card-movie-template")
    const bestMoviesByGenreCall = await fetchBestMoviesByGenre(genre)
    const bestMoviesByGenreList = bestMoviesByGenreCall.results
    bestMoviesByGenreList.forEach(movie => {
        const cloneMovieCard = movieCardTemplate.content.cloneNode(true)
        const movieCard = cloneMovieCard.querySelector(".card-movie")
        const movieCardImg = movieCard.querySelector(".card-movie-img")
        movieCardImg.src = movie.image_url
        movieCardImg.addEventListener("error", () => {
            movieCardImg.src = "https://media.istockphoto.com/id/1472933890/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg?s=612x612&w=0&k=20&c=Rdn-lecwAj8ciQEccm0Ep2RX50FCuUJOaEM8qQjiLL0="
        })
        const movieCardTitle = movieCard.querySelector(".card-movie-title")
        movieCardTitle.innerHTML = movie.title
        const movieCardButton = movieCard.querySelector(".card-movie-button")
        movieCardButton.id = movie.id
        container.appendChild(movieCard)
        displayModal(movieCardButton)
    })
}

const seeMoreSeeLessHandler = (container, movieCards) => {
    const seeMoreButton = document.createElement("button")
    seeMoreButton.className = "movie-container-button"
    seeMoreButton.innerHTML = "Voir plus"
    const seeLessButton = document.createElement("button")
    seeLessButton.className = "movie-container-button"
    seeLessButton.innerHTML = "Voir moins"
    if (window.screen.width <= 780) {
        let movieCardsToHide = [movieCards[4], movieCards[5]]
        if (window.screen.width <= 450) {
            movieCardsToHide = [movieCards[2], movieCards[3], movieCards[4], movieCards[5]]
        }
        movieCardsToHide.forEach(movieCard => {
            movieCard.setAttribute("class", "hidden")
        })

        container.appendChild(seeMoreButton)
        seeMoreButton.addEventListener("click", () => {
            movieCardsToHide.forEach(movieCard => {
                movieCard.setAttribute("class", "card-movie")
            })
            seeMoreButton.remove()
            container.appendChild(seeLessButton)
        })
        seeLessButton.addEventListener("click", () => {
            movieCardsToHide.forEach(movieCard => {
                movieCard.setAttribute("class", "hidden")
            })
            seeLessButton.remove()
            container.appendChild(seeMoreButton)
        })
    }
}

const displayMoviesByCategory = async () => {
    const firstCategoryGenre = document.querySelector("#first-category").innerHTML
    const firstCategoryContainer = document.querySelector(".first")
    const secondCategoryGenre = document.querySelector("#second-category").innerHTML
    const secondCategoryContainer = document.querySelector(".second")
    const selectGenre = document.querySelector("select")
    let selectOutput = selectGenre.options[selectGenre.selectedIndex].textContent
    let selectCategoryGenre = selectOutput
    let selectedCategoryContainer = document.querySelector(".selected")
    await displayBestMoviesByGenre(firstCategoryGenre, firstCategoryContainer)
    await displayBestMoviesByGenre(secondCategoryGenre, secondCategoryContainer)
    await displayBestMoviesByGenre(selectCategoryGenre, selectedCategoryContainer)
    const firstCategoryMovieCards = firstCategoryContainer.querySelectorAll(".card-movie")
    const secondCategoryMovieCards = secondCategoryContainer.querySelectorAll(".card-movie")
    let selectedCategoryMovieCards = selectedCategoryContainer.querySelectorAll(".card-movie")
    selectGenre.addEventListener("change", async () => {
        let selectOutput = selectGenre.options[selectGenre.selectedIndex].textContent
        let selectCategoryGenre = selectOutput
        selectedCategoryContainer.replaceChildren("")
        await displayBestMoviesByGenre(selectCategoryGenre, selectedCategoryContainer)
        selectGenre.blur()
        selectedCategoryMovieCards = selectedCategoryContainer.querySelectorAll(".card-movie")
        seeMoreSeeLessHandler(selectedCategoryContainer, selectedCategoryMovieCards)
    })
    seeMoreSeeLessHandler(firstCategoryContainer, firstCategoryMovieCards)
    seeMoreSeeLessHandler(secondCategoryContainer, secondCategoryMovieCards)
    seeMoreSeeLessHandler(selectedCategoryContainer, selectedCategoryMovieCards)
}
displayMoviesByCategory()