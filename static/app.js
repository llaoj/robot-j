// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8081/ws");

// Connection opened
socket.addEventListener("open", (event) => {
    socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
});


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// recognition.continuous = true;

var speak = document.querySelector('#speak');
speak.onclick = function () {
    recognition.start();
    console.log('Ready for your speech.');
    micon()
}

recognition.onresult = function (event) {
    console.log(event)
    var last = event.results.length - 1;
    var text = event.results[last][0].transcript;
    console.log(text)
    socket.send(text);
};

recognition.onspeechend = function () {
    recognition.stop();
    micoff()
    console.log('Stoped listening.');
}

recognition.onnomatch = function (event) {
    console.log('I didnt recognise your speech');
}

recognition.onerror = function (event) {
    console.log('Error occurred in recognition: ' + event.error);
}

const micon = function () {
    var btnSpeak = document.querySelector('#speak')
    btnSpeak.setAttribute('disabled', '')
    var classVal = btnSpeak.getAttribute("class").replace("btn-outline-secondary", "btn-outline-danger")
    btnSpeak.setAttribute("class", classVal)

    var icon = btnSpeak.querySelector('.bi')
    classVal = icon.getAttribute("class").replace("bi-mic-mute", "bi-record-circle")
    icon.setAttribute("class", classVal)
}

const micoff = function () {
    var btnSpeak = document.querySelector('#speak')
    btnSpeak.removeAttribute('disabled')
    var classVal = btnSpeak.getAttribute("class").replace("btn-outline-danger", "btn-outline-secondary")
    btnSpeak.setAttribute("class", classVal)

    var icon = btnSpeak.querySelector('.bi')
    var classVal = icon.getAttribute("class").replace("bi-record-circle", "bi-mic-mute")
    icon.setAttribute("class", classVal)
}

