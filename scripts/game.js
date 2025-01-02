window.onload = function () {
    console.log('Game started')
    //define constants
    let RADIUS = 120 / 2
    let SPEED = 15
    //define variables
    let canvas = document.getElementById("game-canvas")
    let context = canvas.getContext("2d")
    let width = canvas.width
    let height = canvas.height

    //{x:, row:, color:}
    let generateFlag = 0
    let circles = []
    circles.push(generateCircle())
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
    }, 33)
    //w, a, s, d
    let circleFillFLags = [0, 0, 0, 0]
    //change fill colors and check collisions
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'w':
                circleFillFLags[0] = 5
                break
            case 'a':
                circleFillFLags[1] = 5
                break
            case 's':
                circleFillFLags[2] = 5
                break
            case 'd':
                circleFillFLags[3] = 5
                break
            default:
                break
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
                context.fillStyle = 'red'
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
        colors = ['yellow', 'green', 'blue', 'orange']
        generateFlag = Math.floor(Math.random() * 11) + 15
        let x = width + RADIUS
        let row = Math.floor(Math.random() * 4)
        return { x: x, row: row, color: colors[row] }
    }
}

