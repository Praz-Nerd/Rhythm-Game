window.onload = function () {
    console.log('Game started')
    //define constants
    let RADIUS = 120 / 2
    let SPEED = 20
    //define variables
    let canvas = document.getElementById("game-canvas")
    let context = canvas.getContext("2d")
    let width = canvas.width
    let height = canvas.height

    //{x:, row:, color:}
    let generateFlag = 0
    let circles = []
    circles.push(generateCircle())
    let animations = []
    //game loop
    let interval = setInterval(function () {
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
        for (let i = 0; i < circles.length; i++) {
            if (circles[i].x < 0) circles.splice(i, 1)
        }
        drawAnimations()
    }, 33)
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
        generateFlag = Math.floor(Math.random() * 21) + 25
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
                console.log("hit: "+rowIndex);
                circles.splice(i, 1)
                animations.push({ x: targetX, y: targetY, radius: RADIUS, frame: 10 })
                break
            }
        }
    }

    function drawAnimations() {
        for (let i = animations.length - 1; i >= 0; i--) {
            let anim = animations[i]
            context.beginPath()
            context.arc(anim.x, anim.y, anim.radius, 0, 2 * Math.PI)
            context.strokeStyle = 'aqua'
            context.lineWidth = 3
            context.stroke()
            anim.radius += 2
            anim.frame--
            if (anim.frame <= 0) animations.splice(i, 1)
        }
    }
}

