import {Invader, InvaderProjectile} from './invader.js';
import {Player, Particle} from './player.js';
import Projectile from './projectile.js';
import EnemyGrid from './enemyGrid.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreNumber');


canvas.height = 576;
canvas.width = 1024;

 const keys = {
    left : {
        pressed: false
    },
    right : {
        pressed : false
    },
    space : {
        pressed : false
    }
};

const player = new Player();

const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];

let game = {
    over: false,
    active: true
};
let throttle = true;
let frames = 0;
//interval for making grids enemy
let randomInterval = Math.floor(Math.random() * 500) + 500;

let score = 0;

//render background stars
for(let i = 0; i < 100; i++) {
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
        },
        velocity: {
            x: 0,
            y: 0.5,
        },
        radius: Math.random() * 2,
        color: 'white',
        fades: false,
     }));
}



const createParticles = ({object, color, fades}) =>{
    //before projectile will pass player, function gonna run many times. Throttle technique prevent that and code will be
    //executed only after specific time. It will cause that not every hitted enemy will render expolosion
    if(throttle){
        throttle = false;
        for(let i = 0; i < 15; i++) {
            particles.push(new Particle({
                position: {
                    x: object.position.x + object.width/2,
                    y: object.position.y + object.height/2,
                },
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2,
                },
                radius: Math.random() * 3,
                color: color,
                fades: fades,
             }));
        }
        setTimeout(() => {
            throttle = true;
        }, 200)
    }

};

function animate() {
    if(!game.active) {
        ctx.font = "100px Arial";
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over', canvas.width/2, canvas.height/2);

        return;
    };
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    player.update(ctx);

    //render explosion
    particles.forEach((particle, index) => {
        if(particle.position.y >= canvas.height) {
            particle.position.y = -particle.radius;
            particle.position.x = Math.random() * canvas.width;
        }

        if(particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(index, 1);
            }, 0);
        } else particle.update(ctx);
    });

    //display invader projectiles
    invaderProjectiles.forEach((invaderProjectile, index) => {
 
        //remove projectile from array when its go belowe screen
        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
            setTimeout(() => {
                invaderProjectiles.splice(index,1);
            },0)
        } else invaderProjectile.update(ctx);

        //collision detection of projectile with player
        if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y
           && invaderProjectile.position.x + invaderProjectile.width >= player.position.x
           && invaderProjectile.position.x <= player.position.x + player.width){
            //add player explosion
            createParticles({object: player, color: 'yellow', fades: true});

            setTimeout(() => {
                player.opacity = 0;
                game.over = true;
                invaderProjectiles.splice(index,1);
            },0)

            setTimeout(() => {
                game.active = false;
            },2000)
            return;
        }
    });

    //Shooting with space
    if(keys.space.pressed === true){
        projectiles.push(
            new Projectile({
                position: {
                    x: player.position.x + player.width/2,
                    y: player.position.y},
                velocity: {
                    x: 0,
                    y: -10}}
            )
        );
    };
    //display player projectiles
    projectiles.forEach((projectile, i) => {
        //delete from array when projectile touch border
         if(projectile.position.y + projectile.radius <= 0 || projectile.position.x <= 0 || projectile.position.x >= canvas.width){
             setTimeout(() => {
                projectiles.splice(i,1);
             }, 0); 
         }
         else {
            projectile.update(ctx);
         }
    });

    //display and update enemy grid
    grids.forEach((grid, gridIndex) => {
        grid.update();
        //spawning random invader projectile
        if(frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
        } 
        grid.invaders.forEach((invader, i) => {
            invader.update(ctx, {velocity: grid.velocity});
            //check if projectiles hit a enemy
            projectiles.forEach((projectile, j)=> {
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height
                    && projectile.position.y + projectile.radius >= invader.position.y
                    && projectile.position.x + projectile.radius >= invader.position.x
                    && projectile.position.x - projectile.radius <= invader.position.x + invader.width
                ){
                    //SetTimeout prevents enemies from flashing
                    setTimeout(() =>{
                        const invaderFound = grid.invaders.find(invader2 => invader2 === invader);
                        const projectileFound = projectiles.find(projectile2 => projectile2 === projectile);
                            
                        //remove invader and projectile
                        if(invaderFound && projectileFound) {
                            score += 15;
                            scoreEl.innerHTML = score;

                            createParticles({object: invader, color:'#BAA0DE', fades: true});

                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);

                            //calculate new grid position after deletting invaders, to bounce of the wall at the right moment
                            //if grid doesnt have any more invaders insiede, delete grid from grids array
                            if(grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            }
                            else {
                                grids.splice(gridIndex, 1);
                            }
                        }
                    }, 0)
                }
            });
        })
    });

    //spawning new enemies
    if(frames % randomInterval === 0) {
        grids.push(new EnemyGrid());
        randomInterval = Math.floor(Math.random() * 500) + 500;
        frames = 0;
    }
    
    requestAnimationFrame(animate);

    frames++;
}


animate()




addEventListener('keydown', ({code}) => {
    if(game.over === false) {
        switch(code) {
            case 'KeyA' : keys.left.pressed = true;
            break;
            case 'KeyD' : keys.right.pressed = true;
            break;
            case 'Space': if(event.repeat) {
                keys.space.pressed = false;
                return;
            };
                keys.space.pressed = true;
            break;
        }
    }
});

addEventListener('keyup', ({code}) => {
    switch (code) {
        case 'KeyA' : keys.left.pressed = false;
        break;
        case 'KeyD' : keys.right.pressed = false;
        break;
        case 'Space': keys.space.pressed = false;
        break;
    }
});


export {keys} ;