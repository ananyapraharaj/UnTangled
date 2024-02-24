const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight 



class Player{
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.rotation = 0
    }
    draw(){
        c.save()

        c.translate(this.position.x,this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)

        c.arc(this.position.x,this.position.y, 5, 0, Math.PI * 2, false)
        c.fillStyle = "green"
        c.fill()

        //c.fillStyle = "blue"
       // c.fillRect(this.position.x,this.position.y,100,100)

        c.beginPath()
        c.moveTo(this.position.x + 30, this.position.y)
        c.lineTo(this.position.x - 10, this.position.y - 10)
        c.lineTo(this.position.x - 10, this.position.y + 10)
        c.closePath()

        c.strokeStyle = "White"
        c.stroke()
        c.restore()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Projectile{
    constructor({position, velocity}) {
        this.position = position
        this.velocity = this.velocity
        this.radius = 5
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        c.closePath()
        c.fillStyle = "red"
        c.fill()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y


    }
}
const player = new Player({
    position: {x: canvas.width / 2, y: canvas.height / 2 },
    velocity: {x:0, y:0},
}
)


//console.log(player)

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

const SPEED = 3
const ROTI_SPEED = 0.05
const FRICTION = 0.97

const projectiles = []

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width,canvas.height)

    player.update()

    console.log('animate')

    player.draw()

    projectiles.forEach()

   
    if (keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED
        player.velocity.y = Math.sin(player.rotation) * SPEED

    } else if(!keys.w.pressed){
        player.velocity.x *= FRICTION
        player.velocity.y *= FRICTION
    }
    if (keys.d.pressed) player.rotation += ROTI_SPEED
        else if (keys.a.pressed) player.rotation -= ROTI_SPEED
}
animate()

window.addEventListener("keydown" , (event) => {
    switch(event.code){
        case "KeyW":
            keys.w.pressed = true
            break
        case "KeyA":
            keys.a.pressed = true
            break
        case "KeyS":
            keys.s.pressed = true
            break
        case "KeyD":
            keys.d.pressed = true
            break
        case "Space":
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x,
                    y: player.position.y,

                },
                velocity: {
                    x: 1,
                    y: 0,
                },
            }))
    }
}
)

window.addEventListener("keyup" , (event) => {
    switch(event.code){
        case "KeyW":
            keys.w.pressed = false
            break
        case "KeyA":
            keys.a.pressed = false
            break
        case "KeyS":
            keys.s.pressed = false
            break
        case "KeyD":
            keys.d.pressed = false
            break
    }
}
)