import Managers from "./Managers";

export default class Bullet 
{
    private speed : number = 4;
    private audio : Phaser.Sound.BaseSound;
    private image : Phaser.GameObjects.Image;
   

    constructor(x: number, y : number)
    {
        this.audio = Managers.sound.add("bullet_shot");
        this.image = Managers.add.image(x, y, 'bullet');
    }

    static preload ()
    {
        Managers.loader.audio('bullet_shot', ['assets/bullet_shot.mp3']);
        Managers.loader.image('bullet', 'assets/bullet.png');
    }


    
    private move(vector : Phaser.Math.Vector2, angle : number, index : number){
        
    

    }

    
}
