// Movies data and rendering for screen-movies + showtimes + summary navigation

const TICKET_PRICE = 3000; // fixed price per ticket

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

// DOM references
const moviesGrid = document.getElementById('movies-grid');
const screenMovies = document.getElementById('screen-movies');
const screenShowtimes = document.getElementById('screen-showtimes');
const screenSummary = document.getElementById('screen-summary');
const screenSuccess = document.getElementById('screen-success');

// Showtimes screen elements
const btnBackToMovies = document.getElementById('btn-back-to-movies');
const selectedMoviePoster = document.getElementById('selected-movie-poster');
const selectedMovieTitle = document.getElementById('selected-movie-title');
const showtimesList = document.getElementById('showtimes-list');
const btnContinue = document.getElementById('btn-continue');

// Summary screen elements
const btnBackToShowtimes = document.getElementById('btn-back-to-showtimes');
const summaryMoviePoster = document.getElementById('summary-movie-poster');
const summaryMovieTitle = document.getElementById('summary-movie-title');
const summaryShowtime = document.getElementById('summary-showtime');
const summaryMovieTitle2 = document.getElementById('summary-movie-title-2');
const summaryShowtime2 = document.getElementById('summary-showtime-2');
const ticketQuantityInput = document.getElementById('ticket-quantity');
const qtyDecrease = document.getElementById('qty-decrease');
const qtyIncrease = document.getElementById('qty-increase');
const summaryQuantity = document.getElementById('summary-quantity');
const summaryUnitPrice = document.getElementById('summary-unit-price');
const summaryTotal = document.getElementById('summary-total');
const btnConfirmReservation = document.getElementById('btn-confirm-reservation');

let selectedMovieId = null;
let selectedShowtime = null; // stores the chosen showtime string
let selectedQuantity = 1;

function renderMovies() {
  moviesGrid.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.tabIndex = 0; // focusable
    card.dataset.movieId = movie.id;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');

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

    // Click selects the movie and navigates to showtimes screen
    card.addEventListener('click', (e) => {
      selectMovie(movie.id, { navigateToShowtimes: true });
    });

    // Keyboard selection (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectMovie(movie.id, { navigateToShowtimes: true });
      }
    });

    // Prevent showtime buttons inside the card from bubbling (they are independent)
    card.querySelectorAll('.showtime-btn').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 180);
      });
    });

    moviesGrid.appendChild(card);
  });

  updateSelectionVisual();
}

function selectMovie(id, { navigateToShowtimes = false } = {}) {
  if (selectedMovieId === id) {
    if (navigateToShowtimes) {
      showShowtimesScreen();
    }
    return;
  }
  selectedMovieId = id;
  // reset showtime when choosing a different movie
  selectedShowtime = null;
  updateSelectionVisual();

  if (navigateToShowtimes) {
    showShowtimesScreen();
  }
}

function updateSelectionVisual() {
  document.querySelectorAll('.movie-card').forEach(card => {
    const id = card.dataset.movieId;
    if (id === selectedMovieId) {
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
    } else {
      card.classList.remove('selected');
      card.setAttribute('aria-pressed', 'false');
    }
  });
}

function showScreen(screenEl) {
  // hide all
  [screenMovies, screenShowtimes, screenSummary, screenSuccess].forEach(el => {
    el.style.display = 'none';
  });
  // show target
  screenEl.style.display = '';
}

function showShowtimesScreen() {
  const movie = movies.find(m => m.id === selectedMovieId);
  if (!movie) return;

  // fill poster + title
  selectedMoviePoster.src = movie.poster;
  selectedMoviePoster.alt = `Poster de ${movie.title}`;
  selectedMovieTitle.textContent = movie.title;

  // render showtime buttons
  renderShowtimesForMovie(movie);

  // navigate
  showScreen(screenShowtimes);
}

function renderShowtimesForMovie(movie) {
  showtimesList.innerHTML = '';

  movie.showtimes.forEach(time => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'showtime-choice';
    btn.dataset.time = time;
    btn.textContent = time;

    if (time === selectedShowtime) {
      btn.classList.add('selected');
    }

    btn.addEventListener('click', () => {
      selectShowtime(time);
    });

    showtimesList.appendChild(btn);
  });

  updateContinueState();
}

function selectShowtime(time) {
  selectedShowtime = time;
  // update visuals
  document.querySelectorAll('.showtime-choice').forEach(btn => {
    if (btn.dataset.time === time) {
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('selected');
      btn.setAttribute('aria-pressed', 'false');
    }
  });

  updateContinueState();
}

function updateContinueState() {
  // For now the continue button is only enabled if a showtime is selected
  if (selectedShowtime) {
    btnContinue.disabled = false;
  } else {
    btnContinue.disabled = true;
  }
}

// Back button handler: return to movies without losing selection
btnBackToMovies.addEventListener('click', () => {
  showScreen(screenMovies);
  // keep selection visual in movies
  updateSelectionVisual();
});

// Continue button: navigate to summary if a showtime is selected
btnContinue.addEventListener('click', () => {
  if (!selectedMovieId || !selectedShowtime) return;
  // reset default quantity when entering summary
  selectedQuantity = 1;
  ticketQuantityInput.value = String(selectedQuantity);
  showSummaryScreen();
});

// Summary screen logic
function showSummaryScreen() {
  const movie = movies.find(m => m.id === selectedMovieId);
  if (!movie) return;

  summaryMoviePoster.src = movie.poster;
  summaryMoviePoster.alt = `Poster de ${movie.title}`;
  summaryMovieTitle.textContent = movie.title;
  summaryShowtime.textContent = selectedShowtime;

  // also fill the alternate summary fields
  summaryMovieTitle2.textContent = movie.title;
  summaryShowtime2.textContent = selectedShowtime;

  updateSummaryDisplay();
  showScreen(screenSummary);
}

function updateSummaryDisplay() {
  const qty = Number(ticketQuantityInput.value) || 1;
  selectedQuantity = Math.max(1, Math.floor(qty));

  summaryQuantity.textContent = selectedQuantity;
  summaryUnitPrice.textContent = `$${TICKET_PRICE}`;
  summaryTotal.textContent = `$${selectedQuantity * TICKET_PRICE}`;
}

// Quantity controls
qtyDecrease.addEventListener('click', () => {
  const cur = Math.max(1, Number(ticketQuantityInput.value) || 1);
  ticketQuantityInput.value = String(Math.max(1, cur - 1));
  updateSummaryDisplay();
});
qtyIncrease.addEventListener('click', () => {
  const cur = Math.max(1, Number(ticketQuantityInput.value) || 1);
  ticketQuantityInput.value = String(cur + 1);
  updateSummaryDisplay();
});

ticketQuantityInput.addEventListener('change', () => {
  if (!ticketQuantityInput.value || Number(ticketQuantityInput.value) < 1) {
    ticketQuantityInput.value = '1';
  }
  updateSummaryDisplay();
});

// Back from summary to showtimes (to change horario)
btnBackToShowtimes.addEventListener('click', () => {
  showShowtimesScreen();
});

// Confirm reservation placeholder (does NOT navigate to success yet)
btnConfirmReservation.addEventListener('click', () => {
  console.log('Confirm reservation pressed. Payload:', {
    movieId: selectedMovieId,
    showtime: selectedShowtime,
    quantity: selectedQuantity,
    total: selectedQuantity * TICKET_PRICE
  });
  // next step will implement navigation to success screen
});

// Inicializar
renderMovies();
