const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
console.log(ctx)

canvas.width = window.innerWidth
canvas.height = window.innerHeight - 4
const gravity = 1.5

class Platform {
    constructor({x, y}) {
        this.position = {
            x,
            y
        }
        this.width = 200
        this.height = 20
    }

    draw() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 1
        }
        this.width = 20
        this.height = 20
    }

    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        platforms.forEach(platform => {
            platform.draw()
        })
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0
        }
    }
}

const player = new Player()
const platforms = [new Platform({x:200, y:100}), new Platform({x:600, y:200})]


const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function animate () {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    if(keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    } else if(keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0
        platforms.forEach(platform => {
            if(keys.right.pressed) {
                platform.position.x -= 5
            } else if(keys.left.pressed) {
                platform.position.x += 5
            }
        })
    }
    
    // Platform collision detection
    platforms.forEach(platform => {
        if(player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })
}

animate()

window.addEventListener('keydown', ({keyCode}) => {
    switch(keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            break
        case 68:
            console.log('right')
            keys.right.pressed = true
            break
        case 87:
            console.log('top')
            player.velocity.y -= 20
            break
        case 83:
            console.log('down')
            break
        
    }
})

window.addEventListener('keyup', ({keyCode}) => {
    switch(keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            break
        case 68:
            console.log('right')
            keys.right.pressed = false
            break
        case 87:
            console.log('top')
            break
        case 83:
            console.log('down')
            break
        
    }
})