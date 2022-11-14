import 'phaser';
import Tank from './Tank';

export default class MainScene extends Phaser.Scene
{
    
    private layer : Phaser.Tilemaps.TilemapLayer;

    private tank : Tank;

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

    
    update () 
    {
        this.tank.moveTankAllDirections(this.layer);

        // let coliding = this.isColiding(this.playerTankImage.x, this.playerTankImage.y, 32, 32,
                // 112, 48, 32, 32);

        // console.log("COLLIDING: " + coliding);
        //console.log("x: "+ this.player.x + " y: " + this.player.y)
    }

    preload ()
    {
        this.load.image('tiles', 'assets/drawtiles-spaced.png');
        this.load.tilemapCSV('map', 'assets/grid.csv');
        
        this.tank = new Tank();
        this.tank.preload(this.load);
    }

    create ()
    {   
        var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        this.layer = map.createLayer(0, tileset, 0, 0);

        this.tank.create(this.input, this.sound, this.add)

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
