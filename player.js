import {keys} from './script.js'

export class Player {
    constructor(){
        this.speed = 10;
        this.rotation = 0;
        this.opacity = 1;

        const image = new Image();
        image.src = './images/spaceship.png';
        image.onload = () => {
            const scale = 0.3;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x : (canvas.width / 2 - this.width / 2),
                y : canvas.height - this.height - 30
            };
         };
    };
    

    draw(ctx){

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.position.x + this.width/2, this.position.y + this.height/2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x - this.width/2, -this.position.y - this.height/2);
        
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        ctx.restore();
    };

    update(ctx){
        if(this.image){
            if(keys.right.pressed === true && this.position.x + this.width <= canvas.width){
                this.rotation = .15;
                this.position.x += this.speed;
            } 
            else if(keys.left.pressed === true && this.position.x >= 0){
                this.rotation = -.15;
                this.position.x -= this.speed;
            }
            else {
            this.rotation = 0;
            }
            this.draw(ctx);
        }
    }
};


export class Particle {
    constructor({position, velocity, radius, color, fades}){
        this.radius = radius;
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.opacity = 1;
        this.fades = fades;
    };

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };

    update(ctx) {
        this.draw(ctx);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.fades) {
            this.opacity -= 0.01;
        }
    };
};