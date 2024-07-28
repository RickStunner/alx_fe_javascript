document.addEventListener('DOMContentLoaded', () => {
    // Retrieve quotes from local storage or use default quotes
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "The only impossible journey is the one you never begin.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" }
    ];

    // Get the last selected category from local storage
    let lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteButton');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const exportButton = document.getElementById('exportButton');
    const importFile = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');

    // Function to save quotes to local storage
    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Function to display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>- ${quote.category}</em></p>`;
    }

    // Function to add a new quote and update the DOM
    function createAddQuoteForm() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text && category) {
            // Add the new quote to the quotes array
            const newQuote = { text, category };
            quotes.push(newQuote);

            // Save quotes to local storage
            saveQuotes();

            // Update categories and filter options
            updateCategoryFilter();

            // Clear the input fields
            newQuoteText.value = '';
            newQuoteCategory.value = '';

            alert('Quote added successfully!');
        } else {
            alert('Please enter both a quote and a category.');
        }
    }

    // Function to export quotes to JSON using Blob
    function exportToJson() {
        const dataStr = JSON.stringify(quotes);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const exportFileDefaultName = 'quotes.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', exportFileDefaultName);
        document.body.appendChild(linkElement); // Append to body
        linkElement.click();
        document.body.removeChild(linkElement); // Remove from body after clicking

        URL.revokeObjectURL(url);
    }

    // Function to import quotes from JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            updateCategoryFilter();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Function to populate the category filter dropdown
    function updateCategoryFilter() {
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

    // Function to filter quotes based on selected category
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem('selectedCategory', selectedCategory);
        lastSelectedCategory = selectedCategory;
        if (selectedCategory === 'all') {
            showRandomQuote();
        } else {
            const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
            if (filteredQuotes.length > 0) {
                const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
                const quote = filteredQuotes[randomIndex];
                quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>- ${quote.category}</em></p>`;
            } else {
                quoteDisplay.textContent = "No quotes available for this category.";
            }
        }
    }

    // Event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', createAddQuoteForm);
    exportButton.addEventListener('click', exportToJson);
    importFile.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);

    // Initial setup
    updateCategoryFilter();
    filterQuotes(); // Apply the last selected filter
});