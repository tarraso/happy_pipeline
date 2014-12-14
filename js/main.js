var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamesatate', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.spritesheet('hero', 'assets/sprites/hero.png', 80, 80, 10);
    game.load.image('polotno', 'assets/sprites/polotno.png');
    game.load.image('fireblob', 'assets/sprites/fireblob.png');
    game.load.image('machine1', 'assets/sprites/machine1.png');
/*  ииgame.load.spritesheet('bullet', 'assets/sprites/bullet.png', 20, 20, 10);
    game.load.spritesheet('tiles', 'assets/sprites/tiles.png',40,40, 10);
    game.load.image('enemy_bullet', 'assets/sprites/enemy_bullet.png');
    game.load.image("tile", 'assets/sprites/tile.png');
    game.load.image("particle", 'assets/sprites/particle.png');
    game.load.image("game_background", "assets/sprites/game_background.png");*/
}

var player;
var polotno = [];
var cursors;
var emitters=[];
var machine1 = null;
var timer;
function create(){

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.gravity.y = 400;
    cursors = game.input.keyboard.createCursorKeys();
    timer = game.time.create();
    timer.start();
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'hero');
    game.physics.p2.enable(player);
    player.animations.add('run');
    player.animations.play('run', 15, true);
    
    emitters[0] = game.add.emitter(0,0,1000);
    emitters[0].makeParticles('fireblob');
    emitters[0].x=-35;
    emitters[0].y=20;
    emitters[0].lifespan = 500;
    emitters[0].maxParticleSpeed = new Phaser.Point(10,50);
    emitters[0].minParticleSpeed = new Phaser.Point(-10,50);
    emitters[1] = game.add.emitter(0,0,1000);
    emitters[1].makeParticles('fireblob');
    emitters[1].x=35;
    emitters[1].y=20;
    emitters[1].lifespan = 500;
    emitters[1].maxParticleSpeed = new Phaser.Point(10,50);
    emitters[1].minParticleSpeed = new Phaser.Point(-10,50);

    player.addChild(emitters[0]);
    player.addChild(emitters[1]);
    for(var i=0;i<3;i++){
        polotno[i] = game.add.sprite(-300+i*800, 600, 'polotno');
        game.physics.p2.enable(polotno[i]);
        polotno[i].body.kinematic = true;
    }
    createMachine();

}
function update(){
    for(var i=0;i<3;i++){
        if(polotno[i].body.x<-600){
            polotno[i].body.x+=2400;
            continue;
        }
        polotno[i].body.x-=1;
    }
    if (cursors.left.isDown && player.body.angle>-20)
    {  
        player.body.rotateLeft(20);
    }
    else if (cursors.right.isDown && player.body.angle<20)
    {
        player.body.rotateRight(20);
    }
    else
    {
        player.body.setZeroRotation();
    }

    if (cursors.up.isDown)
    {
        player.body.thrust(500);
        emitters[0].emitParticle();
        emitters[1].emitParticle();
    }
    if(player.body.y>600){
        game.state.start("default");
    }
}

function createMachine(){
    machine1 = game.add.sprite(Math.random()*100,100,"machine1");
    game.physics.p2.enable(machine1);
    machine1.body.kinematic = true;
    machine1.update = function(){
        this.body.y = Math.sin(timer.seconds*Math.log(timer.seconds))*300;
        if(this.body.y<=-290){
            this.body.x = Math.random()*800; 
        }
    };
}

function render() {
    game.debug.text("Time: " + Math.floor(timer.seconds), 32, 32);
 
}