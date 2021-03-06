//Init SpeechSynth API
const synth = window.speechSynthesis;

// Dom elements
const play = document.getElementById("play");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

// Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();
  //   Loop through voices; create option for each voice
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement("option");
    // Fill option with the voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";
    // Set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  });
};
getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//Speak

const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error("already speaking");
    return;
  }
  if (textInput.value !== "") {
    //Add background animation if desired
    // body.style.background = "#141414 url(img/wave.gif)";
    // body.style.backgroundRepeat = "repeat-x";
    // body.style.backgroundSize = "100% 100%";
    //Get text to speak
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    //Speak end
    speakText.onend = e => {
      // body.style.background = "#141414";
    };
    //Speak error
    speakText.onerror = e => {
      console.error("Something went wrong...");
    };
    //Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name");
    //Loop through the voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });
    //Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    //Speak
    synth.speak(speakText);
  }
};

//pause
const pause = () => {
  synth.pause();
}

//Event listeners

//Play Audio
// play.addEventListener("click", e => {
//   e.preventDefault();
//   speak();
//   textInput.blur();
// });
$("#form").on('submit', function(e){
  e.preventDefault();
  speak();
  $("#play").hide();
  $("#pause").show();
  $("#resume").hide();
  $("#stop").show();
  textInput.blur();
});

$("#pause").on('click', function(){
  synth.pause();
  $("#play").hide();
  $("#pause").hide();
  $("#resume").show();
  $("#stop").show();
})

$("#stop").on('click', function(){
  synth.cancel();
  $("#play").show();
  $("#pause").hide();
  $("#resume").hide();
  $("#stop").hide();
})

$("#resume").on('click', function(){
  synth.resume();
  $("#play").hide();
  $("#pause").show();
  $("#resume").hide();
  $("#stop").show();
})

$(window).bind('beforeunload',function(){
  synth.cancel();
});

//Rate and pitch value change
rate.addEventListener("change", e => (rateValue.textContent = rate.value));
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

//Change on voice select
voiceSelect.addEventListener("change", e => speak());
