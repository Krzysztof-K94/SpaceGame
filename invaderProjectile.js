export default class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;
        this.width = 4;
        this.height = 10;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fill();
        ctx.closePath();
    }

    update(ctx) {
        this.draw(ctx);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
};