const toastMe = `<div class="clearfix">
    <div class="toast fade show float-end" role="alert">
        <div class="toast-header">
            <i class="bi bi-person-workspace me-2"></i>
            <strong class="me-auto">Me</strong>
            <small>11 mins ago</small>
        </div>
        <div class="toast-body bg-success bg-opacity-25">
            {{words}}
        </div>
    </div>
</div>`
const toastHe = `<div class="toast fade show toast-he" role="alert">
    <div class="toast-header">
        <i class="bi bi-robot me-2"></i>
        <strong class="me-auto">Robot J</strong>
        <small class="text-muted">just now</small>
    </div>
    <div class="toast-body">
        {{words}}
    </div>
</div>`
const chatBox = document.querySelector('#chatBox')

const sendMessage = function (message) {
    chatBox.innerHTML += toastMe.replace('{{words}}', message)
}
const messageLoading = function () {
    chatBox.innerHTML += toastHe.replace('{{words}}', '<span class="loading">...</span>')
}
const receivedMessage = function (message) {
    let toastBody = chatBox.lastChild.querySelector('.toast-body')
    toastBody.innerHTML = message
}

const socket = new WebSocket("ws://localhost:8081/ws");
socket.addEventListener("open", (event) => {
    socket.send("Hello Server!");
});
socket.addEventListener("message", (event) => {
    console.log(event.data);
    receivedMessage(event.data)
});


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// recognition.continuous = true;
const speak = document.querySelector('#speak');
speak.onclick = function () {
    recognition.start();
    console.log('Ready for your speech.');
    micon()
}

recognition.onresult = function (event) {
    console.log(event)
    let last = event.results.length - 1;
    let text = event.results[last][0].transcript;
    console.log(text)
    socket.send(text)
    sendMessage(text)
    messageLoading()
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