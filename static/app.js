const toastMe = `<div class="clearfix">
    <div class="toast fade show float-end my-2 w-50" role="alert">
        <div class="toast-header">
            <i class="bi bi-person-workspace me-2"></i>
            <strong class="me-auto">Me</strong>
        </div>
        <div class="toast-body bg-success bg-opacity-25">
            {{message}}
        </div>
    </div>
</div>`
const toastHe = `<div class="toast fade show my-2 w-75 toast-he" role="alert">
    <div class="toast-header">
        <i class="bi bi-robot me-2"></i>
        <strong class="me-auto">Robot J</strong>
    </div>
    <div class="toast-body">
        {{message}}
    </div>
</div>`
const chatBox = document.querySelector('#chatBox')
const btnSendText = document.querySelector('#sendText')
const btnTalk = document.querySelector('#talk')

const disableInput = function () {
    btnSendText.setAttribute('disabled', '')
    btnTalk.setAttribute('disabled', '')
}
const enableInput = function () {
    btnSendText.removeAttribute('disabled')
    btnTalk.removeAttribute('disabled')
}
const micon = function () {
    let classVal = btnTalk.getAttribute("class").replace("btn-outline-secondary", "btn-outline-danger")
    btnTalk.setAttribute("class", classVal)
    let icon = btnTalk.querySelector('.bi')
    classVal = icon.getAttribute("class").replace("bi-mic-mute", "bi-record-circle")
    icon.setAttribute("class", classVal)
}
const micoff = function () {
    let classVal = btnTalk.getAttribute("class").replace("btn-outline-danger", "btn-outline-secondary")
    btnTalk.setAttribute("class", classVal)
    let icon = btnTalk.querySelector('.bi')
    classVal = icon.getAttribute("class").replace("bi-record-circle", "bi-mic-mute")
    icon.setAttribute("class", classVal)
}

const synthesis = window.speechSynthesis;
const speak = function (message) {
    let utterance = new SpeechSynthesisUtterance();
    utterance.lang = 'zh-TW';
    utterance.text = message;
    synthesis.speak(utterance);
}

const waitingMessage = function () {
    disableInput()
    chatBox.innerHTML += toastHe.replace('{{message}}', '<p class="waiting">...</p>')
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
    toastBody.innerHTML = '<div style="white-space:pre-line;">' + message + '</div>'
    chatBox.scrollTop = chatBox.scrollHeight
    enableInput()
    speak(message)
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

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
btnTalk.onclick = function () {
    // recognition.continuous = true;
    recognition.start();
    console.log('Ready for your speech.');
    micon()
    disableInput()
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