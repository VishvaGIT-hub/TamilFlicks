document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('movie-search');
    if (!searchInput) return;
    const searchForm = searchInput.closest('form');

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results';
    resultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 0 0 4px 4px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        text-align: left;
    `;

    const container = searchInput.parentElement;
    container.style.position = 'relative';
    container.appendChild(resultsContainer);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        const matches = movieDB.filter(m => m.title.toLowerCase().includes(query)).slice(0, 15);

        if (matches.length > 0) {
            resultsContainer.innerHTML = matches.map(m => {
                // Highlight the matching part
                const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                const highlightedTitle = m.title.replace(regex, '<strong style="color: #308bcf;">$1</strong>');

                return `
                <a href="${m.url}" class="search-item" style="display: block; padding: 10px 15px; border-bottom: 1px solid #eee; text-decoration: none; color: #333; font-size: 14px; transition: 0.2s;">
                    ${highlightedTitle}
                </a>
                `;
            }).join('');

            // Add hover effects for usability
            const items = resultsContainer.querySelectorAll('.search-item');
            items.forEach(item => {
                item.addEventListener('mouseover', () => {
                    item.style.background = '#f0f8ff';
                    item.style.color = '#000';
                });
                item.addEventListener('mouseout', () => {
                    item.style.background = 'transparent';
                    item.style.color = '#333';
                });
            });

            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.innerHTML = '<div style="padding: 15px 20px; color: #666;">No movies found.</div>';
            resultsContainer.style.display = 'block';
        }
    });

    // Handle Enter and Form Submit (Pic 2 Fix)
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstResult = resultsContainer.querySelector('.search-item');
            if (firstResult) {
                window.location.href = firstResult.getAttribute('href');
            }
        }
    });

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstResult = resultsContainer.querySelector('.search-item');
            if (firstResult) {
                window.location.href = firstResult.getAttribute('href');
            }
        });
    }

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
});
