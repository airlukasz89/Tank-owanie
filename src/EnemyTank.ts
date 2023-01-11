import Bullet from "./Bullet";
import Direction from "./Direction";
import Managers from './Managers';


export default class EnemyTank 
{
    private speed : number = 4;
    private playerTankImage : Phaser.GameObjects.Image;
    private tankIdleAudio : Phaser.Sound.BaseSound;
    private tankMovingAudio : Phaser.Sound.BaseSound;
    private cursors : Phaser.Types.Input.Keyboard.CursorKeys;
    private bullets: Bullet[] = [];
    private direction : Direction = Direction.Down;
    


    private moveTank() {
        let moveVector = this.GetDirectionVector()
        
        if(!this.tankMovingAudio.isPlaying) 
        {
            this.tankMovingAudio.play();
        }
        this.playerTankImage.x = this.playerTankImage.x + (moveVector.x * this.speed);
        this.playerTankImage.y = this.playerTankImage.y + (moveVector.y * this.speed);
        this.playerTankImage.angle = this.direction;
    }

    private GetDirectionVector() 
    {
        if (this.direction == Direction.Left) 
        {
            return new Phaser.Math.Vector2(-1,0);
        }

        if (this.direction == Direction.Right)
        {
            return new Phaser.Math.Vector2(1,0)
        }

        if (this.direction == Direction.Up)
        {
            return new Phaser.Math.Vector2(0,-1)
        }

        if (this.direction == Direction.Down)
        {
            return new Phaser.Math.Vector2(0,1)
        }
        console.error("no such direction "+ this.playerTankImage.angle )

    }


    private changeDirection(layer : Phaser.Tilemaps.TilemapLayer)
    { 
        let nonColidingDirections : Direction[] = [];
        
        // right
        let posiibleMoveVector = new Phaser.Math.Vector2(this.playerTankImage.x + this.speed, this.playerTankImage.y);
        let tileOffset = new Phaser.Math.Vector2(this.playerTankImage.x + 16 , this.playerTankImage.y);
        let tile = layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);

        if(tile.index != 2)
        {
            nonColidingDirections.push(Direction.Right);
        }

        //  //left
        posiibleMoveVector = new Phaser.Math.Vector2(this.playerTankImage.x - this.speed, this.playerTankImage.y);
        tileOffset = new Phaser.Math.Vector2(this.playerTankImage.x - 16 - this.speed, this.playerTankImage.y);
        tile = layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);
 
         if(tile.index != 2)
         {    
            nonColidingDirections.push(Direction.Left);
         }
       
        // //up
        posiibleMoveVector = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y - this.speed);
        tileOffset = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y - 16 - this.speed);
        tile = layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);
        
        if(tile.index != 2)
        {
            
            nonColidingDirections.push(Direction.Up);
        }
        
        // //down
        posiibleMoveVector = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y + this.speed);
        tileOffset = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y + 16);
        tile = layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);
        
        if(tile.index != 2)
        {
            nonColidingDirections.push(Direction.Down);
        }

       if (nonColidingDirections.includes(this.direction)) 
       {
            return;
       } 

       let newDirection = nonColidingDirections[Math.floor(Math.random()*nonColidingDirections.length)];
       this.direction = newDirection;
    }
 
    private shotBullet() 
    {
        if(this.cursors.space.isDown) 
        {   
            let bulletDirection = this.GetDirectionVector()
            let startPosition = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y)
            let newBullet = new Bullet(startPosition, bulletDirection);
            this.bullets.push(newBullet);
           
        }
    }

    public getPosition()
    {
        let position = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y);
        return position;
    }

    public reverseDirection(){}



    update (layer : Phaser.Tilemaps.TilemapLayer) 
    {
        this.changeDirection(layer);
        this.moveTank();
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