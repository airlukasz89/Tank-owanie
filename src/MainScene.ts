import 'phaser';
import Tank from './Tank';
import EnemyTank from './EnemyTank';
import Managers from './Managers';

export default class MainScene extends Phaser.Scene
{
    
    private layer : Phaser.Tilemaps.TilemapLayer;

    private tank : Tank;

    private enemyTanks : EnemyTank[] = [];


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
        this.tank.update(this.layer);
        for ( let enemyTank of this.enemyTanks) {
            enemyTank.update(this.layer);
        }
    }

    preload ()
    {
        Managers.sound = this.sound;
        Managers.add = this.add;
        Managers.loader = this.load;
        Managers.input = this.input;
        
        this.load.image('tiles', 'assets/drawtiles-spaced.png');
        this.load.tilemapCSV('map', 'assets/grid.csv');
        
        this.tank = new Tank();
        this.tank.preload();

        for (let i = 0; i < 3; i++) {
            let enemyTank = new EnemyTank();
            enemyTank.preload();
            this.enemyTanks.push(enemyTank);
        }
        
    }

    create ()
    {   
        var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        this.layer = map.createLayer(0, tileset, 0, 0);

        this.tank.create();

        for ( let enemyTank of this.enemyTanks) {
            enemyTank.create()
        }
        
        
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    input: {
        gamepad: true
    },
    backgroundColor: '#1a1a2d',
    scene: MainScene
};

const game = new Phaser.Game(config);
