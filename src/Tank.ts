import Bullet from "./Bullet";
import Managers from "./Managers";

export default class Tank {
  private speed: number = 4;
  private playerTankImage: Phaser.GameObjects.Image;
  private tankIdleAudio: Phaser.Sound.BaseSound;
  private tankMovingAudio: Phaser.Sound.BaseSound;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private bullets: Bullet[] = [];
  private nextTimeToShotInMs: number;

  private moveTank(vector: Phaser.Math.Vector2, angle: number, index: number) {
    if (index === 2) {
      this.tankMovingAudio.stop();
      //  Blocked, we can't move
    } else {
      if (!this.tankMovingAudio.isPlaying) {
        this.tankMovingAudio.play();
      }
      this.playerTankImage.x = vector.x;
      this.playerTankImage.y = vector.y;
      this.playerTankImage.angle = angle;
    }
  }

  private GetDirection() {
    if (this.playerTankImage.angle == -180) {
      return new Phaser.Math.Vector2(-1, 0);
    }

    if (this.playerTankImage.angle == 0) {
      return new Phaser.Math.Vector2(1, 0);
    }

    if (this.playerTankImage.angle == -90) {
      return new Phaser.Math.Vector2(0, -1);
    }

    if (this.playerTankImage.angle == 90) {
      return new Phaser.Math.Vector2(0, 1);
    }
    console.error("no such direction " + this.playerTankImage.angle);
  }

  private moveTankAllDirections(layer: Phaser.Tilemaps.TilemapLayer) {
    var axisH = 0;
    var axisV = 0;

    if (!!Managers.input.gamepad) {
      var pad = Managers.input.gamepad.getPad(0);

      if (!!pad && pad.axes.length) {
        axisH = pad.axes[0].getValue();
        axisV = pad.axes[1].getValue();

        console.log("H: " + axisH + " | V: " + axisV);
      }
    }

    if (this.cursors.left.isDown || (axisH < 0.1 && axisH != 0)) {
      let moveVector = new Phaser.Math.Vector2(
        this.playerTankImage.x - this.speed,
        this.playerTankImage.y
      );
      let tileOffset = new Phaser.Math.Vector2(
        this.playerTankImage.x - 16 - this.speed,
        this.playerTankImage.y
      );
      var tile = layer.getTileAtWorldXY(tileOffset.x, tileOffset.y, true);
      this.moveTank(moveVector, 180, tile.index);
    }

    if (this.cursors.right.isDown || (axisH > 0.1 && axisH != 0)) {
      let moveVector = new Phaser.Math.Vector2(
        this.playerTankImage.x + this.speed,
        this.playerTankImage.y
      );
      let tileOffset = new Phaser.Math.Vector2(
        this.playerTankImage.x + 16,
        this.playerTankImage.y
      );
      var tile = layer.getTileAtWorldXY(tileOffset.x, tileOffset.y, true);
      this.moveTank(moveVector, 0, tile.index);
    }
    if (this.cursors.up.isDown || (axisV < 0.1 && axisV != 0)) {
      let moveVector = new Phaser.Math.Vector2(
        this.playerTankImage.x,
        this.playerTankImage.y - this.speed
      );
      let tileOffset = new Phaser.Math.Vector2(
        this.playerTankImage.x,
        this.playerTankImage.y - 16 - this.speed
      );
      var tile = layer.getTileAtWorldXY(tileOffset.x, tileOffset.y, true);
      this.moveTank(moveVector, -90, tile.index);
    }
    if (this.cursors.down.isDown || (axisV > 0.1 && axisV != 0)) {
      let moveVector = new Phaser.Math.Vector2(
        this.playerTankImage.x,
        this.playerTankImage.y + this.speed
      );
      let tileOffset = new Phaser.Math.Vector2(
        this.playerTankImage.x,
        this.playerTankImage.y + 16
      );
      var tile = layer.getTileAtWorldXY(tileOffset.x, tileOffset.y, true);
      this.moveTank(moveVector, 90, tile.index);
    }
  }

  private shotBullet() {
    var gamepadShoot = false;
    let possibleToShot = Managers.time.now > this.nextTimeToShotInMs;

    if (!!Managers.input.gamepad) {
      var pad = Managers.input.gamepad.getPad(0);
      gamepadShoot = !!pad && pad.B;
    }

    if ((this.cursors.space.isDown || gamepadShoot) && possibleToShot) {
      this.nextTimeToShotInMs = Managers.time.now + 500;
      let bulletDirection = this.GetDirection();
      let startPosition = new Phaser.Math.Vector2(
        this.playerTankImage.x,
        this.playerTankImage.y
      );
      let newBullet = new Bullet(startPosition, bulletDirection);
      this.bullets.push(newBullet);
    }
  }

  public GetBullets() {
    return this.bullets;
  }

  update(layer: Phaser.Tilemaps.TilemapLayer) {
    this.moveTankAllDirections(layer);

    this.shotBullet();

    for (let bullet of this.bullets) {
      bullet.update(layer);

      if (bullet.isDestroyed) {
        const objWithIdIndex = this.bullets.findIndex((b) => b.isDestroyed);

        if (objWithIdIndex > -1) {
          this.bullets.splice(objWithIdIndex, 1);
        }
      }
    }
  }

  preload() {
    Managers.loader.audio("tank_idle", ["assets/tank_idle.mp3"]);
    Managers.loader.audio("tank_moving", ["assets/tank_moving.mp3"]);
    Managers.loader.image("car", "assets/car90.png");

    Bullet.preload();
  }

  create() {
    this.cursors = Managers.input.keyboard.createCursorKeys();
    this.nextTimeToShotInMs = Managers.time.now;
    this.tankIdleAudio = Managers.sound.add("tank_idle");
    this.tankMovingAudio = Managers.sound.add("tank_moving", {
      loop: true,
    });

    this.playerTankImage = Managers.add.image(32 + 16, 32 + 16, "car");

    Managers.input.keyboard.on("keyup", () => {
      this.tankMovingAudio.stop();
    });
  }
}
