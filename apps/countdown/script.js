// Something lags here. No idea what. Timer count or animations?

TweenLite.defaultEase = Expo.easeOut;

function getMinutesFromURL() {
  const params = new URLSearchParams(window.location.search);
  const min = parseInt(params.get('min'), 10);
  if (!isNaN(min) && min >= 0 && min <= 99) {
    return min.toString().padStart(2, '0');
  }
  return '10'; // fallback a 10 minutos si no hay param válido
}

// initTimer("25:00"); // Set the time here
const min = getMinutesFromURL();
document.title = `Countdown ⌛️ ${min}:00`;
initTimer(`${min}:00`);

var reloadBtn = document.querySelector('.reload');
var timerEl = document.querySelector('.timer');

var audio = new Audio('http://soundbible.com/grab.php?id=1531&type=mp3');

function initTimer(t) {

  var self = this,
    timerEl = document.querySelector('.timer'),
    minutesGroupEl = timerEl.querySelector('.minutes-group'),
    secondsGroupEl = timerEl.querySelector('.seconds-group'),

    minutesGroup = {
      firstNum: minutesGroupEl.querySelector('.first'),
      secondNum: minutesGroupEl.querySelector('.second')
    },

    secondsGroup = {
      firstNum: secondsGroupEl.querySelector('.first'),
      secondNum: secondsGroupEl.querySelector('.second')
    };

  var time = {
    min: t.split(':')[0],
    sec: t.split(':')[1]
  };

  var timeNumbers;

  function updateTimer() {

    var timestr;
    var date = new Date();

    date.setHours(0);
    date.setMinutes(time.min);
    date.setSeconds(time.sec);

    var newDate = new Date(date.valueOf() - 1000);
    var temp = newDate.toTimeString().split(" ");
    var tempsplit = temp[0].split(':');

    time.min = tempsplit[1];
    time.sec = tempsplit[2];

    timestr = time.min + time.sec;
    timeNumbers = timestr.split('');
    updateTimerDisplay(timeNumbers);
    document.title = `⏳ ${time.min}:${time.sec}`;

    if (timestr === '0000')
      countdownFinished();

    if (timestr != '0000')
      setTimeout(updateTimer, 1000);

  }

  function updateTimerDisplay(arr) {

    animateNum(minutesGroup.firstNum, arr[0]);
    animateNum(minutesGroup.secondNum, arr[1]);
    animateNum(secondsGroup.firstNum, arr[2]);
    animateNum(secondsGroup.secondNum, arr[3]);

  }

  function animateNum(group, arrayValue) {

    TweenMax.killTweensOf(group.querySelector('.number-grp-wrp'));
    TweenMax.to(group.querySelector('.number-grp-wrp'), 1, {
      y: -group.querySelector('.num-' + arrayValue).offsetTop
    });

  }

  setTimeout(updateTimer, 1000);

}


function countdownFinished() {
  setTimeout(function() {
    TweenMax.set(reloadBtn, {
      scale: 0.8,
      display: 'block'
    });
    TweenMax.to(timerEl, 1, {
      opacity: 0.2
    });
    TweenMax.to(reloadBtn, 0.5, {
      scale: 1,
      opacity: 1
    });
  }, 1000);

  // Play gong SFX; GUI volume control?

  if (countdownFinished) {
    {
      audio.play()
    };
  }

}


reloadBtn.addEventListener('click', function() {
  TweenMax.to(this, 0.5, {
    opacity: 0,
    onComplete: function() {
      reloadBtn.style.display = "none";
    }
  });
  TweenMax.to(timerEl, 1, {
    opacity: 1
  });
  initTimer("10:00"); // Set re-run time here
});
