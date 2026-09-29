/* =========================
   ELEMENTS
========================= */

const results = document.getElementById("results");

const searchForm = document.getElementById("searchForm");

const inputSearch = document.getElementById("inputSearch");

const favorites = document.getElementById("favorites");


/* =========================
   FAVORITES DATA
========================= */

let favoriteItems = JSON.parse(
    localStorage.getItem("nasaFavorites")
) || [];


/* =========================
   SEARCH NASA
========================= */

function searchQuery(query) {

    const url =
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;


    /* Clear previous results */

    results.innerHTML = "";


    /* Loading */

    results.innerHTML = `
        <div class="empty-message">

            <div class="empty-icon">🔭</div>

            <h2>Searching NASA...</h2>

            <p>Please wait while we explore the universe.</p>

        </div>
    `;


    /* Fetch API */

    fetch(url)

        .then(response => response.json())

        .then(data => {

            results.innerHTML = "";


            const items = data.collection.items.slice(0, 8);


            /* No results */

            if (items.length === 0) {

                results.innerHTML = `
                    <div class="empty-message">

                        <div class="empty-icon">🌌</div>

                        <h2>No Results</h2>

                        <p>
                            Try searching for something else.
                        </p>

                    </div>
                `;

                return;
            }


            /* Create Cards */

            items.forEach(item => {

                const title =
                    item.data[0].title || "Untitled";

                const image =
                    item.links?.[0]?.href;

                const description =
                    item.data[0].description ||
                    "No description available.";

                const nasaId =
                    item.data[0].nasa_id;


                /* If no image, don't create card */

                if (!image) {
                    return;
                }


                /* Check if already favorite */

                const isSaved =
                    favoriteItems.some(
                        favorite => favorite.id === nasaId
                    );


                results.innerHTML += `

                    <div class="card">

                        <img
                            src="${image}"
                            alt="${title}"
                        >

                        <div class="card-content">

                            <h2>${title}</h2>

                            <p>
                                ${description}
                            </p>

                            <button
                                type="button"
                                class="favoriteBtn ${isSaved ? "saved" : ""}"
                                data-id="${nasaId}"
                                data-title="${title}"
                                data-image="${image}"
                                data-description="${description}"
                            >

                                ${isSaved
                                    ? "❤️ Saved"
                                    : "♡ Add to Favorites"
                                }

                            </button>

                        </div>

                    </div>

                `;

            });


            /* Activate favorite buttons */

            addFavoriteListeners();

        })

        .catch(error => {

            console.log(error);

            results.innerHTML = `

                <div class="empty-message">

                    <div class="empty-icon">⚠️</div>

                    <h2>Something Went Wrong</h2>

                    <p>
                        Please try again later.
                    </p>

                </div>

            `;

        });

}


/* =========================
   SEARCH BUTTON
========================= */

searchForm.addEventListener("submit", function (e) {

    e.preventDefault();


    const query =
        inputSearch.value.trim();


    if (query === "") {

        return;

    }


    searchQuery(query);

});


/* =========================
   ADD FAVORITE LISTENERS
========================= */

function addFavoriteListeners() {

    const buttons =
        document.querySelectorAll(".favoriteBtn");


    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const id =
                this.dataset.id;

            const title =
                this.dataset.title;

            const image =
                this.dataset.image;

            const description =
                this.dataset.description;


            addToFavorites(
                id,
                title,
                image,
                description
            );

        });

    });

}


/* =========================
   ADD / REMOVE FAVORITE
========================= */

function addToFavorites(
    id,
    title,
    image,
    description
) {

    const existing =
        favoriteItems.find(
            favorite => favorite.id === id
        );


    /* If already exists → remove */

    if (existing) {

        favoriteItems =
            favoriteItems.filter(
                favorite => favorite.id !== id
            );

    }

    /* Otherwise → add */

    else {

        favoriteItems.push({

            id: id,

            title: title,

            image: image,

            description: description

        });

    }


    /* Save to LocalStorage */

    localStorage.setItem(
        "nasaFavorites",
        JSON.stringify(favoriteItems)
    );


    /* Refresh UI */

    displayFavorites();


    /* Refresh search buttons */

    updateFavoriteButtons();

}



function displayFavorites() {

    favorites.innerHTML = "";


    /* No favorites */

    if (favoriteItems.length === 0) {

        favorites.innerHTML = `

            <div class="empty-message">

                <div class="empty-icon">❤️</div>

                <h2>No Favorites Yet</h2>

                <p>
                    Add something to your favorites
                    and it will appear here.
                </p>

            </div>

        `;

        return;

    }


    /* Display cards */

    favoriteItems.forEach(item => {

        favorites.innerHTML += `

            <div class="card">

                <img
                    src="${item.image}"
                    alt="${item.title}"
                >

                <div class="card-content">

                    <h2>
                        ${item.title}
                    </h2>

                    <p>
                        ${item.description}
                    </p>

                    <button
                        type="button"
                        class="favoriteBtn saved"
                        data-remove-id="${item.id}"
                    >
                        ❤️ Remove from Favorites
                    </button>

                </div>

            </div>

        `;

    });


    /* Remove buttons */

    const removeButtons =
        document.querySelectorAll(
            "[data-remove-id]"
        );


    removeButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const id =
                    this.dataset.removeId;


                favoriteItems =
                    favoriteItems.filter(
                        favorite =>
                            favorite.id !== id
                    );


                localStorage.setItem(
                    "nasaFavorites",
                    JSON.stringify(favoriteItems)
                );


                displayFavorites();

                updateFavoriteButtons();

            }
        );

    });

}




function updateFavoriteButtons() {

    const buttons =
        document.querySelectorAll(".favoriteBtn");


    buttons.forEach(button => {

        const id =
            button.dataset.id;


        if (!id) {
            return;
        }


        const isSaved =
            favoriteItems.some(
                favorite => favorite.id === id
            );


        if (isSaved) {

            button.classList.add("saved");

            button.textContent =
                "❤️ Saved";

        }

        else {

            button.classList.remove("saved");

            button.textContent =
                "♡ Add to Favorites";

        }

    });

}


/* =========================
   LOAD FAVORITES
   WHEN PAGE OPENS
========================= */

displayFavorites();