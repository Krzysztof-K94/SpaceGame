export class Invader {
    constructor({position}){
        this.speed = 10;

        const image = new Image();
        image.src = './images/invader.png';
        image.onload = () => {
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y
            };
         };
    };
    
    draw(ctx){
        if(this.image){
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    };

    //move each enemy using grid velocity
    update(ctx, {velocity}){
        if(this.image){
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        };
            this.draw(ctx);
        };

    shoot(invaderProjectiles){
        invaderProjectiles.push(
            new InvaderProjectile({
                position: {
                    x: this.position.x + this.width/2, 
                    y: this.position.y + this.height},
                velocity: {
                    x: 0,
                    y: 5
                }}
            )
        )
    }
};


export class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;
        this.width = 4;
        this.height = 10;
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fill();
        ctx.closePath();
    };

    update(ctx) {
        this.draw(ctx);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };
};