document.addEventListener('DOMContentLoaded', () => {
    // Initialize quotes from local storage or default values
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { id: 1, text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { id: 2, text: "The only impossible journey is the one you never begin.", category: "Inspiration" },
        { id: 3, text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" }
    ];

    // Fetching quotes from the server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const serverQuotes = await response.json();

            // Simulate mapping server data to our local format
            const formattedQuotes = serverQuotes.map(post => ({
                id: post.id,
                text: post.title,
                category: "General"
            }));

            return formattedQuotes;
        } catch (error) {
            console.error('Failed to fetch quotes from server:', error);
            return [];
        }
    }

    // Sync quotes with the server
    async function syncQuotesWithServer() {
        const serverQuotes = await fetchQuotesFromServer();
        const newQuotes = serverQuotes.filter(serverQuote =>
            !quotes.some(localQuote => localQuote.id === serverQuote.id)
        );

        if (newQuotes.length > 0) {
            quotes = [...quotes, ...newQuotes];
            saveQuotes();
            populateCategories();
            alert('New quotes have been added from the server.');
        }
    }

    // Add a new quote locally and sync with the server
    async function addNewQuoteToServer(quote) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({
                    title: quote.text,
                    body: '',
                    userId: 1
                })
            });
            const serverQuote = await response.json();
            return {
                id: serverQuote.id,
                text: serverQuote.title,
                category: quote.category
            };
        } catch (error) {
            console.error('Failed to add quote to the server:', error);
            return null;
        }
    }

    // Function to save quotes to local storage
    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Add a new quote and update the DOM
    async function createAddQuoteForm() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text && category) {
            // Add the new quote to the quotes array
            const newQuote = { text, category };
            const serverQuote = await addNewQuoteToServer(newQuote);

            if (serverQuote) {
                quotes.push(serverQuote);
                saveQuotes();
                populateCategories();
                alert('Quote added successfully!');
            } else {
                alert('Failed to add the quote. Please try again.');
            }

            newQuoteText.value = '';
            newQuoteCategory.value = '';
        } else {
            alert('Please enter both a quote and a category.');
        }
    }

    // Populate categories in the dropdown
    function populateCategories() {
        const categories = new Set(quotes.map(q => q.category));
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        categoryFilter.value = lastSelectedCategory;
    }

    // Filter quotes based on selected category
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem('selectedCategory', selectedCategory);
        lastSelectedCategory = selectedCategory;

        const filteredQuotes = selectedCategory === 'all' ?
            quotes :
            quotes.filter(q => q.category === selectedCategory);

        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const quote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>- ${quote.category}</em></p>`;
        } else {
            quoteDisplay.textContent = "No quotes available for this category.";
        }
    }

    // Initial setup
    populateCategories();
    filterQuotes();

    // Event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', createAddQuoteForm);
    exportButton.addEventListener('click', exportToJson);
    importFile.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);

    // Periodically sync with server
    setInterval(syncQuotesWithServer, 10000); // Check for new quotes every 10 seconds
});