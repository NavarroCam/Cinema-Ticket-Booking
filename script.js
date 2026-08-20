// Movies data and rendering for screen-movies

const movies = [
  {
    id: 'm1',
    title: 'La Aventura Final',
    poster: 'https://placehold.co/400x600?text=La+Aventura+Final',
    genre: 'Acción',
    duration: '1h 45m',
    showtimes: ['10:00', '13:30', '16:00', '19:30']
  },
  {
    id: 'm2',
    title: 'Romance en la Ciudad',
    poster: 'https://placehold.co/400x600?text=Romance+en+la+Ciudad',
    genre: 'Romance',
    duration: '2h 05m',
    showtimes: ['11:15', '14:45', '18:00']
  },
  {
    id: 'm3',
    title: 'Misterio Nocturno',
    poster: 'https://placehold.co/400x600?text=Misterio+Nocturno',
    genre: 'Suspenso',
    duration: '1h 55m',
    showtimes: ['12:30', '15:00', '20:00']
  },
  {
    id: 'm4',
    title: 'Animales al Rescate',
    poster: 'https://placehold.co/400x600?text=Animales+al+Rescate',
    genre: 'Familiar',
    duration: '1h 30m',
    showtimes: ['09:30', '12:00', '17:00']
  }
];

const moviesGrid = document.getElementById('movies-grid');
let selectedMovieId = null;

function renderMovies() {
  moviesGrid.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.tabIndex = 0; // make it focusable
    card.dataset.movieId = movie.id;

    card.innerHTML = `
      <img src="${movie.poster}" alt="Poster de ${movie.title}">
      <div class="movie-meta">
        <div class="title">${movie.title}</div>
        <div class="sub">${movie.genre} • ${movie.duration}</div>
      </div>
      <div class="showtimes" aria-label="Horarios disponibles">
        ${movie.showtimes.map(time => `<button class="showtime-btn" type="button">${time}</button>`).join('')}
      </div>
    `;

    // Click on the card selects it (no navigation)
    card.addEventListener('click', (e) => {
      // if a showtime button was clicked, allow selection but don't trigger other side effects
      selectMovie(movie.id);
    });

    // Allow keyboard selection (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectMovie(movie.id);
      }
    });

    // Prevent showtime buttons from bubbling to other handlers that might be added later
    card.querySelectorAll('.showtime-btn').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        // Visual feedback for clicked showtime (brief)
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 200);
        // Note: we do NOT navigate to the next screen in this step
      });
    });

    moviesGrid.appendChild(card);
  });

  updateSelectionVisual();
}

function selectMovie(id) {
  if (selectedMovieId === id) return; // already selected
  selectedMovieId = id;
  updateSelectionVisual();
}

function updateSelectionVisual() {
  document.querySelectorAll('.movie-card').forEach(card => {
    if (card.dataset.movieId === selectedMovieId) {
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
    } else {
      card.classList.remove('selected');
      card.setAttribute('aria-pressed', 'false');
    }
  });
}

// Inicializar
renderMovies();
