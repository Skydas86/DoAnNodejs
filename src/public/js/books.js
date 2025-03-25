// Book data
const booksData = [
    {
        id: 1,
        title: 'The Missing Piece',
        author: 'John Smith',
        coverImage: 'placeholder.svg',
        category: 'Fiction',
        rating: 4.5,
        year: 2023,
        available: true,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        id: 2,
        title: 'Sonic Boom',
        author: 'Maria Johnson',
        coverImage: 'placeholder.svg',
        category: 'Science',
        rating: 4.2,
        year: 2022,
        available: true,
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
        id: 3,
        title: 'E. Scott Fitzgerald',
        author: 'Biography Press',
        coverImage: 'placeholder.svg',
        category: 'Biography',
        rating: 4.8,
        year: 2021,
        available: false,
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
        id: 4,
        title: 'World History Encyclopedia',
        author: 'Academic Publishing',
        coverImage: 'placeholder.svg',
        category: 'History',
        rating: 4.6,
        year: 2020,
        available: true,
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        id: 5,
        title: 'The Art of Cooking',
        author: 'Chef Julia',
        coverImage: 'placeholder.svg',
        category: 'Cooking',
        rating: 4.3,
        year: 2023,
        available: true,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        id: 6,
        title: 'Digital Marketing Essentials',
        author: 'Mark Thompson',
        coverImage: 'placeholder.svg',
        category: 'Business',
        rating: 4.1,
        year: 2022,
        available: true,
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
        id: 7,
        title: 'The Psychology of Success',
        author: 'Dr. Sarah Williams',
        coverImage: 'placeholder.svg',
        category: 'Psychology',
        rating: 4.7,
        year: 2021,
        available: false,
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
        id: 8,
        title: 'Exploring the Universe',
        author: 'Neil Armstrong',
        coverImage: 'placeholder.svg',
        category: 'Science',
        rating: 4.9,
        year: 2023,
        available: true,
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
];

// DOM Elements
const booksContainer = document.getElementById('books-container');
const filterToggle = document.getElementById('filter-toggle');
const filtersPanel = document.getElementById('filters-panel');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const resultsNumber = document.getElementById('results-number');
const clearFiltersBtn = document.getElementById('clear-filters');
const applyFiltersBtn = document.getElementById('apply-filters');

// State
let currentView = 'grid';
let currentSort = 'newest';
let searchQuery = '';
let activeFilters = {
    categories: [],
    availability: [],
    years: [],
    ratings: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBooks(booksData);
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Toggle filters panel
    filterToggle.addEventListener('click', () => {
        filtersPanel.classList.toggle('active');
        const icon = filterToggle.querySelector('.fa-chevron-down, .fa-chevron-up');
        if (icon.classList.contains('fa-chevron-down')) {
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        } else {
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
    });

    // View mode toggle
    gridViewBtn.addEventListener('click', () => {
        setViewMode('grid');
    });

    listViewBtn.addEventListener('click', () => {
        setViewMode('list');
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        applyFiltersAndSort();
    });

    // Sort select
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFiltersAndSort();
    });

    // Filter checkboxes
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            collectActiveFilters();
        });
    });

    document.querySelectorAll('.availability-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            collectActiveFilters();
        });
    });

    document.querySelectorAll('.year-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            collectActiveFilters();
        });
    });

    document.querySelectorAll('.rating-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            collectActiveFilters();
        });
    });

    // Clear filters
    clearFiltersBtn.addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        activeFilters = {
            categories: [],
            availability: [],
            years: [],
            ratings: []
        };
        applyFiltersAndSort();
    });

    // Apply filters
    applyFiltersBtn.addEventListener('click', () => {
        collectActiveFilters();
        applyFiltersAndSort();
    });
}

// Collect active filters from checkboxes
function collectActiveFilters() {
    // Categories
    activeFilters.categories = [];
    document.querySelectorAll('.category-filter:checked').forEach(checkbox => {
        activeFilters.categories.push(checkbox.id);
    });

    // Availability
    activeFilters.availability = [];
    document.querySelectorAll('.availability-filter:checked').forEach(checkbox => {
        activeFilters.availability.push(checkbox.id);
    });

    // Years
    activeFilters.years = [];
    document.querySelectorAll('.year-filter:checked').forEach(checkbox => {
        activeFilters.years.push(checkbox.id.replace('year-', ''));
    });

    // Ratings
    activeFilters.ratings = [];
    document.querySelectorAll('.rating-filter:checked').forEach(checkbox => {
        activeFilters.ratings.push(checkbox.id.replace('rating-', ''));
    });
}

// Apply filters and sort
function applyFiltersAndSort() {
    let filteredBooks = booksData;

    // Apply search query
    if (searchQuery) {
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery) ||
            book.category.toLowerCase().includes(searchQuery)
        );
    }

    // Apply category filters
    if (activeFilters.categories.length > 0) {
        filteredBooks = filteredBooks.filter(book => 
            activeFilters.categories.includes(book.category.toLowerCase())
        );
    }

    // Apply availability filters
    if (activeFilters.availability.length > 0) {
        if (activeFilters.availability.includes('available') && !activeFilters.availability.includes('all-books')) {
            filteredBooks = filteredBooks.filter(book => book.available);
        }
    }

    // Apply year filters
    if (activeFilters.years.length > 0) {
        filteredBooks = filteredBooks.filter(book => {
            if (activeFilters.years.includes('earlier')) {
                return activeFilters.years.includes(book.year.toString()) || book.year < 2020;
            }
            return activeFilters.years.includes(book.year.toString());
        });
    }

    // Apply rating filters
    if (activeFilters.ratings.length > 0) {
        filteredBooks = filteredBooks.filter(book => {
            if (activeFilters.ratings.includes('4')) {
                return book.rating >= 4;
            } else if (activeFilters.ratings.includes('3')) {
                return book.rating >= 3;
            } else if (activeFilters.ratings.includes('2')) {
                return book.rating >= 2;
            }
            return true; // Any rating
        });
    }

    // Apply sorting
    switch (currentSort) {
        case 'newest':
            filteredBooks.sort((a, b) => b.year - a.year);
            break;
        case 'oldest':
            filteredBooks.sort((a, b) => a.year - b.year);
            break;
        case 'a-z':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'z-a':
            filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'rating':
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
    }

    // Update results count
    resultsNumber.textContent = filteredBooks.length;

    // Render filtered books
    renderBooks(filteredBooks);
}

// Set view mode (grid or list)
function setViewMode(mode) {
    currentView = mode;
    
    if (mode === 'grid') {
        booksContainer.className = 'books-grid';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        booksContainer.className = 'books-list';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }
    
    // Re-render with current data
    applyFiltersAndSort();
}

// Render books
function renderBooks(books) {
    booksContainer.innerHTML = '';
    
    if (books.length === 0) {
        booksContainer.innerHTML = `
            <div class="no-results">
                <h3>No books found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    if (currentView === 'grid') {
        books.forEach(book => {
            booksContainer.appendChild(createBookCard(book));
        });
    } else {
        books.forEach(book => {
            booksContainer.appendChild(createBookListItem(book));
        });
    }
}

// Create book card for grid view
function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    bookCard.innerHTML = `
        <div class="book-cover">
            <img src="${book.coverImage}" alt="${book.title}">
            <div class="book-badge ${book.available ? 'badge-available' : 'badge-unavailable'}">
                ${book.available ? 'Available' : 'Unavailable'}
            </div>
        </div>
        <div class="book-details">
            <div class="book-meta">
                <span class="book-category">${book.category}</span>
                <span class="book-rating">
                    <i class="fas fa-star"></i>
                    ${book.rating}
                </span>
            </div>
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-year">Published: ${book.year}</p>
            <div class="book-actions">
                <button class="btn btn-outline">Details</button>
                <button class="btn btn-primary" ${!book.available ? 'disabled' : ''}>
                    ${book.available ? 'Borrow' : 'Reserve'}
                </button>
            </div>
        </div>
    `;
    
    return bookCard;
}

// Create book list item for list view
function createBookListItem(book) {
    const bookListItem = document.createElement('div');
    bookListItem.className = 'book-list-item';
    
    bookListItem.innerHTML = `
        <div class="book-list-cover">
            <img src="${book.coverImage}" alt="${book.title}">
        </div>
        <div class="book-list-details">
            <div class="book-list-meta">
                <span class="book-category">${book.category}</span>
                <div class="book-badge ${book.available ? 'badge-available' : 'badge-unavailable'}">
                    ${book.available ? 'Available' : 'Unavailable'}
                </div>
                <span class="book-rating">
                    <i class="fas fa-star"></i>
                    ${book.rating}
                </span>
            </div>
            <h3 class="book-list-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-year">Published: ${book.year}</p>
            <p class="book-list-description">${book.description}</p>
            <div class="book-list-actions">
                <button class="btn btn-outline">Details</button>
                <button class="btn btn-primary" ${!book.available ? 'disabled' : ''}>
                    ${book.available ? 'Borrow' : 'Reserve'}
                </button>
            </div>
        </div>
    `;
    
    return bookListItem;
}