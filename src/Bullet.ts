import Managers from "./Managers";

export default class Bullet 
{
    private speed : number = 40;
    private audio : Phaser.Sound.BaseSound;
    private image : Phaser.GameObjects.Image;
    private direction : Phaser.Math.Vector2;
    

    constructor(startPosition : Phaser.Math.Vector2, direction : Phaser.Math.Vector2)
    {   
        this.direction = direction;
        this.audio = Managers.sound.add("bullet_shot");
        this.image = Managers.add.image(startPosition.x, startPosition.y, 'bullet');


    }

    update ()
    {
       
        this.move()
    }

    static preload ()
    {
        Managers.loader.audio('bullet_shot', ['assets/bullet_shot.mp3']);
        Managers.loader.image('bullet', 'assets/bullet.png');

    }

    
    private move()
    {
        
         this.image.x = this.image.x + this.direction.x;
         
         this.image.y = this.image.y + this.direction.y;
        

    }

    
}

