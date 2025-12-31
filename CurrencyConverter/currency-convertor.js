document.addEventListener("DOMContentLoaded", () => {

     const BASE_URL = "https://api.frankfurter.app/latest";

     const dropdowns = document.querySelectorAll(".dropdown select");
     const btn = document.querySelector("form button");
     const fromCurr = document.querySelector(".from select");
     const toCurr = document.querySelector(".to select");
     const msg = document.querySelector(".msg");
     const amountInput = document.querySelector(".amount input");

     // Populate currency dropdowns
     for (let select of dropdowns) {
          for (let currCode in countryList) {
               let option = document.createElement("option");
               option.value = currCode;
               option.innerText = currCode;

               if (select.name === "from" && currCode === "USD") option.selected = true;
               if (select.name === "to" && currCode === "INR") option.selected = true;

               select.appendChild(option);
          }

          select.addEventListener("change", (e) => updateFlag(e.target));
     }

     async function updateExchangeRate() {
          let amtVal = amountInput.value;
          if (!amtVal || amtVal < 1) {
               amtVal = 1;
               amountInput.value = 1;
          }

          const from = fromCurr.value;
          const to = toCurr.value;

          const url = `${BASE_URL}?amount=${amtVal}&from=${from}&to=${to}`;
          console.log("Fetching:", url);

          msg.innerText = "Fetching exchange rate...";

          try {
               const response = await fetch(url);
               if (!response.ok) throw new Error("API error");

               const data = await response.json();
               const rate = data.rates[to];

               msg.innerText = `${amtVal} ${from} = ${rate.toFixed(2)} ${to}`;
          } catch (error) {
               console.error(error);
               msg.innerText = "Error fetching exchange rate";
          }
     }

     function updateFlag(element) {
          const countryCode = countryList[element.value];
          element.parentElement.querySelector("img").src =
               `https://flagsapi.com/${countryCode}/flat/64.png`;
     }

     btn.addEventListener("click", updateExchangeRate);

     // Initial load
     updateExchangeRate();
});
