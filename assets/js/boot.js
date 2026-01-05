const bar = document.getElementById('progress');
const enter = document.getElementById('enter');
let percent = 0;

const interval = setInterval( () => {
    if (percent >= 100) { clearInterval(interval); return}
    percent +=4;
    const blocks ="▉".repeat(Math.floor(percent / 10));
    const spaces = " ".repeat(10 - Math.floor(percent / 10));
    bar.textContent = `${blocks}${spaces}    ${percent}%`;
    if (percent == 100) enter.hidden = false;
}, 200);

//Press ENTER to start
// document.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter') {
//         document.body.style.transition = 'opacity 1s ease';
//         document.body.style.opacity = '0';
//         setTimeout(() => {window.location.href = 'index.html'; }, 100)
//     }
// })

let canStart = false;

// Minimum boot time (3 seconds)
setTimeout(() => {
    canStart = true;
}, 3000);

function startPortfolio() {
    if (!canStart) return; // ignore early input

    document.body.style.transition = 'opacity 1s ease';
    document.body.style.opacity = '0';

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 100);
}

// Keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        startPortfolio();
    }
});

// Mouse / touch
document.addEventListener('click', () => {
    startPortfolio();
});


//loading lines
const lines = document.querySelectorAll('.line');
let i = 0;
const showNext = () => {
  if (i < lines.length) {
    lines[i].style.visibility = 'visible';
    i++;
    setTimeout(showNext, 800 + Math.random()*300);
  } else {
    document.querySelector('.progress').style.visibility = 'visible';
    document.querySelector('.blink').style.visibility = 'visible';
  }
};
showNext();
