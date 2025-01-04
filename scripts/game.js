window.onload = function () {
    console.log('Game started')
    //define constants
    let DEFAULT_SCORE = 120
    let RADIUS = 120 / 2
    let SPEED = 20
    let GENERATE_FLAG_RANDOM = 21
    let GENERATE_FLAG_MIN = 25
    let GRADES = ["D", "C", "B", "A", "S"]
    //define variables
    let startButton = document.getElementById("start-btn")
    let easyButton = document.getElementById("easy-btn")
    let mediumButton = document.getElementById("medium-btn")
    let hardButton = document.getElementById("hard-btn")
    let scoreDisplay = document.getElementById("score-display")
    let healthDisplay = document.getElementById("health-display")
    let gradeDisplay = document.getElementById("grade-display")
    let canvas = document.getElementById("game-canvas")
    let context = canvas.getContext("2d")
    let width = canvas.width
    let height = canvas.height
    let health = 5
    let score = 0
    let combo = 0
    let comboMultiplier = 1
    let currentGrade = 0

     // Sound setup
     let song = new Audio('sounds/song2.mp3');
     let clickSound = new Audio('sounds/click1.wav')
     let failureSound = new Audio('sounds/failure.mp3');
 
     let songSegment = 0; // Keeps track of song progress (in seconds)
     let songPlaying = false;
     let songPlaybackTimeout = null;
     let songLimit = 40;

    //DIFFICULTY SETTINGS
    function changeDifficulty(speed, flagRandom, flagMin, sngLimit, sng){
        SPEED = speed
        GENERATE_FLAG_RANDOM = flagRandom
        GENERATE_FLAG_MIN = flagMin
        songLimit = sngLimit
        song = sng
        if(interval != null) clearInterval(interval)
    }

    easyButton.addEventListener("click", function(){
        changeDifficulty(10, 21, 25, 40, new Audio('sounds/song1.mp3'))
    })

    mediumButton.addEventListener("click", function(){
        changeDifficulty(20, 21, 25, 30, new Audio('sounds/song2.mp3'))
    })

    hardButton.addEventListener("click", function(){
        changeDifficulty(30, 6, 11, 26, new Audio('sounds/song3.mp3'))
    })

    // Play song segment
    function playSongSegment() {
        if (!songPlaying) {
            song.play(); // Continue from current position
            songPlaying = true;
        }

        if (songPlaybackTimeout) {
            clearTimeout(songPlaybackTimeout);
        }

        songPlaybackTimeout = setTimeout(() => {
            song.pause();
            songPlaying = false;
        }, 2000);
    }
    
    // Function to stop the song immediately on a miss
    function stopSong() {
        if (songPlaybackTimeout) {
            clearTimeout(songPlaybackTimeout); // Clear the timeout
        }
        song.pause(); // Pause the song, allowing resumption later
        songPlaying = false;
    }

    function playSound(sound){
        sound.currentTime = 0
        sound.play()
    }

    //{x:, row:, color:}
    let generateFlag = 0
    let circles = []
    circles.push(generateCircle())
    let animations = []

    //GAME LOOP
    let interval = null
    //start button behaviour
    startButton.addEventListener("click", function(){
        //reset screen info
        health = 5
        score = 0
        combo = 0
        comboMultiplier = 1
        currentGrade = 0
        scoreDisplay.innerHTML = score
        healthDisplay.innerHTML = health
        gradeDisplay.innerHTML = GRADES[currentGrade]
        circles = []
        circles.push(generateCircle())
        context.clearRect(0, 0, width, height)
        songSegment = 0

        if(interval != null) clearInterval(interval)
        interval = setInterval(gameLoop, 33)
    })

    function gameLoop(){
        context.clearRect(0, 0, width, height)
        drawGrid()
        generateFlag--
        if (generateFlag == 0) {
            //generate circle and add to array
            circles.push(generateCircle())
        }
        for (let i = 0; i < circles.length; i++) {
            circles[i].x -= SPEED
            drawCircle(circles[i])
        }
        //checks if circle leaves the screen
        for (let i = 0; i < circles.length; i++) {
            if (circles[i].x < 0){
                circles.splice(i, 1)
                healthDisplay.innerHTML = --health
                if(currentGrade > 0) gradeDisplay.innerHTML = GRADES[--currentGrade]
                combo = 0
                comboMultiplier = 1
                stopSong()
                
                playSound(failureSound)
            } 
        }
        if(health <= 0){
            clearInterval(interval)
            alert("Game over...\nScore: " + score)
        }
        if(songSegment >= songLimit){
            clearInterval(interval)
            alert("Congratulations! You have completed the game!\nScore: " + score + 
                "\nYour grade is " + GRADES[currentGrade])
        }
        if(songPlaying){
            songSegment += 0.033
            console.log(songSegment)
        }
        drawAnimations()
    }

    //w, a, s, d
    let circleFillFLags = [0, 0, 0, 0]
    //change fill colors and check collisions
    document.addEventListener('keydown', function (e) {
        let rowIndex = -1
        switch (e.key) {
            case 'w':
                rowIndex = 0
                break
            case 'a':
                rowIndex = 1
                break
            case 's':
                rowIndex = 2
                break
            case 'd':
                rowIndex = 3
                break
            default:
                break
        }
        if (rowIndex !== -1) {
            circleFillFLags[rowIndex] = 5
            checkCollision(rowIndex)
        }
    })


    function drawGrid() {
        //letters array
        let letters = ['W', 'A', 'S', 'D']
        //definig context styles
        context.font = '60px arial'
        context.textAlign = 'center'
        context.strokeStyle = 'black'
        context.fillStyle = 'black'
        context.lineWidth = 1
        //draw gridlines
        context.beginPath()
        for (let i = 1; i <= 3; i++) {
            context.moveTo(0, height / 4 * i)
            context.lineTo(width, height / 4 * i)
        }
        context.stroke()
        //draw circles inside
        for (let i = 0; i < 4; i++) {
            let x = height / 8
            let y = (height / 8 + (height / 4 * (i)))
            context.beginPath()
            context.arc(x, y, 130 / 2, 0, 2 * Math.PI)
            context.stroke()
            if(circleFillFLags[i] > 0){
                context.fillStyle = 'silver'
                context.fill()
                circleFillFLags[i]--
                context.fillStyle = 'black'
            }
            
            context.fillText(letters[i], x, y + 25)
        }
    }

    function drawCircle(circle) {
        let y = (height / 8 + (height / 4 * (circle.row)))
        context.strokeStyle = circle.color
        context.fillStyle = circle.color
        context.beginPath()
        context.arc(circle.x, y, RADIUS, 0, 2 * Math.PI)
        context.fill()
    }

    function generateCircle() {
        colors = ['red', 'green', 'blue', 'orange']
        generateFlag = Math.floor(Math.random() * GENERATE_FLAG_RANDOM) + GENERATE_FLAG_MIN
        let x = width + RADIUS
        let row = Math.floor(Math.random() * 4)
        return { x: x, row: row, color: colors[row] }
    }

    function checkCollision(rowIndex){
        for (let i = 0; i < circles.length; i++) {
            let circle = circles[i]
            let targetX = height / 8
            let targetY = height / 8 + (height / 4 * rowIndex)
            let dist = Math.abs(circle.x - targetX)
            if (circle.row === rowIndex && dist <= RADIUS+10) {
                //update score and grade
                combo++
                if(combo%5 == 0) comboMultiplier++
                if(combo%8 == 0) currentGrade++
                score += (DEFAULT_SCORE-dist)*comboMultiplier
                scoreDisplay.innerHTML = score
                gradeDisplay.innerHTML = GRADES[currentGrade]
                //play animation
                circles.splice(i, 1)
                animations.push({ x: targetX, y: targetY, radius: RADIUS, frame: 10, dist: dist })
                //play click sound
                playSound(clickSound)
                //play more of the song
                playSongSegment()
                return true
            }
        }
        //bad collision
        combo = 0
        comboMultiplier = 1
        stopSong()
        
        playSound(failureSound)
        return false
    }

    function drawAnimations() {
        for (let i = animations.length - 1; i >= 0; i--) {
            let anim = animations[i]
            context.beginPath()
            context.arc(anim.x, anim.y, anim.radius, 0, 2 * Math.PI)
            //change animation color based on distance
            if(anim.dist >= 0 && anim.dist < 15)context.strokeStyle = 'aqua'
            else if(anim.dist >= 15 && anim.dist < 30) context.strokeStyle = 'green'
            else context.strokeStyle = 'yellow'

            context.lineWidth = 3
            context.stroke()
            anim.radius += 2
            anim.frame--
            if (anim.frame <= 0) animations.splice(i, 1)
        }
    }
}

