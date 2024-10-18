// connect to API and send request
let req = new XMLHttpRequest();
req.open('GET', 'https://api.api-ninjas.com/v1/quotes', true);
req.setRequestHeader('X-Api-Key', 'IwWp/GqgIUNfrp9px5dISg==c8eQoxk9tXerBeOu');
req.send();


let container = document.querySelector(`.container`)
let quoteElement = document.querySelector(".quote");
let quoteText = '';
let HiddenBTN = document.querySelector(`.first`)

const clickSound = document.getElementById('clickSound');
const wrongSound = document.getElementById('WrongSound');

const successfulTask = document.getElementById('successfulTask');

let StartTime = null;
let EndTime = null;

req.onreadystatechange = function () {
    if (req.status == 200 && req.readyState == 4) {
        let data = JSON.parse(req.responseText);
        quoteText = data[0].quote;
        displayQuote(quoteText);
        processing()
    }
};

function displayQuote(data) {
    let charSpan = data.split("")
    charSpan.forEach(char => {
        let span = document.createElement(`span`)
        span.innerHTML = char
        quoteElement.appendChild(span);

    });
}



function processing() {
    let charIndex = 0;
    let UserChar;
    let quoteChar = quoteText[charIndex];
    const quoteSpans = document.querySelectorAll(".quote span");
    //  keyboard handling
    HiddenBTN.addEventListener(`input`, function () {
        UserChar = HiddenBTN.value;
        if (UserChar.toLowerCase() === quoteChar.toLowerCase()) {
            clickSound.play();
            quoteSpans[charIndex].className = "correct"; // Update the specific span
            HiddenBTN.value = ""
            charIndex++;
            if (StartTime === null) {
                StartTime = new Date
            }
            if (charIndex < quoteText.length) {
                quoteChar = quoteText[charIndex]; // Update quoteChar for the next character
            }
        } else {
            wrongSound.play()
            HiddenBTN.value = ""
        }
    });
    
    areAllSpansClassed()
}
//function check if all span have class "correct"
function areAllSpansClassed() {
    document.addEventListener("input", function () {
        let QuoteElements = document.querySelectorAll(`span`)
        let QuoteElementsInArr = Array.from(QuoteElements)
        let AllCorrect = QuoteElementsInArr.every(ele => ele.classList.contains(`correct`))
        if (AllCorrect) {
            EndTime = new Date
            console.log("all corrected task finished")
            calcWPM()
        }
    })

}

function calcWPM() {
    const timeSpentInMinutes = (EndTime.getMinutes() - StartTime.getMinutes())  ;
    const adjustedTimeSpentInMinutes = Math.max(timeSpentInMinutes, 0.01); // Ensure a minimum time of 0.01 minutes to avoid zero
    const numberOfWords = quoteText.split(" ").length;
    const WPM = Math.round(numberOfWords / adjustedTimeSpentInMinutes);
    successfulTask.play()
    Swal.fire({
        title: `Your speed is ${WPM} WPM`,
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
    rgba(0,0,123,0.4)
    url("/images/nyan-cat.gif")
    left top
    no-repeat
`
    });
}

container.onclick = function () {
    HiddenBTN.focus()
}

window.onload=function (){container.focus()}