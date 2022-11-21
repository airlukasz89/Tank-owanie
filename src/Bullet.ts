import Managers from "./Managers";

export default class Bullet 
{
    private speed : number = 4;
    private image : Phaser.GameObjects.Image;
    private sound : Phaser.Sound.BaseSound;  

    constructor(x: number, y : number, sound : Phaser.Sound.BaseSoundManager, add :  Phaser.GameObjects.GameObjectFactory)
    {
        this.sound = sound.add("bullet_shot");
        this.image = add.image(x, y, 'bullet');
    }

    static preload ()
    {
        Managers.loader.audio('bullet_shot', ['assets/bullet_shot.mp3']);
        Managers.loader.image('bullet', 'assets/bullet.png');
    }


    
    private move(vector : Phaser.Math.Vector2, angle : number, index : number){
        
    

    }

    
}
