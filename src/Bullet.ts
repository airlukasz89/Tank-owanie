import Managers from "./Managers";

export default class Bullet 
{
    private speed : number = 40;
    private audio : Phaser.Sound.BaseSound;
    private image : Phaser.GameObjects.Image;
    private direction : Phaser.Math.Vector2;

    public isDestroyed: boolean = false;

    

    public getPosition()
    {
        let position = new Phaser.Math.Vector2(this.image.x, this.image.y);
        return position;
    }

    

    constructor(startPosition : Phaser.Math.Vector2, direction : Phaser.Math.Vector2)
    {   
        this.direction = direction;
        this.audio = Managers.sound.add("bullet_shot");
        this.image = Managers.add.image(startPosition.x, startPosition.y, 'bullet');


    }

    update (layer : Phaser.Tilemaps.TilemapLayer)
    {
        this.move()
        this.checkCollison(layer)
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

    private checkCollison(layer : Phaser.Tilemaps.TilemapLayer) {
        let tileOffset = new Phaser.Math.Vector2(this.image.x, this.image.y);
        var tile = layer.getTileAtWorldXY(tileOffset.x , tileOffset.y, true);
        
        if (tile.index == 2) {
            this.isDestroyed = true
            this.image.destroy()
        }

    }

    public destroy() {
        this.isDestroyed = true
        this.image.destroy()
    }

    
}

