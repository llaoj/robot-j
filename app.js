const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// recognition.continuous = true;

var speak = document.querySelector('#speak');
speak.onclick = function () {
    recognition.start();
    console.log('Ready for your speech.');
}

recognition.onresult = function (event) {
    console.log(event)
    var last = event.results.length - 1;
    var text = event.results[last][0].transcript;
    console.log(text)
};

recognition.onspeechend = function () {
    recognition.stop();
    var bimic = document.querySelector('.bi-mic')
    var classVal = bimic.getAttribute("class").replace("bi-mic", "bi-mic-mute")
    bimic.setAttribute("class", classVal)
    console.log('Stoped listening.');
}

recognition.onnomatch = function (event) {
    console.log('I didnt recognise your speech');
}

recognition.onerror = function (event) {
    console.log('Error occurred in recognition: ' + event.error);
}