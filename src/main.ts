import "./style.css";
import Phaser from "phaser";
import { spriteData, trackData, textList, treeData, lightData, houseData } from "./data";

const getCurveData = (data: number[][]) => {
  const d = (data[0][0] + data[1][0]) / 2;
  const p0 = new Phaser.Math.Vector2(...data[0]);
  const p1 = new Phaser.Math.Vector2(d, data[0][1]);
  const p2 = new Phaser.Math.Vector2(d, data[1][1]);
  const p3 = new Phaser.Math.Vector2(...data[1]);

  const curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

  const max = curve.getLength() / 16;
  const points = [];
  const tangents = [];

  for (let c = 0; c <= max; c++) {
    const t = curve.getUtoTmapping(c / max, 0);

    points.push(curve.getPoint(t));
    tangents.push(curve.getTangent(t));
  }

  return { curve, points, tangents };
}

class Example extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.setBaseURL('/');

    this.load.image('background', 'assets/background.png');

    this.load.image('track0', 'assets/track0.png');
    this.load.image('retarder0', 'assets/retarder0.png');

    this.load.image('train0', 'assets/train0.png');
    this.load.image('train1', 'assets/train1.png');
    this.load.image('train2', 'assets/train2.png');
    this.load.image('train3', 'assets/train3.png');

    this.load.image('tree0', 'assets/tree0.png');

    this.load.image('light0', 'assets/light0.png');

    [...Array(8).keys()].forEach(i => {
      this.load.image(`house${i}`, `assets/house${i}.png`);
    });

    this.load.atlas('flares', 'assets/flares.png', 'assets/flares.json');

    this.load.audio('beep', ['assets/beep.mp3']);
    this.load.audio('explosion', ['assets/explosion.mp3']);
    this.load.audio('switchsound', ['assets/switch.mp3']);
    this.load.audio('retardersound', ['assets/retarder.mp3']);
    this.load.audio('railway', ['assets/railway.mp3']);
    this.load.audio('succeed', ['assets/succeed.mp3']);
    this.load.audio('alt', ['assets/alt.mp3']);
    this.load.audio('fail', ['assets/fail.mp3']);
    this.load.audio('bgm', ['assets/bgm.mp3']);
  }

  private offsetX = 100;
  private offsetY = 140;
  private gridSize = 16;

  private switchList: { id?: string, active?: boolean, target: Phaser.GameObjects.RenderTexture, track: { active?: boolean } }[] = [];
  private spriteList: { target: Phaser.GameObjects.Rectangle, overlapCount: number, id?: string }[] = [];
  private retarderList: { target: Phaser.GameObjects.Sprite }[] = []

  create() {

    this.add.tileSprite(0, 0, 1320, 720, "background").setOrigin(0, 0).setAlpha(0.5);

    const rt = this.add.renderTexture(0, 0, 1320 * 2, 720 * 2).setOrigin(0, 0).setScale(0.5);

    rt.beginDraw();

    for (const item of treeData) {
      rt.batchDraw('tree0', (this.offsetX + (item[0] - 0.5) * this.gridSize) * 2, (this.offsetY + (item[1] - 0.5) * this.gridSize) * 2);
    }

    let i = 2;
    for (const item of houseData) {
      rt.batchDraw('house' + i++ % 8, (this.offsetX + (item[0] - 0.5) * this.gridSize) * 2, (this.offsetY + (item[1] - 0.5) * this.gridSize) * 2);
    }

    rt.endDraw();

    for (const track of trackData) {
      const { curve, points, tangents } = getCurveData(track.data.map(d => d.map(v => v * this.gridSize)));

      const group = this.add.renderTexture(0, 0, 1320, 720).setOrigin(0, 0);
      group.beginDraw();
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const image = this.add.image(0, 0, 'track0').setScale(0.5).setRotation(tangents[i].angle());
        group.batchDraw(image, this.offsetX + p.x, this.offsetY + p.y);
        image.destroy();
      }
      group.endDraw();
      if (track.type === 1) {
        if (track.active) {
          group.setTint(0xFFFFFF);
          group.setDepth(1);
        } else {
          group.setTint(0x666688);
          group.setDepth(-1);
        }
      }
      track.curveData = { curve, points, tangents };
      this.switchList.push(
        {
          id: track.id,
          active: track.active,
          target: group,
          track
        }
      );
    }

    for (const sprite of spriteData) {
      if (sprite.type === 0) {
        const target = this.add.rectangle(this.offsetX + sprite.data[0][0] * this.gridSize, this.offsetY + sprite.data[0][1] * this.gridSize, sprite.data[1][0] * this.gridSize, sprite.data[1][1] * this.gridSize, 0xff0000, 0);

        target.setData('id', sprite.id);
        target.setData('data', sprite);
        target.setData('overlap', false);
        target.setState(sprite.active ? 1 : 0);
        target.setInteractive({ cursor: 'pointer' });

        this.physics.world.enable(target);

        this.spriteList.push({
          target,
          id: sprite.id,
          overlapCount: 0
        });

        target.on('pointerdown', () => {
          if (target.getData('overlap')) {
            return;
          }
          if (sprite.connect) {
            const connect = spriteData.find(s => s.id === sprite.connect);
            if (connect) {
              let flag = false;
              this.spriteList.filter(s => s.id === sprite.connect).forEach(s => {
                if (s.target.getData('overlap')) {
                  flag = true;
                }
              });
              if (flag) {
                return;
              }
            }
          }
          if (sprite.exclude) {
            let flag = false;
            spriteData.filter(s => s.id === sprite.exclude).forEach(s => {
              if (s.active) {
                flag = true;
              }
            });
            if (flag) {
              return;
            }
          }
          sprite.active = !sprite.active;
          this.switchList.filter(s => s.id === sprite.id).forEach(s => {
            s.active = !s.active;
            s.track.active = !s.track.active;
            if (s.active) {
              s.target.setTint(0xFFFFFF);
              s.target.setDepth(1);
            } else {
              s.target.setTint(0x666688);
              s.target.setDepth(-1);
            }
          });
          if (sprite.connect) {
            const connect = spriteData.find(s => s.id === sprite.connect);
            if (connect) {
              connect.active = !connect.active;
            }
            this.switchList.filter(s => s.id === sprite.connect).forEach(s => {
              s.active = !s.active;
              s.track.active = !s.track.active;
              if (s.active) {
                s.target.setTint(0xFFFFFF);
                s.target.setDepth(1);
              } else {
                s.target.setTint(0x666688);
                s.target.setDepth(-1);
              }
            });
          }

          const sound = this.sound.add('switchsound').setVolume(0.3)
          sound.play();
          sound.on('complete', () => {
            sound.destroy();
          });
        });

      } else if (sprite.type === 1) {
        const texture = 'retarder0';
        const target = this.add.sprite(this.offsetX + sprite.data[0][0] * this.gridSize, this.offsetY + sprite.data[0][1] * this.gridSize, texture);

        target.setData('id', sprite.id);
        target.setData('data', sprite);
        target.setState(sprite.active ? 1 : 0);
        target.setScale(0.5);
        target.setInteractive({ cursor: 'pointer' });

        this.physics.world.enable(target);

        target.on('pointerdown', () => {
          const flag = target.state === 0;
          target.setState(flag ? 1 : 0);
          if (flag) {
            target.setTint(0x22FF33);
          } else {
            target.clearTint();
          }

          const sound = this.sound.add('retardersound').setVolume(0.3)
          sound.play();
          sound.on('complete', () => {
            sound.destroy();
          });
        });

        this.retarderList.push({
          target
        });
      }
    }

    for (const text of textList) {
      this.add.text(this.offsetX + text.x * this.gridSize, this.offsetY + text.y * this.gridSize, text.text, { color: '#B0BEC5', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' });

      const end = this.add.rectangle(this.offsetX + (text.x - 1.5) * this.gridSize, this.offsetY + (text.y + 0.5) * this.gridSize, 2 * this.gridSize, 2 * this.gridSize, 0xff0000, 0);
      end.setData('id', text.text);
      this.physics.world.enable(end);
      this.endList.push(end);
    }

    this.add.text(660, 40, "驼峰模拟器之溜车达人", { color: '#CFD8DC', fontSize: '24px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5).setStroke('#607D8B', 8).setShadow(4, 4, '#263238', 2, true, false);
    this.add.text(660, 80, "最高分：" + this.highestScore, { color: '#FFCCBC', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5).setStroke('#BF360C', 6).setShadow(4, 4, '#263238', 2, true, false);

    this.add.text(40, 60, "时间：", { color: '#BBDEFB', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#1976D2', 2).setShadow(4, 4, '#263238', 2, true, false);
    this.add.text(1100, 60, "分数：", { color: '#FFF9C4', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#F9A825', 2).setShadow(4, 4, '#263238', 2, true, false);
    const timer = this.add.text(100, 60, "0", { color: '#BBDEFB', fontSize: '20px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#1976D2', 2).setShadow(4, 4, '#263238', 2, true, false);
    const score = this.add.text(1280, 60, "0", { color: '#FFF9C4', fontSize: '20px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(1, 0.5).setStroke('#F9A825', 2).setShadow(4, 4, '#263238', 2, true, false);

    this.score = {
      text: score,
      value: 0
    };
    this.timer = {
      text: timer,
      value: 0
    };

    this.add.text(140, 170, "溜放计数：", { color: '#BCAAA4', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#5D4037', 2).setShadow(4, 4, '#263238', 2, true, false);
    this.add.text(280, 170, "成功计数：", { color: '#BCAAA4', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#5D4037', 2).setShadow(4, 4, '#263238', 2, true, false);
    this.add.text(140, 200, "当前连击：", { color: '#BCAAA4', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#5D4037', 2).setShadow(4, 4, '#263238', 2, true, false);
    this.add.text(280, 200, "最高连击：", { color: '#BCAAA4', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#5D4037', 2).setShadow(4, 4, '#263238', 2, true, false);

    this.trainCount = {
      text: this.add.text(220, 170, "0", { color: '#BCAAA4', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#5D4037', 2).setShadow(4, 4, '#263238', 2, true, false),
      value: 0
    }
    this.succeedCount = {
      text: this.add.text(360, 170, "0", { color: '#BCAAA4', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#5D4037', 2).setShadow(4, 4, '#263238', 2, true, false),
      value: 0
    }
    this.comboCount = {
      text: this.add.text(220, 200, "0", { color: '#BCAAA4', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#5D4037', 2).setShadow(4, 4, '#263238', 2, true, false),
      value: 0
    }
    this.comboHighestCount = {
      text: this.add.text(360, 200, "0", { color: '#BCAAA4', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#5D4037', 2).setShadow(4, 4, '#263238', 2, true, false),
      value: 0
    }

    this.add.text(this.offsetX + this.gridSize * -2, this.offsetY + this.gridSize * 12, "◀︎", { color: '#EF5350', fontSize: '12px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5);
    this.add.text(this.offsetX + this.gridSize * -2, this.offsetY + this.gridSize * 20, "◀︎", { color: '#EF5350', fontSize: '12px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5);
    this.alarm0 = this.add.text(this.offsetX + this.gridSize * 4, this.offsetY + this.gridSize * 7, "当前还能放置16列车", { color: '#FFCDD2', fontSize: '16px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5).setStroke('#D32F2F', 2).setShadow(4, 4, '#263238', 2, true, false);
    this.alarm1 = this.add.text(this.offsetX + this.gridSize * 4, this.offsetY + this.gridSize * 25, "当前还能放置16列车", { color: '#FFCDD2', fontSize: '16px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5).setStroke('#D32F2F', 2).setShadow(4, 4, '#263238', 2, true, false);

    this.alarm0.setScale(1).setData("fx", this.add.tween({
      duration: 400,
      repeatDelay: 200,
      targets: this.alarm0,
      scale: {
        from: 1,
        to: 1.4
      },
      yoyo: true,
      repeat: -1,
      paused: true
    }));
    this.alarm1.setScale(1).setData("fx", this.add.tween({
      duration: 400,
      repeatDelay: 200,
      targets: this.alarm1,
      scale: {
        from: 1,
        to: 1.4
      },
      yoyo: true,
      repeat: -1,
      paused: true
    }));

    this.time.addEvent({
      repeat: -1, delay: 1000, callback: () => {
        if (this.timer) {
          this.timer.value++;
          this.timer.text.setText(this.timer.value.toString());
        }
      }
    });

    const button0 = this.add.container(this.offsetX + 4 * this.gridSize, this.offsetY + 10 * this.gridSize, [
      this.add.graphics().fillStyle(0xAADDFF, 1).fillRoundedRect(-40, -15, 80, 30, 6),
      this.add.text(0, 0, "开始溜放", { color: '#223366', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5)
    ]).setState(1).setData("target", 0).setSize(80, 30).setInteractive({ cursor: 'pointer' })
      .on('pointerdown', () => {
        if (button0.state !== 1) {
          return;
        }
        if (this.readyList0.length === 0) {
          return;
        }
        button0.setState(0);
        button0.setAlpha(0.5);

        const target = this.readyList0[0];
        button0.setData("target", target.id);
        this.readyList.push({
          id: target.id,
          dest: target.dest,
          type: target.type,
          start: 0
        });
        target.text.destroy();
        this.readyList0.splice(0, 1);
        for (const item of this.readyList0) {
          item.text.setPosition(this.offsetX + -4 * this.gridSize, this.offsetY + (12 - this.readyList0.indexOf(item) * 1) * this.gridSize);
        }
        this.alarm0?.setText("当前还能放置" + (16 - this.readyList0.length) + "列车");
        if (this.readyList0.length > 10) {
          (this.alarm0?.getData("fx") as Phaser.Tweens.Tween).restart().play();
        } else {
          (this.alarm0?.getData("fx") as Phaser.Tweens.Tween).seek(0.1).pause();
        }

        this.changeTrainCount(this.trainCount ? this.trainCount.value + 1 : 1);

        const sound = this.sound.add('beep').setVolume(0.2)
        sound.play();
        sound.on('complete', () => {
          sound.destroy();
        });
      })

    const button1 = this.add.container(this.offsetX + 4 * this.gridSize, this.offsetY + 22 * this.gridSize, [
      this.add.graphics().fillStyle(0xAADDFF, 1).fillRoundedRect(-40, -15, 80, 30, 6),
      this.add.text(0, 0, "开始溜放", { color: '#223366', fontSize: '14px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5)
    ]).setState(1).setData("target", 0).setSize(80, 30).setInteractive({ cursor: 'pointer' })
      .on('pointerdown', () => {
        if (button1.state !== 1) {
          return;
        }
        if (this.readyList1.length === 0) {
          return;
        }
        button1.setState(0);
        button1.setAlpha(0.5);

        const target = this.readyList1[0];
        button1.setData("target", target.id);
        this.readyList.push({
          id: target.id,
          dest: target.dest,
          type: target.type,
          start: 1
        });
        target.text.destroy();
        this.readyList1.splice(0, 1);
        for (const item of this.readyList1) {
          item.text.setPosition(this.offsetX + -4 * this.gridSize, this.offsetY + (20 + this.readyList1.indexOf(item) * 1) * this.gridSize);
        }
        this.alarm1?.setText("当前还能放置" + (16 - this.readyList1.length) + "列车");
        if (this.readyList1.length > 10) {
          (this.alarm1?.getData("fx") as Phaser.Tweens.Tween).restart().play();
        } else {
          (this.alarm1?.getData("fx") as Phaser.Tweens.Tween).seek(0.1).pause();
        }

        this.changeTrainCount(this.trainCount ? this.trainCount.value + 1 : 1);

        const sound = this.sound.add('beep').setVolume(0.2)
        sound.play();
        sound.on('complete', () => {
          sound.destroy();
        });
      })

    this.button0 = button0;
    this.button1 = button1;

    const music = this.sound.add('bgm').setLoop(true).setVolume(0.5);

    const railsound = this.sound.add('railway').setVolume(0.2);

    this.bgm = music;
    this.railsound = railsound;

    for (const light of lightData) {
      this.add.pointlight(this.offsetX + (light[0] - 0.2) * this.gridSize, this.offsetY + (light[1] - 0.1) * this.gridSize, 0x2244FF, 16, 0.2);
      this.add.image(this.offsetX + light[0] * this.gridSize, this.offsetY + light[1] * this.gridSize, 'light0').setScale(0.5);
    }

    this.preStart();

    /*
    const list: [number, number][] = [];
    this.input.on('pointerdown', (pointer: any) => {
      this.add.image(pointer.x, pointer.y, 'tree0').setScale(0.5);
      list.push([Math.round((pointer.x - this.offsetX) / this.gridSize), Math.round((pointer.y - this.offsetY) / this.gridSize)]);
      console.log(list);
    });
    */
  }

  private bgm: Phaser.Sound.BaseSound | undefined;
  private railsound: Phaser.Sound.BaseSound | undefined;

  private alarm0: Phaser.GameObjects.Text | undefined;
  private alarm1: Phaser.GameObjects.Text | undefined;

  private button0: Phaser.GameObjects.Container | undefined;
  private button1: Phaser.GameObjects.Container | undefined;

  private readyList0: { id: number, dest: string, type: number, text: Phaser.GameObjects.Text }[] = [];
  private readyList1: { id: number, dest: string, type: number, text: Phaser.GameObjects.Text }[] = [];

  private readyList: { id: number, dest: string, type: number, start: number }[] = [];

  private score: {
    text: Phaser.GameObjects.Text,
    value: number
  } | undefined;
  private timer: {
    text: Phaser.GameObjects.Text,
    value: number
  } | undefined;
  private trainCount: {
    text: Phaser.GameObjects.Text,
    value: number
  } | undefined;
  private succeedCount: {
    text: Phaser.GameObjects.Text,
    value: number
  } | undefined;
  private comboCount: {
    text: Phaser.GameObjects.Text,
    value: number
  } | undefined;
  private comboHighestCount: {
    text: Phaser.GameObjects.Text,
    value: number
  } | undefined;

  private changeTrainCount(value:number){
    if(this.trainCount){
      this.trainCount.value = value;
      this.trainCount.text.setText(this.trainCount.value.toString());
    }
  }

  private changesucceedCount(value:number){
    if(this.succeedCount){
      this.succeedCount.value = value;
      this.succeedCount.text.setText(this.succeedCount.value.toString());
    }
  }

  private changeComboCount(value:number){
    if(this.comboCount){
      this.comboCount.value = value;
      this.comboCount.text.setText(this.comboCount.value.toString());
      if(this.comboHighestCount && value > this.comboHighestCount.value){
        this.comboHighestCount.value = value;
        this.comboHighestCount.text.setText(value.toString());
      }
    }
  }

  private highestScore:number = localStorage.getItem("highestScore") ? parseInt(localStorage.getItem("highestScore") as string) : 0;
  private updateHighestScore = () => {
    if(this.score && this.score.value > this.highestScore){
      this.highestScore = this.score.value;
      localStorage.setItem("highestScore", this.highestScore.toString());
    }
  }

  private endList: Phaser.GameObjects.Rectangle[] = [];

  private trainData = [{
    texture: 'train0',
    color: '#ffffff',
    speed: 0.1,
    acc: -0.0002,
    accretarder: -0.2,
    score: 1000,
    altscore: -200,
    failscore: -2000,
  }, {
    texture: 'train1',
    color: '#63b04c',
    speed: 0.12,
    acc: -0.00016,
    accretarder: -0.15,
    score: 600,
    altscore: 200,
    failscore: -1000,
  }, {
    texture: 'train2',
    color: '#bbe1fb',
    speed: 0.08,
    acc: -0.00022,
    accretarder: -0.24,
    score: 2000,
    altscore: -500,
    failscore: -5000,
  }, {
    texture: 'train3',
    color: '#f0ca7a',
    speed: 0.15,
    acc: -0.00012,
    accretarder: -0.18,
    score: 1500,
    altscore: -400,
    failscore: -3000,
  }];

  private trainList: {
    speed: number,
    sprite: Phaser.GameObjects.PathFollower,
    text: Phaser.GameObjects.Container,
    head: number[],
    tail: number[],
    acc: number,
    accretarder: number,
    score: number,
    altscore: number,
    failscore: number
  }[] = [];

  private count = 0;
  private isFinished = false;

  update() {

    if (this.isFinished) {
      return;
    }

    for (const target of this.spriteList) {
      target.target.setData('overlap', target.overlapCount <= 0);
      target.overlapCount = 1;
    }

    if (this.timer?.value) {
      const value = this.timer.value;
      if (this.readyList0.length <= 16 && 120 / (value + 60) * Math.random() < 0.02 / this.readyList0.length) {
        if (this.readyList0.length === 16) {
          this.finished();
          this.isFinished = true;
          return;
        }
        let dest = Math.floor(Math.random() * 16 + 1).toFixed(0);
        if (dest.length === 1) {
          dest = "0" + dest;
        }
        const type = this.trainData.length * Math.random() | 0 % this.trainData.length;
        this.count += 1;
        this.readyList0.push({
          id: this.count,
          dest,
          type,
          text: this.add.text(this.offsetX + -4 * this.gridSize, this.offsetY + (12 - this.readyList0.length * 1) * this.gridSize, dest, { color: '#000000', fontSize: '12px', fontFamily: 'Arial', fontStyle: 'bold', backgroundColor: this.trainData[type].color, padding: { x: 6, y: 2 } }).setOrigin(0, 0.5)
        });
        this.alarm0?.setText("当前还能放置" + (16 - this.readyList0.length) + "列车");
        if (this.readyList0.length > 10) {
          (this.alarm0?.getData("fx") as Phaser.Tweens.Tween).restart().play();
        } else {
          (this.alarm0?.getData("fx") as Phaser.Tweens.Tween).seek(0.1).pause();
        }
      }
      if (this.readyList1.length <= 16 && 120 / (value + 60) * Math.random() < 0.02 / this.readyList1.length) {
        if (this.readyList1.length === 16) {
          this.finished();
          this.isFinished = true;
          return;
        }
        let dest = Math.floor(Math.random() * 16 + 1).toFixed(0);
        if (dest.length === 1) {
          dest = "0" + dest;
        }
        const type = this.trainData.length * Math.random() | 0 % this.trainData.length;
        this.count += 1;
        this.readyList1.push({
          id: this.count,
          dest,
          type,
          text: this.add.text(this.offsetX + -4 * this.gridSize, this.offsetY + (20 + this.readyList1.length * 1) * this.gridSize, dest, { color: '#000000', fontSize: '12px', fontFamily: 'Arial', fontStyle: 'bold', backgroundColor: this.trainData[type].color, padding: { x: 6, y: 2 } }).setOrigin(0, 0.5)
        });
        this.alarm1?.setText("当前还能放置" + (16 - this.readyList1.length) + "列车");
        if (this.readyList1.length > 10) {
          (this.alarm1?.getData("fx") as Phaser.Tweens.Tween).restart().play();
        } else {
          (this.alarm1?.getData("fx") as Phaser.Tweens.Tween).seek(0.1).pause();
        }
      }
    }

    if (this.readyList.length > 0) {
      const start = this.readyList[0];
      this.readyList.splice(0, 1);
      const head = trackData[start.start];
      if (head.curveData) {

        const ox = this.offsetX + head.data[0][0] * this.gridSize;
        const oy = this.offsetY + head.data[0][1] * this.gridSize;

        const data = this.trainData[start.type];

        const speed = data.speed;
        const duration = head.curveData.curve.getLength() / speed;

        const sprite = this.add.follower(head.curveData.curve as any, ox, oy, data.texture).setData("curve", head.curveData.curve).setDepth(10).setScale(0.8);

        sprite.setData('id', start.id);

        this.physics.world.enable(sprite);

        const spriteFX0 = sprite.postFX.addReveal(1, 1, 0);
        this.tweens.add({
          targets: spriteFX0,
          progress: 1,
          duration: 500
        }
        );

        const spriteFX1 = sprite.postFX.addWipe(1, 1, 0);
        const planetFXTween1 = this.tweens.add({
          targets: spriteFX1,
          progress: 1,
          duration: 500,
          paused: true
        }
        );

        for (const otherTrain of this.trainList) {
          this.physics.add.collider(sprite, otherTrain.sprite, () => {
            const train = this.trainList.find(t => t.sprite === sprite);
            this.failed(sprite, train);
            this.failed(otherTrain.sprite, otherTrain);
            sprite.destroy();
            otherTrain.sprite.destroy();
            train?.text.destroy();
            otherTrain?.text.destroy();
            this.trainList = this.trainList.filter(t => t != train && t != otherTrain);
          });
        }

        for (const end of this.endList) {
          this.physics.add.overlap(sprite, end, () => {
            this.physics.world.disable(sprite);

            sprite.setData('end', true);

            planetFXTween1.restart();
            planetFXTween1.play();

            const train = this.trainList.find(t => t.sprite === sprite);

            const dest = sprite.getData("dest");
            const curr = end.getData("id");

            const success = (dest && curr && parseInt(dest) === parseInt(curr));

            if (train) {
              const score = success ? train.score : train.altscore;
              const text = this.add.text(sprite.x + 20, sprite.y - 20, score.toString(), { color: '#ffffff', fontSize: '16px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5);

              this.tweens.add({
                targets: text,
                duration: 300,
                y: '-=30',
                scale: 1.6,
              });
              const spriteFX = text.postFX.addWipe(1, 1, 1);
              this.tweens.add({
                targets: spriteFX,
                progress: 1,
                duration: 500,
                onComplete: () => {
                  text.destroy();
                }
              }
              );

              if (this.score) {
                const add = success ? score + Math.min(this.comboCount?.value || 0, 10) * score * 0.1 : score;
                this.add.tween({
                  duration: 500,
                  targets: this.score.text,
                  text: {
                    from: this.score.value,
                    to: this.score.value + add
                  },
                });
                this.score.value += add;
              }

              if(success){
                this.changesucceedCount(this.succeedCount ? this.succeedCount.value + 1 : 0);
                this.changeComboCount(this.comboCount ? this.comboCount.value + 1 : 0);
              }
              else{
                this.changeComboCount(0);
              }

              const sound = this.sound.add(success ? 'succeed' : 'alt').setVolume(0.5)
              sound.play();
              sound.on('complete', () => {
                sound.destroy();
              });
            }
          });
        }

        for (const target of this.spriteList) {
          this.physics.add.overlap(sprite, target.target, () => {
            target.target.setData('overlap', true);
            target.overlapCount = 0;
            if (target.target.getData("id") === "S01") {
              if (sprite.getData("id") === this.button0?.getData("target")) {
                this.button0?.setData("target", 0);
                this.button0?.setState(1);
                this.button0?.setAlpha(1);
              }
            }
            if (target.target.getData("id") === "S02") {
              if (sprite.getData("id") === this.button1?.getData("target")) {
                this.button1?.setData("target", 0);
                this.button1?.setState(1);
                this.button1?.setAlpha(1);
              }
            }

            if (!this.railsound?.isPlaying) {
              this.railsound?.play();
            }
          });
        }

        for (const target of this.retarderList) {
          this.physics.add.overlap(sprite, target.target, () => {
            if (target.target.state === 1 && sprite.getData('retarder') !== target.target) {
              sprite.setData('retarder', target.target);
              sprite.setData('acc1', data.accretarder);
            }
          });
        }

        const dest = start.dest;
        sprite.setData("dest", dest);
        const circle = this.add.circle(0, 0, 10, 0x2255AA);
        const text = this.add.text(0, 0, dest, { color: '#ffffff', fontSize: '12px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        const container = this.add.container(0, 0, [circle, text]).setDepth(11).setPosition(sprite.x, sprite.y);

        const train = {
          speed,
          sprite,
          text: container,
          head: head.data[0],
          tail: head.data[1],
          acc: data.acc,
          accretarder: data.accretarder,
          score: data.score,
          altscore: data.altscore,
          failscore: data.failscore
        };

        this.trainList.push(train);

        sprite.setData('acc0', 0);
        sprite.setData('acc1', 0);

        const onUpdate = (t: Phaser.Tweens.Tween) => {
          if (this.isFinished) {
            t.stop();
          }
          const curve = sprite.getData("curve");
          if (!curve) {
            return;
          }
          let angle = curve.getTangent(t.progress).angle();
          if (angle >= Math.PI) {
            angle -= Math.PI * 2;
          }
          sprite.rotation = sprite.rotation * 0.3 + angle * 0.7;
        }

        const onComplete = () => {
          const curve = sprite.getData("curve");
          if (!curve) {
            return;
          }
          if (train) {
            const nextTrack = trackData.find(t => (t.type === 0 || t.active) && t.data[0][0] === train.tail[0] && t.data[0][1] === train.tail[1]);
            if (nextTrack && nextTrack.curveData) {

              const acc0 = sprite.getData('acc0');
              const acc1 = sprite.getData('acc1');
              train.speed += (acc0 + acc1) * (train.speed + 0.02);
              if (train.speed < 0) {
                train.speed = 0;
              }

              sprite.setData('acc0', nextTrack.curveData.curve.getLength() * train.acc);
              sprite.setData('acc1', 0);

              sprite.setData("curve", nextTrack.curveData.curve);
              sprite.setPath(nextTrack.curveData.curve as any, {
                duration: nextTrack.curveData.curve.getLength() / train.speed,
                ease: 'linear',
                onComplete,
                onUpdate,
              });
              train.head = nextTrack.data[0];
              train.tail = nextTrack.data[1];
            }
            else {
              const end = sprite.getData('end');
              const train = this.trainList.find(t => t.sprite === sprite);
              this.trainList = this.trainList.filter(t => t.sprite !== sprite);
              train?.text.destroy();
              sprite.destroy();
              if (end) {
                return;
              }
              this.failed(sprite, train);
            }
          }
        }
        sprite.startFollow({
          duration: duration,
          ease: 'linear',
          onComplete,
          onUpdate,
        });
      }
    }

    for (const train of this.trainList) {
      train.text.setPosition(train.sprite.x + 52 * Math.cos(train.sprite.rotation), train.sprite.y + 52 * Math.sin(train.sprite.rotation));
    }
  }

  private preStart = () => {
    this.time.paused = true;

    const manual = `
你是一名货运站场调车长，你的任务是尽快将列车溜放到正确的轨道上。
你可以通过点击开始溜放按钮来溜放列车，然后点击道岔来控制列车前进方向。
成功将列车送入轨道将获得分数奖励，送错轨道将会扣分。
启动轨道上的减速器可以大幅降低车速，但千万注意不要发生撞车事故哦！
    `;

    const panel0 = this.add.rectangle(0, 0, 1320, 720, 0x000000, 0.7).setOrigin(0, 0).setDepth(100).setInteractive();
    const panel1 = this.add.container(1320 / 2, 720 / 2, [
      this.add.graphics().fillRoundedRect(-300, -220, 600, 400, 32).fillStyle(0x000000, 1),
      this.add.text(0, -160, "溜车达人", { color: '#ECEFF1', fontSize: '32px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5).setStroke('#607D8B', 8).setShadow(4, 4, '#263238', 2, true, false),
      this.add.text(0, -130, manual, { color: '#E1F5FE', fontSize: '16px', fontFamily: 'Arial', fontStyle: 'bold', lineSpacing: 8 }).setOrigin(0.5, 0).setStroke('#0D47A1', 2).setShadow(4, 4, '#263238', 2, true, false).setWordWrapWidth(420, true),
      this.add.container(0, 120, [
        this.add.graphics().fillStyle(0xB0BEC5, 1).fillRoundedRect(-72, -30, 144, 60, 12),
        this.add.text(0, 0, "开始游戏", { color: '#223366', fontSize: '24px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5)
      ]).setDepth(102).setSize(80, 30).setInteractive({ cursor: 'pointer' })
        .on('pointerdown', function (this: Phaser.GameObjects.Text) {
          this.setAlpha(0.5);
        })
        .on('pointerout', function (this: Phaser.GameObjects.Text) {
          this.setAlpha(1);
        })
        .on('pointerup', () => {

          panel0.destroy();
          panel1.destroy();

          this.start();
        })
    ]).setDepth(101);
  }

  private start = () => {
    this.time.paused = false;
    this.bgm?.play();
  }

  private finished = () => {
    this.bgm?.stop();
    this.railsound?.stop();
    this.time.paused = true;

    const sound = this.sound.add('fail').setVolume(0.5);
    sound.play();
    sound.on('complete', () => {
      sound.destroy();
    });

    this.physics.shutdown();

    this.updateHighestScore();

    const button = this.add.container(0, 120, [
      this.add.graphics().fillStyle(0xB0BEC5, 1).fillRoundedRect(-72, -30, 144, 60, 12),
      this.add.text(0, 0, "重新开始", { color: '#223366', fontSize: '24px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5)
    ]).setDepth(102).setSize(80, 30).setInteractive({ cursor: 'pointer' })
      .on('pointerdown', function (this: Phaser.GameObjects.Text) {

        this.setAlpha(0.5);

        game.destroy(true);

        document.addEventListener('mousedown', function newGame() {
          game = new Phaser.Game(config);
          document.removeEventListener('mousedown', newGame);
        });
      });

    this.add.rectangle(0, 0, 1320, 720, 0x000000, 0.7).setOrigin(0, 0).setDepth(100).setInteractive();
    this.add.container(1320 / 2, 720 / 2, [
      this.add.graphics().fillRoundedRect(-300, -220, 600, 400, 32).fillStyle(0x000000, 1),
      this.add.text(0, -160, "游戏结束", { color: '#ECEFF1', fontSize: '32px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0.5, 0.5).setStroke('#607D8B', 8).setShadow(4, 4, '#263238', 2, true, false),
      this.add.text(-120, -80, "游戏得分：", { color: '#E1F5FE', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#0D47A1', 2).setShadow(4, 4, '#263238', 2, true, false),
      this.add.text(-120, -40, "成功溜放：", { color: '#E1F5FE', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#0D47A1', 2).setShadow(4, 4, '#263238', 2, true, false),
      this.add.text(-120, 0, "失败溜放：", { color: '#E1F5FE', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#0D47A1', 2).setShadow(4, 4, '#263238', 2, true, false),
      this.add.text(-120, 40, "最高连击：", { color: '#E1F5FE', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(0, 0.5).setStroke('#0D47A1', 2).setShadow(4, 4, '#263238', 2, true, false),

      this.add.text(120, -80, this.score?.value?.toString() || "0", { color: '#E1F5FE', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(1, 0.5).setStroke('#0D47A1', 2).setShadow(4, 4, '#263238', 2, true, false),
      this.add.text(120, -40, this.succeedCount?.value?.toString() || "0", { color: '#E1F5FE', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(1, 0.5).setStroke('#0D47A1', 2).setShadow(4, 4, '#263238', 2, true, false),
      this.add.text(120, 0, this.trainCount && this.succeedCount ? (this.trainCount.value - this.succeedCount.value).toString() : "0", { color: '#E1F5FE', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(1, 0.5).setStroke('#0D47A1', 2).setShadow(4, 4, '#263238', 2, true, false),
      this.add.text(120, 40, this.comboHighestCount?.value?.toString() || "0", { color: '#E1F5FE', fontSize: '18px', fontFamily: 'Arial', fontStyle: 'bold' }).setOrigin(1, 0.5).setStroke('#0D47A1', 2).setShadow(4, 4, '#263238', 2, true, false),

      button
    ]).setDepth(101);
  }

  private failed = (sprite: Phaser.GameObjects.Sprite, train?: typeof this.trainList[number]) => {
    if (this.score && train) {
      this.add.tween({
        duration: 500,
        targets: this.score.text,
        text: {
          from: this.score.value,
          to: this.score.value + train?.failscore
        },
      });
      this.score.value += train?.failscore;

      this.changeComboCount(0);

      const flame = this.add.particles(sprite.x + 16, sprite.y, 'flares',
        {
          frame: 'white',
          color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
          colorEase: 'quad.out',
          lifespan: 1000,
          scale: { start: 0.40, end: 0.05, ease: 'sine.out' },
          speed: 60,
          advance: 800,
          frequency: 20,
          blendMode: 'ADD',
          duration: 100,
        });
      flame.setDepth(1);
      flame.once("complete", () => {
        flame.destroy();
      });

      const sound = this.sound.add('explosion').setVolume(0.3)
      sound.play();
      sound.on('complete', () => {
        sound.destroy();
      });
    }
  }
}


const config = {
  type: Phaser.AUTO,
  width: 1320,
  height: 720,
  backgroundColor: '#252B38',
  banner: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: Example
};

let game = new Phaser.Game(config);