import {Invader} from './invader.js';

export default class EnemyGrid {
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 2,
            y: 0
        }
        this.invaders = [];

        //rangom amount of enemies
        const rows = Math.floor(Math.random() * 8 + 2) ;
        const columns = Math.floor(Math.random() * 20 + 10);

        this.width = columns * 30; //30 width of the image

        //Making x,y enemy grid
        for(let x = 0; x < columns; x++){
            for(let y = 0; y < rows; y++){
                this.invaders.push(new Invader({position: {x: x * 30, y: y * 30}}));
            }
        }
    }

    update(ctx) {
        this.position.x += this.velocity.x;
        this.velocity.y = 0;

        //change direction when grid touch borders
        if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30;
        };
    }
}