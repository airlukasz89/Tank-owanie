import 'phaser';

export default class Demo extends Phaser.Scene
{
    private player : Phaser.GameObjects.Image;

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
        let coliding = this.isColiding(this.player.x, this.player.y, 32, 32,
                112, 48, 32, 32);

        console.log("COLLIDING: " + coliding);
        //console.log("x: "+ this.player.x + " y: " + this.player.y)
    }

    preload ()
    {

        this.load.image('tiles', 'assets/drawtiles-spaced.png');
        this.load.image('car', 'assets/car90.png');
        this.load.tilemapCSV('map', 'assets/grid.csv');

        // this.load.image('logo', 'assets/phaser3-logo.png');
        // this.load.image('libs', 'assets/libs.png');
        // this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        // this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create ()
    {
        // this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        // this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

        // this.add.image(400, 300, 'libs');

        // const logo = this.add.image(400, 70, 'logo');

        // this.tweens.add({
        //     targets: logo,
        //     y: 350,
        //     duration: 1500,
        //     ease: 'Bounce.InOut',
        //     yoyo: true,
        //     repeat: -1
        // })

        
        var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        var layer = map.createLayer(0, tileset, 0, 0);

        this.player = this.add.image(32+16, 32+16, 'car');
        let player = this.player;

        let speed = 4;

        //  Left
        this.input.keyboard.on('keydown-A', function (event) {


            var tile = layer.getTileAtWorldXY(player.x - 16 - speed, player.y, true);

            if (tile.index === 2)
            {
                //  Blocked, we can't move
            }
            else
            {
                player.x -= speed;
                player.angle = 180;
            }

        });

        //  Right
        this.input.keyboard.on('keydown-D', function (event) {

            var tile = layer.getTileAtWorldXY(player.x + 16 , player.y, true);

            if (tile.index === 2)
            {
                //  Blocked, we can't move
            }
            else
            {
                player.x += speed;
                player.angle = 0;
            }

        });

        //  Up
        this.input.keyboard.on('keydown-W', function (event) {

            var tile = layer.getTileAtWorldXY(player.x, player.y - 16 - speed , true);

            if (tile.index === 2)
            {
                //  Blocked, we can't move
            }
            else
            {
                player.y -= speed;
                player.angle = -90;
            }

        });

        //  Down
        this.input.keyboard.on('keydown-S', function (event) {

            var tile = layer.getTileAtWorldXY(player.x, player.y + 16 , true);

            if (tile.index === 2)
            {
                //  Blocked, we can't move
            }
            else
            {
                player.y += speed;
                player.angle = 90;
            }

        });
    }
}

const config = {
    // type: Phaser.AUTO,
    // backgroundColor: '#125555',
    // width: 800,
    // height: 600,
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    backgroundColor: '#1a1a2d',
    scene: Demo
};

const game = new Phaser.Game(config);
