document.addEventListener('DOMContentLoaded', () => {
  let titleInput = document.getElementById('title');
  let ratingInput = document.getElementById('rating');
  let titleEditInput = document.getElementById('title-edit');
  let ratingEditInput = document.getElementById('rating-edit');
  let data = [];
  let selectedMovie = {};
  const api = 'http://127.0.0.1:8000/movies';

  // This function will handle the form reset after adding a new movie
  const resetForm = () => {
    titleInput.value = '';
    ratingInput.value = '';
  };

  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
  
    // Check if the search input is being found
    if (searchInput) {
      console.log("Search input found");
  
      searchInput.addEventListener("keyup", () => {
        const searchQuery = searchInput.value; // Get the value from the search input
        console.log("Search input value:", searchQuery); // Debugging line
  
        // Ensure the refreshMovies function is being triggered
        refreshMovies(searchQuery);
      });
    } else {
      console.error("Search input not found");
    }
  });
  
  

  const refreshMovies = (searchQuery = "") => {
    console.log("Refreshing movies with search query:", searchQuery); // Debugging line
    
    const movies = document.getElementById('movies');
    movies.innerHTML = ''; // Clear current movies
  
    // Filter the movies based on the search query
    const filteredMovies = data.filter((movie) => {
      console.log("Checking movie:", movie.title); // Debugging line
      return movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  
    // Log how many movies passed the filter
    console.log("Filtered movies count:", filteredMovies.length);
  
    if (filteredMovies.length === 0) {
      movies.innerHTML = "<p>No movies found</p>"; // Optional: display a message if no results
    }
  
    // Sort and display filtered movies
    filteredMovies
      .sort((a, b) => b.rating - a.rating) // Sort movies by rating
      .forEach((movie) => {
        const movieDiv = document.createElement('div');
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
        movieDiv.querySelector('.fa-edit').addEventListener('click', () => tryEditMovie(movie.id));
        movieDiv.querySelector('.fa-trash-alt').addEventListener('click', () => deleteMovie(movie.id));
  
        movies.appendChild(movieDiv);
      });
  
    resetForm(); // Clear the form after refresh
  };
  

  const tryEditMovie = (id) => {
    const movie = data.find((x) => x.id === id);
    if (!movie) return; // Safety check
  
    selectedMovie = movie;
    document.getElementById('movie-id').innerText = movie.id;
    titleEditInput.value = movie.title;
    ratingEditInput.value = movie.rating;
    document.getElementById('msg').innerHTML = '';
  
    // Open the modal programmatically
    let editModal = new bootstrap.Modal(document.getElementById('modal-edit'));
    editModal.show();
  };
  

  // Handle the movie update form submission
  document.getElementById('form-edit').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!titleEditInput.value) {
      document.getElementById('msg').innerHTML = 'Movie cannot be blank';
    } else {
      editMovie(titleEditInput.value, ratingEditInput.value);
    }
  });

  // This function will update the movie in the backend
  const editMovie = (title, rating) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        selectedMovie.title = title;
        selectedMovie.rating = rating;
        refreshMovies(); // Refresh the movie list after updating
        // Close the modal
        const closeBtn = document.getElementById('edit-close');
        closeBtn.click();
      }
    };
    xhr.open('PUT', `${api}/${selectedMovie.id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ title, rating }));
  };

  // This function will delete the movie
  const deleteMovie = (id) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        data = data.filter((x) => x.id !== id); // Remove the movie from the list
        refreshMovies(); // Refresh the movie list after deletion
      }
    };
    xhr.open('DELETE', `${api}/${id}`, true);
    xhr.send();
  };

  // This function will load movies from the backend
  const getMovies = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        data = JSON.parse(xhr.responseText) || [];
        refreshMovies();
      }
    };
    xhr.open('GET', api, true);
    xhr.send();
  };

  // Initial loading of movies
  getMovies();

  // Adding a new movie
  document.getElementById('form-add').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!titleInput.value) {
      document.getElementById('msg').innerHTML = 'Movie cannot be blank';
    } else {
      addMovie(titleInput.value, ratingInput.value);
    }
  });

  const addMovie = (title, rating) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 201) {
        const newMovie = JSON.parse(xhr.responseText);
        data.push(newMovie);
        refreshMovies();
        const closeBtn = document.getElementById('add-close');
        closeBtn.click(); // Close the modal after adding
      }
    };
    xhr.open('POST', api, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({ title, rating }));
  };
});
