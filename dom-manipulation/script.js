document.addEventListener('DOMContentLoaded', () => {
    // ... (other code)

    const exportButton = document.getElementById('exportButton');

    // Function to export quotes to JSON
    function exportToJson() {
        const dataStr = JSON.stringify(quotes);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'quotes.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', createAddQuoteForm);
    exportButton.addEventListener('click', exportToJson);
    importFile.addEventListener('change', importFromJsonFile);

    // Initial display of a random quote
    showRandomQuote();
});