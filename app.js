const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";

// Selecting necessary elements
const fromCurrency = document.querySelector("select[name='from']");
const toCurrency = document.querySelector("select[name='to']");
const amountInput = document.querySelector("input");
const convertButton = document.querySelector("button");
const resultMessage = document.querySelector(".msg");
const form = document.querySelector("form");
const fromFlag = document.querySelector(".from img");
const toFlag = document.querySelector(".to img");

// Function to update flag images based on selected currency
function updateFlag(element, currencyCode) {
    const countryCode = currencyCode.slice(0, 2).toUpperCase(); // Extract first two letters (approximate match)
    element.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Function to load currency list
async function loadCurrencies() {
    try {
        const response = await fetch(`${BASE_URL}/currencies.json`);
        const data = await response.json();
        
        Object.keys(data).forEach(currency => {
            let option1 = document.createElement("option");
            option1.value = currency;
            option1.textContent = currency.toUpperCase();
            fromCurrency.appendChild(option1);

            let option2 = document.createElement("option");
            option2.value = currency;
            option2.textContent = currency.toUpperCase();
            toCurrency.appendChild(option2);
        });

        // Set default values
        fromCurrency.value = "usd";
        toCurrency.value = "inr";
        updateFlag(fromFlag, "us"); // Default flag for USD
        updateFlag(toFlag, "in"); // Default flag for INR
    } catch (error) {
        console.error("Error loading currency list:", error);
    }
}

// Function to fetch and display exchange rate
async function getExchangeRate(event) {
    event.preventDefault(); // Prevents form submission refresh

    const from = fromCurrency.value.toLowerCase();
    const to = toCurrency.value.toLowerCase();
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        resultMessage.innerText = "Please enter a valid amount.";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/currencies/${from}.json`);
        const data = await response.json();

        if (!data[from] || !data[from][to]) {
            resultMessage.innerText = "Invalid currency selection.";
            return;
        }

        let rate = data[from][to];
        let total = (amount * rate).toFixed(2);
        resultMessage.innerText = `${amount} ${from.toUpperCase()} = ${total} ${to.toUpperCase()}`;
    } catch (error) {
        resultMessage.innerText = "Error fetching exchange rate.";
        console.error(error);
    }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", loadCurrencies);
form.addEventListener("submit", getExchangeRate);

// Update flag images when dropdown selection changes
fromCurrency.addEventListener("change", () => updateFlag(fromFlag, fromCurrency.value));
toCurrency.addEventListener("change", () => updateFlag(toFlag, toCurrency.value));
