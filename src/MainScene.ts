import "phaser";
import Tank from "./Tank";
import EnemyTank from "./EnemyTank";
import Managers from "./Managers";
import Bullet from "./Bullet";

export default class MainScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.TilemapLayer;

  private tank: Tank;

  private enemyTanks: EnemyTank[] = [];

  private walker: Phaser.GameObjects.Sprite;
  private explosion1: Phaser.GameObjects.Sprite;

  constructor() {
    super("demo");
  }

  isColiding(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    if (
      r1x + r1w >= r2x && // r1 right edge past r2 left
      r1x <= r2x + r2w && // r1 left edge past r2 right
      r1y + r1h >= r2y && // r1 top edge past r2 bottom
      r1y <= r2y + r2h
    ) {
      // r1 bottom edge past r2 top
      return true;
    }

    return false;
  }

  public handleTankBulletShootedToEnemyTanks() {
    let bullets = Managers.tankBullets;
    let enemyTanks = this.enemyTanks;

    for (let bullet of bullets) {
      for (let enemyTank of enemyTanks) {
        let bulletPosition = bullet.getPosition();
        let enemyTankPosition = enemyTank.getPosition();
        if (
          this.isColiding(
            bulletPosition.x,
            bulletPosition.y,
            1,
            1,
            enemyTankPosition.x - 16,
            enemyTankPosition.y - 16,
            32,
            32
          )
        ) {
          bullet.destroy();
          enemyTank.destroy();

          var explosion1 = this.add.sprite(
            enemyTankPosition.x,
            enemyTankPosition.y,
            "explosion1",
            "12.png"
          );
          explosion1.scale = 0.5;
          explosion1.play("explode");
          explosion1.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            explosion1.destroy();
          });
        }
      }
    }
  }

  public handleEnemyTankBulletShootedToTank() {
    let bullets = Managers.enemyTankBullets;
    let tank = this.tank;

    for (let bullet of bullets) {
      let bulletPosition = bullet.getPosition();
      let tankPosition = this.tank.getPosition();
      if (
        this.isColiding(
          bulletPosition.x,
          bulletPosition.y,
          1,
          1,
          tankPosition.x - 16,
          tankPosition.y - 16,
          32,
          32
        )
      ) {
        bullet.destroy();
        this.tank.respawn();
      }
    }
  }

  private updateTankBullets() {
    for (let bullet of Managers.tankBullets) {
      bullet.update(this.layer);

      if (bullet.isDestroyed) {
        const objWithIdIndex = Managers.tankBullets.findIndex(
          (b) => b.isDestroyed
        );

        if (objWithIdIndex > -1) {
          Managers.tankBullets.splice(objWithIdIndex, 1);
        }
      }
    }
  }

  private updateEnemyTankBullets() {
    for (let bullet of Managers.enemyTankBullets) {
      bullet.update(this.layer);

      if (bullet.isDestroyed) {
        const objWithIdIndex = Managers.enemyTankBullets.findIndex(
          (b) => b.isDestroyed
        );

        if (objWithIdIndex > -1) {
          Managers.enemyTankBullets.splice(objWithIdIndex, 1);
        }
      }
    }
  }

  public handleTankColissionWithEnemyTank() {
    for (let enemyTank of this.enemyTanks) {
      let positionEnemyTank = enemyTank.getPosition();
      let positionTank = this.tank.getPosition();
      let isColiding = this.isColiding(
        positionEnemyTank.x - 16,
        positionEnemyTank.y - 16,
        32,
        32,
        positionTank.x - 32,
        positionTank.y - 32,
        64,
        64
      );
      console.log("handleTank");
      if (isColiding) {
        enemyTank.reverseDirection();
      }
    }
  }

  public handleEnemyTanksCollisons() {
    let pairs = [];

    for (let enemyTank1 of this.enemyTanks) {
      for (let enemyTank2 of this.enemyTanks) {
        let isInPairs = pairs.filter(
          (pair) =>
            (pair[0] === enemyTank1 && pair[1] === enemyTank2) ||
            (pair[0] === enemyTank2 && pair[1] === enemyTank1)
        );
        if (isInPairs.length > 0) {
          continue;
        }
        if (enemyTank1 === enemyTank2) {
          continue;
        }
        let positionTank1 = enemyTank1.getPosition();
        let positionTank2 = enemyTank2.getPosition();
        let isColiding = this.isColiding(
          positionTank1.x - 16,
          positionTank1.y - 16,
          32,
          32,
          positionTank2.x - 16,
          positionTank2.y - 16,
          32,
          32
        );
        if (isColiding) {
          pairs.push([enemyTank1, enemyTank2]);

          console.log("is colision");
          enemyTank1.reverseDirection();
          enemyTank2.reverseDirection();
        }
      }
    }
  }

  update() {
    this.handleEnemyTanksCollisons();
    this.handleTankColissionWithEnemyTank();
    this.handleTankBulletShootedToEnemyTanks();
    this.handleEnemyTankBulletShootedToTank();
    this.tank.update(this.layer);
    this.updateTankBullets();
    this.updateEnemyTankBullets();

    for (let enemyTank of this.enemyTanks) {
      enemyTank.update(this.layer);

      if (enemyTank.isDestroyed) {
        const objWithIdIndex = this.enemyTanks.findIndex((b) => b.isDestroyed);

        if (objWithIdIndex > -1) {
          this.enemyTanks.splice(objWithIdIndex, 1);
        }
      }
    }

    this.walker.x -= 1;
  }

  generateRandomTanks(tanksCount: number, map: Phaser.Tilemaps.Tilemap) {
    let countTo4 = 0;

    for (let x = 0; x < map.width; x++) {
      for (let y = 0; y < map.height; y++) {
        let tileOffset = new Phaser.Math.Vector2(x * 32, y * 32);
        let tile = this.layer.getTileAtWorldXY(
          tileOffset.x,
          tileOffset.y,
          true
        );
        if (tile.index != 2) {
          countTo4++;
        }
        if (countTo4 == 15) {
          let enemyTank = new EnemyTank(tileOffset);
          enemyTank.preload();
          this.enemyTanks.push(enemyTank);

          countTo4 = 0;
        }
      }
    }
  }

  preload() {
    Managers.sound = this.sound;
    Managers.add = this.add;
    Managers.loader = this.load;
    Managers.input = this.input;
    Managers.time = this.time;

    this.load.image("tiles", "assets/drawtiles-spaced.png");
    this.load.tilemapCSV("map", "assets/grid.csv");

    this.tank = new Tank();
    this.tank.preload();

    this.load.atlas("walker", "assets/walker.png", "assets/walker.json");

    this.load.atlas(
      "explosion1",
      "assets/explosion1.png",
      "assets/explosion1.json"
    );

    this.load.animation("gemData", "assets/animations/gems.json");
    this.load.atlas(
      "gems",
      "assets/tests/columns/gems.png",
      "assets/tests/columns/gems.json"
    );
  }

  create() {
    var map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
    console.log("maciek" + map.width);
    var tileset = map.addTilesetImage("tiles", null, 32, 32, 1, 2);
    this.layer = map.createLayer(0, tileset, 0, 0);

    this.generateRandomTanks(5, map);

    this.tank.create();

    for (let enemyTank of this.enemyTanks) {
      enemyTank.create();
    }

    const animConfig = {
      key: "walk",
      frames: "walker",
      frameRate: 15,
      repeat: -1,
    };
    this.anims.create(animConfig);
    this.walker = this.add.sprite(820, 300, "walker", "frame_0000");
    this.walker.play("walk");

    const animConfig2 = {
      key: "explode",
      frames: "explosion1",
      frameRate: 45,
      repeat: 0,
    };
    this.anims.create(animConfig2);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "phaser-example",
  pixelArt: true,
  input: {
    gamepad: true,
  },
  backgroundColor: "#1a1a2d",
  scene: MainScene,
};

const game = new Phaser.Game(config);
