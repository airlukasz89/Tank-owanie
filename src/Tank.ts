export default class Tank 
{
    private speed : number = 4;
    private playerTankImage : Phaser.GameObjects.Image;
    private tankIdleAudio : Phaser.Sound.BaseSound;
    private tankMovingAudio : Phaser.Sound.BaseSound;
    private cursors : Phaser.Types.Input.Keyboard.CursorKeys;



    moveTank(vector : Phaser.Math.Vector2, angle : number, index : number){
        if (index === 2)
        {
            console.log("2");
            this.tankMovingAudio.stop();
            //  Blocked, we can't move
        }
        else
        {
            if(!this.tankMovingAudio.isPlaying) this.tankMovingAudio.play();
            this.playerTankImage.x = vector.x;
            this.playerTankImage.y = vector.y;
            this.playerTankImage.angle = angle;
        }

    }



    moveTankAllDirections(layer : Phaser.Tilemaps.TilemapLayer)
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
   
    preload (loader : Phaser.Loader.LoaderPlugin)
    {
        loader.audio('tank_idle', ['assets/tank_idle.mp3']);
        loader.audio('tank_moving', ['assets/tank_moving.mp3']);
       loader.image('car', 'assets/car90.png');
       
    }

    create (input : Phaser.Input.InputPlugin, sound : Phaser.Sound.BaseSoundManager, add :  Phaser.GameObjects.GameObjectFactory)
    {   
        this.cursors = input.keyboard.createCursorKeys();
        
        this.tankIdleAudio = sound.add("tank_idle");
        this.tankMovingAudio = sound.add("tank_moving", {
            loop: true
        });
        
        this.playerTankImage = add.image(32+16, 32+16, 'car');
       
        input.keyboard.on("keyup", ()=>{
            this.tankMovingAudio.stop();
        });
    }

}