import Bullet from "./Bullet";
import Direction from "./Direction";
import Managers from "./Managers";

export default class EnemyTank {
  private speed: number;
  private playerTankImage: Phaser.GameObjects.Image;
  private tankIdleAudio: Phaser.Sound.BaseSound;
  private tankMovingAudio: Phaser.Sound.BaseSound;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  // private bullets: Bullet[] = [];
  private direction: Direction = Direction.Down;
  private startPosition: Phaser.Math.Vector2;

  public isDestroyed: boolean = false;
  private timeToAllowReversDirection: number;
  private nextTimeToShotInMs: number;

  constructor(startPosition: Phaser.Math.Vector2) {
    this.startPosition = startPosition;

    this.speed = Math.random() * (8 - 2) + 2;
    this.timeToAllowReversDirection = Managers.time.now;
  }

  private moveTank() {
    let moveVector = this.GetDirectionVector();

    if (!this.tankMovingAudio.isPlaying) {
      this.tankMovingAudio.play();
    }
    this.playerTankImage.x = this.playerTankImage.x + moveVector.x * this.speed;
    this.playerTankImage.y = this.playerTankImage.y + moveVector.y * this.speed;
    this.playerTankImage.angle = this.direction;
  }

  private GetDirectionVector() {
    if (this.direction == Direction.Left) {
      return new Phaser.Math.Vector2(-1, 0);
    }

    if (this.direction == Direction.Right) {
      return new Phaser.Math.Vector2(1, 0);
    }

    if (this.direction == Direction.Up) {
      return new Phaser.Math.Vector2(0, -1);
    }

    if (this.direction == Direction.Down) {
      return new Phaser.Math.Vector2(0, 1);
    }
    console.error("no such direction " + this.playerTankImage.angle);
  }

  private changeDirectionIfWall(layer: Phaser.Tilemaps.TilemapLayer) {
    let nonColidingDirections: Direction[] = [];

    // right
    let posiibleMoveVector = new Phaser.Math.Vector2(
      this.playerTankImage.x + this.speed,
      this.playerTankImage.y
    );
    let tileOffset = new Phaser.Math.Vector2(
      this.playerTankImage.x + 16,
      this.playerTankImage.y
    );
    let tile = layer.getTileAtWorldXY(tileOffset.x, tileOffset.y, true);

    if (tile.index != 2) {
      nonColidingDirections.push(Direction.Right);
    }

    //  //left
    posiibleMoveVector = new Phaser.Math.Vector2(
      this.playerTankImage.x - this.speed,
      this.playerTankImage.y
    );
    tileOffset = new Phaser.Math.Vector2(
      this.playerTankImage.x - 16 - this.speed,
      this.playerTankImage.y
    );
    tile = layer.getTileAtWorldXY(tileOffset.x, tileOffset.y, true);

    if (tile.index != 2) {
      nonColidingDirections.push(Direction.Left);
    }

    // //up
    posiibleMoveVector = new Phaser.Math.Vector2(
      this.playerTankImage.x,
      this.playerTankImage.y - this.speed
    );
    tileOffset = new Phaser.Math.Vector2(
      this.playerTankImage.x,
      this.playerTankImage.y - 16 - this.speed
    );
    tile = layer.getTileAtWorldXY(tileOffset.x, tileOffset.y, true);

    if (tile.index != 2) {
      nonColidingDirections.push(Direction.Up);
    }

    // //down
    posiibleMoveVector = new Phaser.Math.Vector2(
      this.playerTankImage.x,
      this.playerTankImage.y + this.speed
    );
    tileOffset = new Phaser.Math.Vector2(
      this.playerTankImage.x,
      this.playerTankImage.y + 16
    );
    tile = layer.getTileAtWorldXY(tileOffset.x, tileOffset.y, true);

    if (tile.index != 2) {
      nonColidingDirections.push(Direction.Down);
    }

    if (nonColidingDirections.includes(this.direction)) {
      return;
    }

    let newDirection =
      nonColidingDirections[
        Math.floor(Math.random() * nonColidingDirections.length)
      ];
    this.direction = newDirection;
  }

  private shotBullet() {
    let possibleToShot = Managers.time.now > this.nextTimeToShotInMs;
    if (possibleToShot) {
      this.nextTimeToShotInMs = Managers.time.now + 500;
      let bulletDirection = this.GetDirectionVector();
      let startPosition = new Phaser.Math.Vector2(
        this.playerTankImage.x,
        this.playerTankImage.y
      );
      let newBullet = new Bullet(startPosition, bulletDirection);
      Managers.enemyTankBullets.push(newBullet);
      console.log(" ");
    }
  }

  // private shotBullet() {
  //   if(this.possilb
  //   {
  //       let bulletDirection = this.GetDirectionVector()
  //       let startPosition = new Phaser.Math.Vector2(this.playerTankImage.x, this.playerTankImage.y)
  //       let newBullet = new Bullet(startPosition, bulletDirection);
  //       this.bullets.push(newBullet);
  //   }
  // }

  public getPosition() {
    let position = new Phaser.Math.Vector2(
      this.playerTankImage.x,
      this.playerTankImage.y
    );
    return position;
  }

  public reverseDirection() {
    let allowToReverse = Managers.time.now > this.timeToAllowReversDirection;
    if (!allowToReverse) {
      return;
    }

    this.timeToAllowReversDirection = Managers.time.now + 400;

    if (this.direction == Direction.Left) {
      this.direction = Direction.Right;
      return;
    }

    if (this.direction == Direction.Right) {
      this.direction = Direction.Left;
      return;
    }

    if (this.direction == Direction.Up) {
      this.direction = Direction.Down;
      return;
    }

    if (this.direction == Direction.Down) {
      this.direction = Direction.Up;
      return;
    }
  }

  public destroy() {
    this.isDestroyed = true;
    this.playerTankImage.destroy();
  }

  update(layer: Phaser.Tilemaps.TilemapLayer) {
    this.changeDirectionIfWall(layer);
    this.moveTank();
    this.shotBullet();
  }

  preload() {
    // Managers.loader.audio('tank_idle', ['assets/tank_idle.mp3']);
    // Managers.loader.audio('tank_moving', ['assets/tank_moving.mp3']);
    // Managers.loader.image('car', 'assets/car90.png');
    // Bullet.preload();
  }

  create() {
    this.cursors = Managers.input.keyboard.createCursorKeys();
    this.nextTimeToShotInMs = Managers.time.now;
    this.tankIdleAudio = Managers.sound.add("tank_idle");
    this.tankMovingAudio = Managers.sound.add("tank_moving", {
      loop: true,
    });

    this.playerTankImage = Managers.add.image(
      this.startPosition.x + 16,
      this.startPosition.y + 16,
      "car"
    );

    Managers.input.keyboard.on("keyup", () => {
      this.tankMovingAudio.stop();
    });
  }
}
