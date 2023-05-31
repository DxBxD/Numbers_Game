'use strict'

// Exercise 9.b - Touch-Nums

    var gMusic = new Audio('sounds/8bit_breakdown.mp3')
    gMusic.loop = true
    gMusic.volume = 0.4
    var gWinSound = new Audio('sounds/win.mp3')
    var gFalseSound = new Audio('sounds/false.mp3')
    var gMarkedSound = new Audio('sounds/marked.mp3')
    gMarkedSound.volume = 0.2
    var gNums = []
    var gCurrNum = 1
    var gCellCount = 25
    var gDifficulty = 'normal'
    var gIsFirstClick = true
    var gIntervalId;
    var gTimeElapsedInMilliseconds = 0;

function onInit() {
    renderBoard()
}

function renderBoard(cellCount = gCellCount) {
    gCurrNum = 1
    createNumsArray()
    resetStopwatch()
    var strHTML = ''
    var currLength = Math.sqrt(cellCount)
    for (var i = 0; i < currLength; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < currLength; j++) {
            var currNum = gNums.pop()
            strHTML += `<td onclick="onCellClicked(this, ${currNum})">${currNum}</td>`
        }
        strHTML += '</tr>'
    }
    const table = document.querySelector('.board')
    table.classList.add(gDifficulty)
    table.innerHTML = strHTML
}

function onCellClicked(elCell, cellNum) {
    if (gIsFirstClick && elCell.innerText !== '🥳') {
        startStopwatch()
        const elH1 = document.querySelector('h1')
        elH1.classList.remove('blink_me')
        const elTimer = document.querySelector('.timer')
        elTimer.classList.remove('blink_me')
        gMusic.play()
        gIsFirstClick = false
    }
    elCell.classList.add("clicked")
        setTimeout(() => {
            elCell.classList.remove("clicked")
        }, 100)
    if (cellNum === gCurrNum) {
        gCurrNum++
        setTimeout(() => {
            elCell.classList.add("marked")
        }, 200)
        gMarkedSound.play()
        if (cellNum === gCellCount) {
            stopStopwatch()
            elCell.classList.remove("clicked")
            const elCells = document.querySelectorAll('td')
            const elTable = document.querySelector('.board')
            for (var i = 0; i < gCellCount; i++) {
                elCells[i].classList.add('finished')
                elCells[i].innerText = '🥳'
            }
            gIsFirstClick = true
            gMusic.pause()
            gWinSound.play()
            setTimeout(() => {
                elTable.classList.remove('finished')
                renderBoard()
                }, 5000)
        }
    } else {
        gFalseSound.play()
    }
}

function onButtonClicked(elBtn, difficultyCellCount, difficultyStr) {
    stopStopwatch()
    startStopwatch()
    const elTimer = document.querySelector('.timer')
    if (gIsFirstClick) {
        gMusic.play()
        const elH1 = document.querySelector('h1')
        elH1.classList.remove('blink_me')
        elTimer.classList.remove('blink_me')
        gIsFirstClick = false
    }
    elBtn.classList.add("clicked")
    setTimeout(() => {
    elBtn.classList.remove("clicked")
    }, 100)
    gCellCount = difficultyCellCount
    const table = document.querySelector('table')
    table.classList.remove(gDifficulty)
    gDifficulty = difficultyStr
    renderBoard()
}

function createNumsArray(min = 1, max = gCellCount) {
    for (var i = min; i <= max; i++) {
        gNums.push(i)
    }
    shuffle(gNums)
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [array[currentIndex], array[randomIndex]] =
            [array[randomIndex], array[currentIndex]]
    }
}

function startStopwatch() {
    gTimeElapsedInMilliseconds = 0;

    var timerDiv = document.querySelector('.timer');

    gIntervalId = setInterval(function() {
        gTimeElapsedInMilliseconds += 10;

        var milliseconds = gTimeElapsedInMilliseconds % 1000;
        var seconds = Math.floor((gTimeElapsedInMilliseconds / 1000) % 60);
        var minutes = Math.floor((gTimeElapsedInMilliseconds / (1000 * 60)) % 60);
        
        milliseconds = String(milliseconds).padStart(3, '0');
        seconds = String(seconds).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');

        timerDiv.textContent = `${minutes} : ${seconds} : ${milliseconds}`;
    }, 10);
}

function stopStopwatch() {
    clearInterval(gIntervalId);
}


function resetStopwatch() {
    gTimeElapsedInMilliseconds = 0;

    var timerDiv = document.querySelector('.timer');

    timerDiv.textContent = '00 : 00 : 000';
}
