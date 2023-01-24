import "phaser";
import Tank from "./Tank";
import EnemyTank from "./EnemyTank";
import Managers from "./Managers";
import Bullet from "./Bullet";

export default class MainScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.TilemapLayer;

  private tank: Tank;

  private enemyTanks: EnemyTank[] = [];

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

  public handleBulletEnemyTanks() {
    let bullets = this.tank.GetBullets();
    let enemyTanks = this.enemyTanks;
    //let bulletsPositions = bullets.map(b=>b.getPosition())

    // zrobić for zagnieżdzonego;

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
        }
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
          // console.log(positionTank1);
          // console.log(positionTank2);
        }
      }
    }
  }

  update() {
    this.handleEnemyTanksCollisons();
    this.handleBulletEnemyTanks();
    this.tank.update(this.layer);

    for (let enemyTank of this.enemyTanks) {
      enemyTank.update(this.layer);

      if (enemyTank.isDestroyed) {
        const objWithIdIndex = this.enemyTanks.findIndex((b) => b.isDestroyed);

        if (objWithIdIndex > -1) {
          this.enemyTanks.splice(objWithIdIndex, 1);
        }
      }
    }
  }

  preload() {
    Managers.sound = this.sound;
    Managers.add = this.add;
    Managers.loader = this.load;
    Managers.input = this.input;

    this.load.image("tiles", "assets/drawtiles-spaced.png");
    this.load.tilemapCSV("map", "assets/grid.csv");

    this.tank = new Tank();
    this.tank.preload();

    let enemyTank = new EnemyTank(new Phaser.Math.Vector2(128, 32));
    enemyTank.preload();
    this.enemyTanks.push(enemyTank);

    enemyTank = new EnemyTank(new Phaser.Math.Vector2(128 + 64, 32));
    enemyTank.preload();
    this.enemyTanks.push(enemyTank);

    enemyTank = new EnemyTank(new Phaser.Math.Vector2(128 + 64, 32 + 64));
    enemyTank.preload();
    this.enemyTanks.push(enemyTank);

    // for (let i = 0; i < 3; i++) {
    //     let enemyTank = new EnemyTank();
    //     enemyTank.preload();
    //     this.enemyTanks.push(enemyTank);
    // }
  }

  create() {
    var map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
    var tileset = map.addTilesetImage("tiles", null, 32, 32, 1, 2);
    this.layer = map.createLayer(0, tileset, 0, 0);

    this.tank.create();

    for (let enemyTank of this.enemyTanks) {
      enemyTank.create();
    }
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
