let game;

// global game options
let gameOptions = {

    initialTime: 60,

    // platform speed range, in pixels per second
    platformSpeedRange: [300, 300],

    // mountain speed, in pixels per second
    rockSpeed: 80,

    // spawn range, how far should be the rightmost platform from the right edge
    // before next platform spawns, in pixels
    spawnRange: [80, 300],

    // platform width range, in pixels
    platformSizeRange: [90, 300],

    // a height range between rightmost platform and next platform to be spawned
    platformHeightRange: [-5, 5],

    // a scale to be multiplied by platformHeightRange
    platformHeighScale: 20,

    // platform max and min height, as screen height ratio
    platformVerticalLimit: [0.4, 0.8],

    // player starting X position
    playerStartPosition: 425,

    // shark starting X position
    sharkStartPosition: 0,

    // sfx muted
    SFXmuted: false,

    musicMuted: false,

    scores: [],
}

window.onload = function() {

    // object containing configuration options
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 1280,
            height: 720
        },
        audio: {
            mute: false,
            volume: 5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        },
        scene: [loadScene, preloadGame, startMenu, playGame, endScreen, scoreScene, howToPlay],
        physics: {
          default: 'arcade',
        }, 
        dom: {
          createContainer: true
        },
    }

    game = new Phaser.Game(gameConfig);
    window.focus();
}

class loadScene extends Phaser.Scene{
  constructor(){
      super("LoadScene");
  }
  preload () {
    this.load.image('sea', './assets/sea-background.jpg');
    this.load.image("turtleStart", "./assets/turtle-loading.png");
  }
  create () {

    this.scene.start("PreloadGame");
  } 
};

class preloadGame extends Phaser.Scene{
  constructor(){
      super("PreloadGame");
  }
  
  preload(){

    this.add.image(640, 360, 'sea')
    this.add.image(640, 360, 'turtleStart')
    
    this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);

    this.load.image('sea', './assets/sea-background.jpg');
    this.load.image("energycontainer", "./assets/energycontainer.png");
    this.load.image("energybar", "./assets/energybar.png");
    this.load.image("clock", "./assets/clock.png")

    this.load.audio("backgroundmusic", ["./assets/bensound-memories.ogg", "./assets/bensound-memories.mp3"])
    this.load.audio("jellymode", ["./assets/zapsplat_cartoon_magic_ascend_spell.ogg", "./assets/zapsplat_cartoon_magic_ascend_spell.mp3"])
    this.load.audio("obstaclehit", ["./assets/zapsplat_sound_design_impact_hit_sub_drop_punchy_001_54851.ogg", "./assets/zapsplat_sound_design_impact_hit_sub_drop_punchy_001_54851.mp3"])
    this.load.audio("collect-star", "./assets/zapsplat_multimedia_alert_bell_ping_wooden_008_54058.mp3")
    this.load.audio("gameOverSound", "./assets/game-over-sound-effect.mp3")
    this.load.audio("chompSound", "./assets/chomp.mp3")


    // coral
    this.load.image('yellowcoral', './assets/coral1.png');
    this.load.image('greencoral', './assets/coral2.png');
    this.load.image('pinkcoral', './assets/coral3.png');


   // shark is a sprite sheet made
    this.load.spritesheet("shark", "./assets/shark.png", {
      frameWidth: 124,
      frameHeight: 67
    });


    // mute buttons
    this.load.image('soundOn', './assets/sound-on-btn.png');
    this.load.image('soundOff', './assets/sound-off-btn.png');

    //buttons
    this.load.image('playButton', './assets/start-btn.png');
    this.load.image('howtoplayButton', './assets/how-to-play-btn.png');
    this.load.image('playAgain', './assets/play-again-btn.png');
    this.load.image('submitScore', './assets/submit-score-btn.png');
    this.load.image('backToMenu', './assets/back-to-menu-btn.png');
    this.load.image('fullscreenMode', './assets/fullscreen-btn.png');
    this.load.image('fullscreenModeOff', './assets/fullscreen-off-btn.png');
    this.load.image('resetButton', './assets/reset-btn.png');

    // how to play screen
    this.load.image('howtoplay', './assets/how-to-play.png');

    // sad turtle
    this.load.image('turtlesad', './assets/turtle-sad.png');

    //seahorse
    this.load.image('seahorse', './assets/seahorse.png');

    // game logo
    this.load.image('logo', './assets/turtle-dash-logo.png');

    // splash
    this.load.spritesheet("splash", "./assets/splash.png", {
      frameWidth: 100,
      frameHeight: 100
  });

    // player is a sprite sheet made

    this.load.spritesheet("player", "./assets/turtle-main.png", {
        frameWidth: 72,
        frameHeight: 55
    });

    // rocks are a sprite sheet made by 512x512 pixels
    this.load.spritesheet("rocks", "./assets/rocks.png", {
      frameWidth: 512,
      frameHeight: 512
    });

    // the star is a sprite sheet made by 50x50 pixels
    this.load.spritesheet("star", "./assets/star.png", {
      frameWidth: 50,
      frameHeight: 50
    });


    // the jellyfish is a sprite sheet made by 50x50 pixels
    this.load.spritesheet("jellyfish", "./assets/jellyfish.png", {
      frameWidth: 50,
      frameHeight: 50
    });

    // the trash is a sprite sheet made by 100x100 pixels
    this.load.spritesheet("trashbag", "./assets/trashbag.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    // the net is a sprite sheet made by 50x50 pixels
    this.load.spritesheet("net", "./assets/net.png", {
      frameWidth: 100,
      frameHeight: 100
    });

    // world collider on left
    //this.load.image("worldcollider", "./assets/invisible-collider.png");    

}


  create(){
    
    // setting player animation
    this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNumbers("player", {
            start: 0,
            end: 3
        }),
        frameRate: 8,
        repeat: -1
    });

    // setting rainbow player animation
    this.anims.create({
      key: "run2",
      frames: this.anims.generateFrameNumbers("player", {
          start: 4,
          end: 9
      }),
      frameRate: 8,
      repeat: -1
  });

    // setting shark animation
    this.anims.create({
      key: "swim",
      frames: this.anims.generateFrameNumbers("shark", {
          start: 0,
          end: 1
      }),
      frameRate: 8,
      yoyo: true,
      repeat: -1
    });

    // setting splash animation
    this.anims.create({
      key: "splash",
      frames: this.anims.generateFrameNumbers("splash", {
          start: 0,
          end: 1
      }),
      frameRate: 8,
      yoyo: true,
      repeat: -1
    });

    // setting star animation
    this.anims.create({
      key: "starpulse",
      frames: this.anims.generateFrameNumbers("star", {
        start: 0,
        end: 5
      }),
      frameRate: 8,
      yoyo: true,
      repeat: -1
    });

    // setting jellyfish animation
    this.anims.create({
      key: "jellyfishpulse",
      frames: this.anims.generateFrameNumbers("jellyfish", {
        start: 0,
        end: 5
      }),
      frameRate: 8,
      yoyo: true,
      repeat: -1
    });

    // setting trashbag animation
    this.anims.create({
      key: "trashbagpulse",
      frames: this.anims.generateFrameNumbers("trashbag", {
        start: 0,
        end: 5
      }),
      frameRate: 8,
      yoyo: true,
      repeat: -1
    });

    // setting net animation
    this.anims.create({
      key: "netpulse",
      frames: this.anims.generateFrameNumbers("net", {
        start: 0,
        end: 5
      }),
    frameRate: 8,
    yoyo: true,
    repeat: -1
    });

    this.scene.start("StartMenu");

  }
}


// playGame scene
class playGame extends Phaser.Scene{
  constructor(){
      super("PlayGame");
  }
  create(){
    this.physics.world.setBoundsCollision(false,true,true,true) //doesn't collide with left boundary

    //  A simple background for our game
    this.add.image(640, 360, 'sea')

    // group with all active rocks.
    this.rocksGroup = this.add.group();

    // adding a rocks
    this.addRocks()

    // adding the player;
    this.player = this.physics.add.sprite(320, 360, "player");
    this.player.setDepth(2);
    this.player.setCollideWorldBounds(true);
    this.player.body.setImmovable(true);

    // playing the background music
    this.bgmusic = this.sound.add('backgroundmusic');
    if (gameOptions.musicMuted === true) {
      this.bgmusic.stop()
    } else {
      this.bgmusic.play(); 
      this.bgmusic.loop = true;
    }

    // muting background music
    this.muteMusic = this.add.text(46, 10, 'Music', { fontFamily: 'bubble_bobbleregular'});
    this.muteMusic.setDepth(3);
  
    this.muteSFX = this.add.text(124, 10, 'SFX', { fontFamily: 'bubble_bobbleregular'});
    this.muteSFX.setDepth(3);

    // adding sound effects
    var starCollected = this.sound.add("collect-star");
    var obstacleHit = this.sound.add("obstaclehit");
    var jellymodesound = this.sound.add("jellymode");

    // settiing the timer
    this.timeLeft = gameOptions.initialTime;

    this.score = 0;
    this.scoreDisplay = this.add.text(42, 80, `Score: ${this.score}`, { fontFamily: 'bubble_bobbleregular', fontSize: '30px'})
    this.scoreDisplay.setDepth(3);

    this.scoreTimer = this.time.addEvent({
      delay: 100,
      callback: function(){
        this.score += 7
        this.scoreDisplay.setText(`Score: ${this.score}`)
       
      },
      callbackScope: this,
      loop: true
    })

    
    this.energyContainer = this.add.image(1000, 20, "energycontainer").setOrigin(0,0);
    this.energyBar = this.add.image(this.energyContainer.x + 25, this.energyContainer.y + 21, "energybar");
    this.energyBar.setOrigin(0,0);
    this.energyBar.setDepth(3);
    this.energyContainer.setDepth(3);
    this.clock = this.add.image(960, 25, "clock").setOrigin(0,0);
    this.clock.setDepth(3);

    this.jumpDuration = 0


    this.gameTimer = this.time.addEvent({
        delay: 100,
        callback: function(){
            this.timeLeft -= 0.1;
            this.jumpDuration -= 0.1;
        },
        callbackScope: this,
        loop: true
    });

    // adding the shark;
    this.shark = this.physics.add.sprite(-150, 360, "shark");
    this.shark.setScale(1.5,1.5);
    this.shark.setDepth(2);
    this.shark.setCollideWorldBounds(true);

    // create seahorse
    this.seahorse = this.physics.add.image(1200, 260, "seahorse")
    this.seahorse.setVisible(false);
   
    // the player is not dying
    this.dying = false;

    if(!this.player.anims.isPlaying){
      this.player.anims.play("run");
      this.shark.anims.play("swim");
    }

    //fullscreen mode
    this.input.keyboard.on("keydown_F", function(){
      if(!this.scale.isFullscreen){
          this.scale.startFullscreen();
      }
    }, this);

    this.muteMusic = this.add.text(179, 10, 'Fullscreen', { fontFamily: 'bubble_bobbleregular'});

    this.add.text(270, 10, 'Reset', { fontFamily: 'bubble_bobbleregular'} )
    this.resetGame = this.add.image(287, 50, 'resetButton')
    this.resetGame.setInteractive()
    this.resetGame.setDepth(3)
    this.resetGame.on('pointerdown', () => { 
      this.bgmusic.stop()
      this.scene.start("PlayGame")
    });


    // create star group
    this.stars = this.physics.add.group()

    //generate random stars
    this.starGenerator = this.time.addEvent({
      delay: 1000,
      callback: function(){
        var star = this.stars.create(game.config.width, game.config.height * Phaser.Math.FloatBetween(0.05, 0.95), 'star');
        star.setVelocityX(-200);
        star.anims.play("starpulse");
        star.setDepth(2);
      },
      callbackScope: this,
      loop: true
    });

    // create jellyfish group
    this.jellyfishes = this.physics.add.group()

    //generate random jellyfish
    this.jellyfishGenerator = this.time.addEvent({
      delay: 1000,
      callback: function(){
        var spawnChance = Math.random();
        if (spawnChance <= 0.25) {
          var jellyfish = this.jellyfishes.create(game.config.width, game.config.height * Phaser.Math.FloatBetween(0.05, 0.95), 'jellyfish');
          jellyfish.setVelocityX(-400);
          jellyfish.anims.play("jellyfishpulse");
          jellyfish.setDepth(2);
        }
      },
      callbackScope: this,
      loop: true
    });

    // create trashbag group
    this.trashbags = this.physics.add.group()

    //generate random trashbag
    this.trashbagGenerator = this.time.addEvent({
      delay: 2000,
      callback: function(){
        var spawnChance = Math.random();
        if (spawnChance <= 0.25) {
          var trashbag = this.trashbags.create(game.config.width, game.config.height * Phaser.Math.FloatBetween(0.05, 0.95), 'trashbag');
          trashbag.setVelocityX(-100);
          trashbag.anims.play("trashbagpulse");
          trashbag.setDepth(2);
        }
      },
      callbackScope: this,
      loop: true
    });

    // create net group
    this.nets = this.physics.add.group()

    //generate random net
    this.netGenerator = this.time.addEvent({
      delay: 2000,
      callback: function(){
        var spawnChance = Math.random();
        if (spawnChance <= 0.25) {
          var net = this.nets.create(game.config.width, game.config.height * Phaser.Math.FloatBetween(0.05, 0.95), 'net');
          net.setVelocityX(-100);
          net.anims.play("netpulse");
          net.setDepth(2);
        }
      },
      callbackScope: this,
      loop: true
    });

    // create yellowcoral group
    this.yellowcorals = this.physics.add.group()

    //generate random yellowcoral
    this.yellowcoralGenerator = this.time.addEvent({
      delay: 2000,
      callback: function(){
        var spawnChance = Math.random();
        if (spawnChance <= 0.25) {
          var yellowcoral = this.yellowcorals.create(game.config.width, game.config.height * Phaser.Math.FloatBetween(0.05, 0.95), 'yellowcoral');
          yellowcoral.setVelocityX(-100);
          yellowcoral.setDepth(2);
          this.physics.add.collider(this.player, yellowcoral, (player, coral) => {
            coral.body.velocity.x = -100;
            coral.body.velocity.y = 0;
            
          }, null, this);
         }

      },
      callbackScope: this,
      loop: true
    });

    // create greencoral group
    this.greencorals = this.physics.add.group()

    //generate random greencoral
    this.greencoralGenerator = this.time.addEvent({
      delay: 2000,
      callback: function(){
        var spawnChance = Math.random();
        if (spawnChance <= 0.25) {
          var greencoral = this.greencorals.create(game.config.width, game.config.height * Phaser.Math.FloatBetween(0.05, 0.95), 'greencoral');
          greencoral.setVelocityX(-100);
          greencoral.setDepth(2);
          this.physics.add.collider(this.player, greencoral, (player, coral) => {
            coral.body.velocity.x = -100;
            coral.body.velocity.y = 0;
         
          }, null, this);
        }
      },
      callbackScope: this,
      loop: true
    });

    // create pinkcoral group
    this.pinkcorals = this.physics.add.group()

    //generate random pinkcoral
    this.pinkcoralGenerator = this.time.addEvent({
      delay: 2000,
      callback: function(){
        var spawnChance = Math.random();
        if (spawnChance <= 0.25) {
          var pinkcoral = this.pinkcorals.create(game.config.width, game.config.height * Phaser.Math.FloatBetween(0.05, 0.95), 'pinkcoral');
          pinkcoral.setVelocityX(-100);
          pinkcoral.setDepth(2);
          this.physics.add.collider(this.player, pinkcoral, (player, coral) => {
            coral.body.velocity.x = -100;
            coral.body.velocity.y = 0;
          }, null, this);
        }
      },
      callbackScope: this,
      loop: true
    });

     //  Setting collisions for stars

     this.physics.add.collider(this.player, this.stars, function(player, star){
      if (gameOptions.SFXmuted === false) {
        starCollected.play()
      }

      if(this.timeLeft <= 60) {
        this.timeLeft += 1 
      }

      this.tweens.add({
          targets: star,
          y: star.y - 100,
          alpha: 0,
          duration: 800,
          ease: "Cubic.easeOut",
          callbackScope: this,
          onComplete: function(){
              this.stars.killAndHide(star);
              this.stars.remove(star);
          }
        });
       }, null, this);

     //  Setting collisions for jellyfish
     this.physics.add.collider(this.player, this.jellyfishes, function(player, jellyfish){
      if (gameOptions.SFXmuted === false) {
        jellymodesound.play()
      }

      this.player.anims.play("run2");
      this.trashcollider.active = false;
      this.netcollider.active = false;
      this.shark.x -= 50;

      this.tweens.add({
          targets: jellyfish,
          y: jellyfish.y - 100,
          alpha: 0,
          duration: 800,
          ease: "Cubic.easeOut",
          callbackScope: this,
          onComplete: function(){
              this.jellyfishes.killAndHide(jellyfish);
              this.jellyfishes.remove(jellyfish);
          }
      });

      var timer = this.time.addEvent({
        delay: 5000,
        callback: function(){
          this.player.anims.play("run");
          this.trashcollider.active = true;
          this.netcollider.active = true;
        },
      
      callbackScope: this,
      loop: false
      });

    }, null, this);

    //  Setting collisions for trashbags
    this.trashcollider = this.physics.add.collider(this.player, this.trashbags, function(player, trashbag){


      trashbag.setTint(0xff0000);
      
      if (gameOptions.SFXmuted === false)  {
        obstacleHit.play()
      }

      this.shark.x += 10;
      this.timeLeft -= 1;

      this.tweens.add({
          targets: trashbag,
          y: trashbag.y - 100,
          alpha: 0,
          duration: 800,
          ease: "Cubic.easeOut",
          callbackScope: this,
          onComplete: function(){
              this.trashbags.killAndHide(trashbag);
              this.trashbags.remove(trashbag);
          }
      });

    }, null, this);

     //  Setting collisions for nets
     this.netcollider = this.physics.add.collider(this.player, this.nets, function(player, net){
      net.setTint(0xff0000);

      if (gameOptions.SFXmuted === false)  {
        obstacleHit.play()
      }

      this.timeLeft -= 1
      this.shark.x += 10;

      this.tweens.add({
          targets: net,
          y: net.y - 100,
          alpha: 0,
          duration: 800,
          ease: "Cubic.easeOut",
          callbackScope: this,
          onComplete: function(){
              this.nets.killAndHide(net);
              this.nets.remove(net);
          }
      });

    }, null, this);  

    this.gameOverSound = this.sound.add('gameOverSound');


  // collisions for shark and player
  this.sharkcollider = this.physics.add.collider(this.player, this.shark, function(player, shark){
    if (gameOptions.SFXmuted === false)  {
      this.chomp = this.sound.add('chompSound');
      this.chomp.play();
    }
    this.player.anims.play("splash");
    this.time.addEvent({
      delay: 1200,
      callback: function(){
      this.gameOver()
      },
      callbackScope: this,
      loop: false
    }); 
  }, null, this);

  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.input.on('pointerdown', () => { this.turtleJump() });
}

  // adding rocks
  addRocks(){
    let rightmostRock = this.getRightmostRock();
    if(rightmostRock < game.config.width * 2) {
        let rock = this.physics.add.sprite(rightmostRock + Phaser.Math.Between(100, 350), game.config.height + Phaser.Math.Between(0, 100), "rocks");
        rock.setOrigin(0.5, 0.85);
        rock.body.setVelocityX(gameOptions.rockSpeed * -1)
        this.rocksGroup.add(rock);
        if(Phaser.Math.Between(0, 1)){
            rock.setDepth(1);
        }
        rock.setFrame(Phaser.Math.Between(0, 3))
        this.addRocks()
    }
  }

  // getting rightmost rock x position
  getRightmostRock(){
    let rightmostRock = -200;
    this.rocksGroup.getChildren().forEach(function(rock){
        rightmostRock = Math.max(rightmostRock, rock.x);
    })
    return rightmostRock;
  }


  turtleJump() {
    this.jumpDuration = 0.8
    this.player.setVelocityY(-200)
    this.player.angle = 10   
  }

  turtleMovement() {
    if(0.5 > this.jumpDuration <= 0.8) { this.player.angle -= 2 }
    if(this.player.angle < 40) { this.player.angle ++ }
    if(this.jumpDuration <= 0) { this.player.setVelocityY(200) }
  }

  sharkMovement() {
    this.shark.setVelocityX(5)
    if(this.shark.y < this.player.y) {
      this.shark.setVelocityY(135)
      this.shark.angle = 30
    } else {
      this.shark.setVelocityY(-180)
      this.shark.angle = 0
    }
  }

  decreaseTimeBar() {
    let percentageOfTimeLeft = this.timeLeft/gameOptions.initialTime  
    this.energyBar.setScale(percentageOfTimeLeft, 1)
    if(percentageOfTimeLeft < 0.1 ) {
      this.energyContainer.setTint(0xff0000)
      this.energyBar.setTint(0xff7070)
    } else {
      this.energyContainer.clearTint()
      this.energyBar.clearTint()
    }
  }

  checkForGameOver() {
    if(this.timeLeft <= 0){
     this.gameOver()
    }
  }

  gameOver() {
    if(gameOptions.SFXmuted === false) {
       this.gameOverSound.play()
       this.bgmusic.stop();
       this.scene.start("EndScreen", {score: this.score, time: this.timeLeft});
      } else {
      this.bgmusic.stop();
      this.scene.start("EndScreen", {score: this.score, time: this.timeLeft});
    }
  }


  // Easter egg
  makeSeahorse(){
     this.seahorseCreate = false;
     this.stepcount = 0;
     
     if (this.score > 15500 && this.seahorseCreate == false) {
       this.seahorse.setVisible(true);
       this.seahorse.setVelocityX(-150);
       this.seahorse.setVelocityY(100);
       this.stepcount += 10
       if(this.stepcount >= 10) {
        this.seahorse.setVelocityY(-20);
        this.stepcount -= 10
       }
       this.time.addEvent({
        delay: 5000,
        callback: function(){
          this.seahorse.setVelocityY(20);
          this.stepcount += 10
        },
      
      callbackScope: this,
      loop: true
      });

      this.time.addEvent({
        delay: 4000,
        callback: function(){
          this.seahorse.setVelocityY(20);
          this.stepcount -= 10
        },
      
      callbackScope: this,
      loop: true
      });

       this.seahorseCreate = true;
     }
  }

  destroyUnusedStars() {
    this.stars.getChildren().forEach(function(star){
      if (star.x < 0) { star.destroy(); }
    })
  }

  destroyUnusedJellyfish() {
    this.jellyfishes.getChildren().forEach(function(jellyfish){
      if (jellyfish.x < 0) { jellyfish.destroy(); }
    })
  }

  destroyUnusedNets() {
    this.nets.getChildren().forEach(function(net){
      if (net.x < 0) { net.destroy(); }
    })
  }

  destroyUnusedTrashbags() {
    this.trashbags.getChildren().forEach(function(trashbag){
      if (trashbag.x < 0) { trashbag.destroy(); }
    })
  }

  destroyUnusedYellowCoral() {
    this.yellowcorals.getChildren().forEach(function(coral){
      if (coral.x < 0) { coral.destroy(); }
    })
  }

  destroyUnusedGreenCoral() {
    this.greencorals.getChildren().forEach(function(coral){
      if (coral.x < 0) { coral.destroy(); }
    })
  }

  destroyUnusedPinkCoral() {
    this.pinkcorals.getChildren().forEach(function(coral){
      if (coral.x < 0) { coral.destroy(); }
    })
  }



  update(){


   this.turtleMovement();
   this.decreaseTimeBar()
   this.sharkMovement()
   this.checkForGameOver()
   this.makeSeahorse()

   this.destroyUnusedStars()
   this.destroyUnusedJellyfish()
   this.destroyUnusedNets()
   this.destroyUnusedTrashbags()
   this.destroyUnusedYellowCoral()
   this.destroyUnusedGreenCoral()
   this.destroyUnusedPinkCoral()


    if (gameOptions.SFXmuted === false) {
      this.SFX = this.add.image(135, 50, 'soundOn')
      this.SFX.setInteractive();
      this.SFX.setDepth(3);
      this.SFX.on('pointerdown', () => {
          gameOptions.SFXmuted = true
        });
    }

    if (gameOptions.SFXmuted === true) {
      this.SFX = this.add.image(135, 50, 'soundOff')
      this.SFX.setInteractive();
      this.SFX.setDepth(3);
      this.SFX.on('pointerdown', () => {
          gameOptions.SFXmuted = false
        });
    }


    if (gameOptions.musicMuted === false) {
      this.music = this.add.image(63, 50, 'soundOn')
      this.music.setInteractive();
      this.music.setDepth(3);
      this.music.on('pointerdown', () => {
        this.bgmusic.stop()
        gameOptions.musicMuted = true
      });
    }

    if (gameOptions.musicMuted === true) {
      this.music = this.add.image(63, 50, 'soundOff')
      this.music.setInteractive();
      this.music.setDepth(3);
      this.music.on('pointerdown', () => {
        this.bgmusic.play()
          gameOptions.musicMuted = false
        });
    }

    this.fullscreen = false;

    if(this.fullscreen === false) {
    this.fullscreenOn = this.add.image(210, 50, 'fullscreenMode')
    this.fullscreenOn.setInteractive();
    this.fullscreenOn.setDepth(3);
    this.fullscreenOn.on('pointerdown', () => {
        this.scale.startFullscreen();
        this.fullscreen = true;
      })
    }

    if(this.scale.isFullscreen) {
      this.fullscreenOff = this.add.image(210, 50, 'fullscreenModeOff')
      this.fullscreenOff.setInteractive();
      this.fullscreenOff.setDepth(3);
      this.fullscreenOff.on('pointerdown', () => {

          this.scale.stopFullscreen();
          this.fullscreen = false;
        }
        )
      }

    // recycling rocks
    this.rocksGroup.getChildren().forEach(function(rock){
      if(rock.x < - rock.displayWidth){
        let rightmostRock = this.getRightmostRock();
        rock.x = rightmostRock + Phaser.Math.Between(100, 350);
        rock.y = game.config.height + Phaser.Math.Between(0, 100);
        rock.setFrame(Phaser.Math.Between(0, 3))
        if(Phaser.Math.Between(0, 1)){
            rock.setDepth(1);
        }
      }
    }, this);
  }
}