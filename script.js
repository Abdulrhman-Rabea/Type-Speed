let req = new XMLHttpRequest();
req.open('GET', 'https://api.quotable.io/random/', true);
req.send();

let quoteElement = document.querySelector(".quote");
let quoteText = '';
const clickSound = document.getElementById('clickSound');
const wrongSound = document.getElementById('WrongSound');
const successfulTask = document.getElementById('successfulTask');

let Executable = true;
req.onreadystatechange = function () {
    if (req.status == 200 && req.readyState == 4 && Executable==true)  {
        let data = JSON.parse(req.responseText);
        quoteText = data.content;
        displayQuote(quoteText);
        processing()
        areAllSpansClassed()
    } 
};

function displayQuote(data) {
    let charIndex = 0;
    let charSpan = data.split("")
    charSpan.forEach(char => {
        let span = document.createElement(`span`)
        span.innerHTML = char
        quoteElement.appendChild(span);

    });
}


let StartTime = null;
let EndTime;
function processing() {
    let charIndex = 0;
    let UserChar;
    let quoteChar = quoteText[charIndex];
    const quoteSpans = document.querySelectorAll(".quote span");

    document.addEventListener("keydown", function (eve) {
        UserChar = eve.key;
        if (UserChar.toLowerCase() === quoteChar.toLowerCase()) {
            quoteSpans[charIndex].className = "correct"; // Update the specific span
            charIndex++;
            clickSound.play();
            if (StartTime === null) {
                StartTime = new Date
            }
            if (charIndex < quoteText.length) {
                quoteChar = quoteText[charIndex]; // Update quoteChar for the next character
            }
        } else {
            wrongSound.play()
        }
    });
    document.addEventListener("DOMContentLoaded", function () {
        quoteElement.focus();
    })
}
;

//function check if all span have class "correct"
function areAllSpansClassed() {
    document.addEventListener("keydown", function () {
        let QuoteElements = document.querySelectorAll(`span`)
        let QuoteElementsInArr = Array.from(QuoteElements)
        let AllCorrect = QuoteElementsInArr.every(ele => ele.classList.contains(`correct`))
        if (AllCorrect) {
            EndTime = new Date
            calcWPM()
            // StopPress() 
            console.log("all corrected task finished")
        }
    })

}

function calcWPM() {
    const timeSpentInMinutes = (EndTime - StartTime) / 60000;
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
// function StopPress() {
//     Executable = false;
//     console.log(Executable)
//     console.log("keyboard disabled")
//     document.removeEventListener("keydown");
// }
