import 'phaser';

export default class MainScene extends Phaser.Scene
{
    private player : Phaser.GameObjects.Image;
    private tankIdleAudio : Phaser.Sound.BaseSound;
    private tankMovingAudio : Phaser.Sound.BaseSound;
    private cursors : Phaser.Types.Input.Keyboard.CursorKeys;
    private layer : Phaser.Tilemaps.TilemapLayer;

    private speed : number = 4;

    constructor ()
    {
        super('demo');
    }

    isColiding 
    (r1x,r1y,r1w,r1h,
    r2x,r2y,r2w,r2h) {

        if (r1x + r1w >= r2x &&     // r1 right edge past r2 left
        r1x <= r2x + r2w &&       // r1 left edge past r2 right
        r1y + r1h >= r2y &&       // r1 top edge past r2 bottom
        r1y <= r2y + r2h)          // r1 bottom edge past r2 top
        {       
            return true;
        }

        return false;
    }

    moveTank(vector : Phaser.Math.Vector2, angle : number, tileOffset : Phaser.Math.Vector2){
        console.log(tileOffset);
        
        var tile = this.layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);

        if (tile.index === 2)
        {
            console.log("2");
            this.tankMovingAudio.stop();
            //  Blocked, we can't move
        }
        else
        {
            if(!this.tankMovingAudio.isPlaying) this.tankMovingAudio.play();
            this.player.x = vector.x;
            this.player.y = vector.y;
            this.player.angle = angle;
        }

    }

    moveTankAllDirections()
    {
        if(this.cursors.left.isDown)
        {
            let moveVector = new Phaser.Math.Vector2(this.player.x - this.speed, this.player.y);
            let tileOffset = new Phaser.Math.Vector2(this.player.x - 16 - this.speed, this.player.y);
            this.moveTank(moveVector, 180, tileOffset);
        }
        if(this.cursors.right.isDown)
        {
            let moveVector = new Phaser.Math.Vector2(this.player.x + this.speed, this.player.y);
            let tileOffset = new Phaser.Math.Vector2(this.player.x + 16 , this.player.y);
            this.moveTank(moveVector, 0, tileOffset);
        }
        if(this.cursors.up.isDown)
        {
            let moveVector = new Phaser.Math.Vector2(this.player.x, this.player.y - this.speed);
            let tileOffset = new Phaser.Math.Vector2(this.player.x, this.player.y - 16 - this.speed);
            this.moveTank(moveVector, -90, tileOffset);
        }
        if(this.cursors.down.isDown)
        {
            let moveVector = new Phaser.Math.Vector2(this.player.x, this.player.y + this.speed);
            let tileOffset = new Phaser.Math.Vector2(this.player.x, this.player.y + 16);
            this.moveTank(moveVector, 90, tileOffset);
        }
    }

    update () 
    {
        this.moveTankAllDirections();

        let coliding = this.isColiding(this.player.x, this.player.y, 32, 32,
                112, 48, 32, 32);

        console.log("COLLIDING: " + coliding);
        //console.log("x: "+ this.player.x + " y: " + this.player.y)
    }

    preload ()
    {
        this.load.audio('tank_idle', ['assets/tank_idle.mp3']);
        this.load.audio('tank_moving', ['assets/tank_moving.mp3']);


        this.load.image('tiles', 'assets/drawtiles-spaced.png');
        this.load.image('car', 'assets/car90.png');
        this.load.tilemapCSV('map', 'assets/grid.csv');

    }

    create ()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.tankIdleAudio = this.sound.add("tank_idle");
        this.tankMovingAudio = this.sound.add("tank_moving", {
            loop: true
        });
        
        var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        this.layer = map.createLayer(0, tileset, 0, 0);

        this.player = this.add.image(32+16, 32+16, 'car');
        let player = this.player;

        let tankMovingAudio = this.tankMovingAudio;

        this.input.keyboard.on("keyup", function(){
            tankMovingAudio.stop();
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    backgroundColor: '#1a1a2d',
    scene: MainScene
};

const game = new Phaser.Game(config);
