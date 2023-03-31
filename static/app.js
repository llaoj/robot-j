const toastMe = `<div class="clearfix">
    <div class="toast fade show float-end my-2 w-50" role="alert">
        <div class="toast-header">
            <i class="bi bi-person-workspace me-2"></i>
            <strong class="me-auto">Me</strong>
            <small>11 mins ago</small>
        </div>
        <div class="toast-body bg-success bg-opacity-25">
            {{message}}
        </div>
    </div>
</div>`
const toastHe = `<div class="toast fade show my-2 w-50 toast-he" role="alert">
    <div class="toast-header">
        <i class="bi bi-robot me-2"></i>
        <strong class="me-auto">Robot J</strong>
        <small class="text-muted">just now</small>
    </div>
    <div class="toast-body">
        {{message}}
    </div>
</div>`
const chatBox = document.querySelector('#chatBox')

const waitingMessage = function () {
    chatBox.innerHTML += toastHe.replace('{{message}}', '<span class="waiting">...</span>')
    chatBox.scrollTop = chatBox.scrollHeight
}
const sendMessage = function (message) {
    chatBox.innerHTML += toastMe.replace('{{message}}', message)
    chatBox.scrollTop = chatBox.scrollHeight
    socket.send(message)
    waitingMessage()
}
const receivedMessage = function (message) {
    let toastBody = chatBox.querySelector('.toast-he:last-child .toast-body')
    toastBody.innerHTML = message
    chatBox.scrollTop = chatBox.scrollHeight
}
const submitTextMessage = function () {
    let input = document.querySelector('#textMessage')
    sendMessage(input.value)
    input.value = ''
    return false
}

const socket = new WebSocket("wss://robot-j.llaoj.cn/ws");
socket.addEventListener("open", (event) => {
    // socket.send("Hello Server!");
});
socket.addEventListener("message", (event) => {
    console.log(event.data);
    receivedMessage(event.data)
});


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
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const speak = document.querySelector('#speak');
// recognition.continuous = true;
speak.onclick = function () {
    recognition.start();
    console.log('Ready for your speech.');
    micon()
}
recognition.onresult = function (event) {
    console.log(event)
    let last = event.results.length - 1;
    let text = event.results[last][0].transcript;
    sendMessage(text)
};
recognition.onspeechend = function () {
    console.log('Stoped listening');
    recognition.stop();
    micoff()
}
recognition.onnomatch = function (event) {
    console.log('I didnt recognise your speech');
    micoff()
}
recognition.onerror = function (event) {
    console.log('Error occurred in recognition: ' + event.error);
    micoff()
}