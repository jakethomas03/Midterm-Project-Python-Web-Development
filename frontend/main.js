document.addEventListener("DOMContentLoaded", () => {
  let titleInput = document.getElementById("title");
  let ratingInput = document.getElementById("rating");
  let titleEditInput = document.getElementById("title-edit");
  let ratingEditInput = document.getElementById("rating-edit");
  let data = [];
  let selectedMovie = {};
  const api = "http://127.0.0.1:8000/movies";

  // Function to reset the add movie form
  const resetForm = () => {
    titleInput.value = "";
    ratingInput.value = "";
  };

  // Attach search event listener
  const searchInput = document.getElementById("search");
  if (searchInput) {
    console.log("Search input detected!"); // Debugging log
    searchInput.addEventListener("keyup", (event) => {
      console.log("Key pressed:", event.key); // Debugging log
      refreshMovies(searchInput.value); // Pass the search query to refreshMovies
    });
  } else {
    console.error("Search input NOT found!");
  }

  // Function to refresh movies list based on search query
  const refreshMovies = (searchQuery = "") => {
    console.log("Refreshing movies with search query:", searchQuery);

    const moviesContainer = document.getElementById("movies");
    moviesContainer.innerHTML = ""; // Clear the current movies list

    // Convert search query to lowercase for case-insensitive matching
    const lowerSearchQuery = searchQuery.toLowerCase().trim();

    // Ensure `data` is populated before filtering
    if (!data || data.length === 0) {
      console.warn("Movie data is empty, fetching movies...");
      return;
    }

    // Filter movies based on search input
    const filteredMovies = data.filter((movie) => {
      console.log("Checking movie:", movie.title);
      return movie.title.toLowerCase().includes(lowerSearchQuery);
    });

    console.log("Filtered movies count:", filteredMovies.length);

    // If no movies match, display a message
    if (filteredMovies.length === 0) {
      moviesContainer.innerHTML = "<p>No movies found</p>";
      return;
    }

    // Sort and display the filtered movies
    filteredMovies
      .sort((a, b) => b.rating - a.rating)
      .forEach((movie) => {
        const movieDiv = document.createElement("div");
        movieDiv.id = `movie-${movie.id}`;
        movieDiv.innerHTML = `
          <span class="fw-bold fs-4">${movie.title}</span>
          <pre class="text-secondary ps-3">Rating: ${movie.rating}/10</pre>
          <span class="options">
            <i class="fas fa-edit"></i> <!-- Edit icon -->
            <i class="fas fa-trash-alt"></i> <!-- Delete icon -->
          </span>
        `;

        // Add event listeners for edit & delete
        movieDiv.querySelector(".fa-edit").addEventListener("click", () => tryEditMovie(movie.id));
        movieDiv.querySelector(".fa-trash-alt").addEventListener("click", () => deleteMovie(movie.id));

        moviesContainer.appendChild(movieDiv);
      });

    resetForm(); // Clear the form after refresh
  };

  const tryEditMovie = (id) => {
    const movie = data.find((x) => x.id === id);
    if (!movie) return; // Safety check

    selectedMovie = movie;
    document.getElementById("movie-id").innerText = movie.id;
    titleEditInput.value = movie.title;
    ratingEditInput.value = movie.rating;
    document.getElementById("msg").innerHTML = "";

    // Open the modal programmatically
    let editModal = new bootstrap.Modal(document.getElementById("modal-edit"));
    editModal.show();
  };

  document.getElementById('form-edit').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const title = titleEditInput.value.trim();
    const rating = parseFloat(ratingEditInput.value.trim());
    const editMsg = document.getElementById('edit-msg'); // New separate message div
  
    if (!title) {
      editMsg.innerHTML = 'Movie title cannot be blank';
      return;
    }
  
    if (isNaN(rating) || rating < 1 || rating > 10) {
      editMsg.innerHTML = 'Rating must be between 1 and 10';
      return;
    }
  
    editMsg.innerHTML = ''; // Clear any previous message
    editMovie(title, rating);
  });
  
  

  // Function to update the movie in the backend
  const editMovie = (title, rating) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        selectedMovie.title = title;
        selectedMovie.rating = rating;
        refreshMovies(document.getElementById("search").value); // Keep search filter
        // Close the modal
        const closeBtn = document.getElementById("edit-close");
        closeBtn.click();
      }
    };
    xhr.open("PUT", `${api}/${selectedMovie.id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ title, rating }));
  };

  // Function to delete a movie
  const deleteMovie = (id) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        data = data.filter((x) => x.id !== id); // Remove the movie from the list
        refreshMovies(document.getElementById("search").value); // Keep search filter
      }
    };
    xhr.open("DELETE", `${api}/${id}`, true);
    xhr.send();
  };

  // Function to load movies from the backend
  const getMovies = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        data = JSON.parse(xhr.responseText) || [];
        console.log("Movies loaded from API:", data);
        refreshMovies(); // Refresh with loaded movies
      }
    };
    xhr.open("GET", api, true);
    xhr.send();
  };

  // Initial loading of movies
  getMovies();

  // Adding a new movie
  document.getElementById('form-add').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const title = titleInput.value.trim();
    const rating = parseFloat(ratingInput.value.trim());
  
    if (!title) {
      document.getElementById('msg').innerHTML = 'Movie title cannot be blank';
      return;
    }
  
    if (isNaN(rating) || rating < 1 || rating > 10) {
      document.getElementById('msg').innerHTML = 'Rating must be between 1 and 10';
      return;
    }
  
    document.getElementById('msg').innerHTML = ''; // Clear any previous message
    addMovie(title, rating);
  });
  

  // Function to add a movie
  const addMovie = (title, rating) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        const newMovie = JSON.parse(xhr.responseText);
        data.push(newMovie);
        refreshMovies(document.getElementById("search").value); // Keep search filter
        const closeBtn = document.getElementById("add-close");
        closeBtn.click(); // Close the modal after adding
      }
    };
    xhr.open("POST", api, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ title, rating }));
  };
});
