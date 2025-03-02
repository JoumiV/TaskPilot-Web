
function getCurrentDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    };
    return now.toLocaleDateString('en-US', options);
}


const datetimeDisplay = document.querySelector('.datetime-display');
const tinyButton = document.querySelector('.tiny-button');

tinyButton.addEventListener('mouseover', () => {
    datetimeDisplay.textContent = getCurrentDateTime();
});