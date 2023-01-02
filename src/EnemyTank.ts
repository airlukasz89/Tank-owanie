import Bullet from "./Bullet";
import Managers from './Managers';

export default class EnemyTank 
{
    private speed : number = 4;
    private playerTankImage : Phaser.GameObjects.Image;
    private tankIdleAudio : Phaser.Sound.BaseSound;
    private tankMovingAudio : Phaser.Sound.BaseSound;
    private cursors : Phaser.Types.Input.Keyboard.CursorKeys;
    private bullets: Bullet[] = [];


    private moveTank(vector : Phaser.Math.Vector2, angle : number, index : number){
        if (index === 2)
        {
            console.log("2");
            this.tankMovingAudio.stop();
            //  Blocked, we can't move
        }
        else
        {
            if(!this.tankMovingAudio.isPlaying) 
            {
                this.tankMovingAudio.play();
            }
            this.playerTankImage.x = vector.x;
            this.playerTankImage.y = vector.y;
            this.playerTankImage.angle = angle;
        }

    }

    private GetDirection() 
    {
        if (this.playerTankImage.angle == -180) 
        {
            return new Phaser.Math.Vector2(-1,0);
        }

        if (this.playerTankImage.angle == 0)
        {
            return new Phaser.Math.Vector2(1,0)
        }

        if (this.playerTankImage.angle == -90)
        {
            return new Phaser.Math.Vector2(0,-1)
        }

        if (this.playerTankImage.angle == 90)
        {
            return new Phaser.Math.Vector2(0,1)
        }
        console.error("no such direction "+ this.playerTankImage.angle )

    }


    private moveTankAllDirections(layer : Phaser.Tilemaps.TilemapLayer)
    {
        if(this.cursors.left.isDown)
        {
            let moveVector = new Phaser.Math.Vector2(this.playerTankImage.x - this.speed, this.playerTankImage.y);
            let tileOffset = new Phaser.Math.Vector2(this.playerTankImage.x - 16 - this.speed, this.playerTankImage.y);
            var tile = layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);
            this.moveTank(moveVector, 180, tile.index);
        }

        if(this.cursors.right.isDown)
        {
            let moveVector = new Phaser.Math.Vector2(this.playerTankImage.x + this.speed, this.playerTankImage.y);
            let tileOffset = new Phaser.Math.Vector2(this.playerTankImage.x + 16 , this.playerTankImage.y);
            var tile = layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);
            this.moveTank(moveVector, 0, tile.index);
        }
        if(this.cursors.up.isDown)
        {
            let moveVector = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y - this.speed);
            let tileOffset = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y - 16 - this.speed);
            var tile = layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);
            this.moveTank(moveVector, -90, tile.index);
        }
        if(this.cursors.down.isDown)
        {
            let moveVector = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y + this.speed);
            let tileOffset = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y + 16);
            var tile = layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);
            this.moveTank(moveVector, 90, tile.index);
        }
        
    }
 
    private shotBullet() 
    {
        if(this.cursors.space.isDown) 
        {   
            let bulletDirection = this.GetDirection()
            let startPosition = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y)
            let newBullet = new Bullet(startPosition, bulletDirection);
            this.bullets.push(newBullet);
           
        }
    }



    update (layer : Phaser.Tilemaps.TilemapLayer) 
    {
        this.moveTankAllDirections(layer);
        this.shotBullet()
        
        for(let bullet of this.bullets)
        {
            bullet.update(layer);

            if (bullet.isDestroyed) {
                const objWithIdIndex = this.bullets.findIndex((b) => b.isDestroyed);

                if (objWithIdIndex > -1) {
                  this.bullets.splice(objWithIdIndex, 1);
                }
              
            }
        }
        console.log(this.bullets.length);
    }
   
    preload ()
    {
        // Managers.loader.audio('tank_idle', ['assets/tank_idle.mp3']);
        // Managers.loader.audio('tank_moving', ['assets/tank_moving.mp3']);
        // Managers.loader.image('car', 'assets/car90.png');
       
        // Bullet.preload();
    }

    create ()
    {   
        this.cursors = Managers.input.keyboard.createCursorKeys();
        
        this.tankIdleAudio = Managers.sound.add("tank_idle");
        this.tankMovingAudio = Managers.sound.add("tank_moving", {
            loop: true
        });
        
        this.playerTankImage = Managers.add.image(128+16, 32+16, 'car');
       
        Managers.input.keyboard.on("keyup", ()=>{
            this.tankMovingAudio.stop();
        });
    }

}