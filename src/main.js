var Constants = {
  NoteLength: 200,

  NoteVolume: 0.1,

  Directions: {
    East: 0,
    South: 1,
    West: 2,
    North: 3
  },

  LoColor: 0x0D355E,
  HiColor: 0x90D5F0,
};

// List of patterns
var Patterns = {
  wall: [0],
  open: [1],
  a: [0, 1],
  goal: [1, 0, 1, 1, 0, 0],
  bp: [1, 1, 0, 0, 1, 1],
  c: [0, 1, 0, 0, 1, 1],
  lock: [1, 1, 0, 0, 0, 1],
  key: [0, 1, 0, 0, 1, 0],
};

// Hash for mapping map tiles to patterns
var MapKeyToPattern = {};
MapKeyToPattern['wa'] = 'wall';
MapKeyToPattern[0] = 'open';
MapKeyToPattern['st'] = 'open';
MapKeyToPattern['gl'] = 'goal';
MapKeyToPattern['lo'] = 'lock';
MapKeyToPattern['ke'] = 'key';

// Maps are represented as two-dimensional arrays.
// The game has no bounds checking, so be sure to wrap everyting
// around with walls or the game will crash.
var Maps = [
{
  data: [['wa', 'wa', 'wa', "wa", "wa", "wa", "wa"],
         ["wa",    0,    0, "gl", "wa", "wa", "wa"],
         ["wa",    0, "wa", "wa", "wa", "wa", "wa"],
         ["wa", "st", "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa"],
  ],
},
{
  data: [['wa', "wa", 'wa', "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "gl",    0, "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa",    0, "wa", "wa"],
         ["wa",    0,    0,    0, "wa",    0, "wa", "wa"],
         ["wa",    0, "st",    0,    0,    0, "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
  ],
},
{
  data: [['wa', "wa", 'wa', "wa", "wa", "wa", "wa", "wa"],
         ["wa",    0,    0, "wa", "wa", "wa", "wa", "wa"],
         ["wa",    0,    0, "wa",    0, "wa", "wa", "wa"],
         ["wa", "st",    0, "wa",    0, "wa", "wa", "wa"],
         ["wa",    0, "wa", "wa",    0, "wa", "wa", "wa"],
         ["wa",    0,    0,    0,    0, "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa",    0, "wa", "wa", "wa"],
         ["wa", "wa", "gl",    0,    0, "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
  ],
},
{
  data: [['wa', "wa", 'wa', "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa",    0,    0,    0,    0, "wa"],
         ["wa", "wa", "wa", "wa",    0, "wa", "st", "wa"],
         ["wa", "wa", "wa",    0,    0,    0, "wa", "wa"],
         ["wa", "wa", "wa", "wa",    0, "wa", "wa", "wa"],
         ["wa", "wa", "wa",    0,    0,    0, "gl", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
  ],
},
{
  data: [['wa', "wa", 'wa', "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "gl", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa",    0, "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "lo", "wa", "wa", "wa", "wa"],
         ["wa",    0,    0,    0, "wa", "wa", "wa", "wa"],
         ["wa", "ke", "wa",    0, "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa",    0, "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "st", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
  ],
},
];

var View = function () {
  this.lo = null;
  this.hi = null;
  this.isHigh = false;

  this.patternLoop = null
  this.currentPattern = null;

  this.facing = Constants.Directions.North;

  this.currentLevel = null;
  this.currentX = 0;
  this.currentY = 0;
  this.hasKey = false;
};
View.prototype.init = function (levelIndex) {
  // game scaling
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.refresh();
  this.game.scale.pageAlignHorizontally = true;
  this.game.scale.pageAlignVertically = true;

  // enable crisp rendering
  this.game.stage.smoothed = false;
  this.game.renderer.renderSession.roundPixels = true;  
  Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST; //for WebGL

  // gamepad input
  this.game.input.gamepad.start();

  this.lo = null;
  this.hi = null;
  this.isHigh = false;

  this.patternLoop = null;
  this.currentPattern = null;
  this.patternIndex = 0;

  this.currentLevel = levelIndex !== undefined ? levelIndex : 0;

  this.facing = Constants.Directions.North;
  this.currentX = 0;
  this.currentY = 0;
  this.hasKey = false;
};
View.prototype.preload = function () {
  this.game.load.audio('hi', 'asset/sfx/hi.wav');
  this.game.load.audio('lo', 'asset/sfx/lo.wav');
};
View.prototype.create = function () {
  this.lo = this.game.add.sound('lo', 0, true);
  this.lo.play();

  this.hi = this.game.add.sound('hi', 0, true);
  this.hi.play();

  this.setView(false);

  for (var i = 0; i < Maps[this.currentLevel].data.length; i++) {
    for (var j = 0; j < Maps[this.currentLevel].data[i].length; j++) {
      if (Maps[this.currentLevel].data[i][j] === "st") {
        this.currentX = j;
        this.currentY = i;
      }
    }
  }
  this.facing = Constants.Directions.North;

  var forwardKey = this.game.input.keyboard.addKey(Phaser.KeyCode.UP);
  forwardKey.onDown.add(function () {
    this.stepForward();
  }, this);
  var backwardKey = this.game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
  backwardKey.onDown.add(function () {
    this.stepBackward();
  }, this);
  var rightKey = this.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
  rightKey.onDown.add(function () {
    this.turn(1);
    this.showFacingObject();
  }, this);
  var leftKey = this.game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
  leftKey.onDown.add(function () {
    this.turn(-1);
    this.showFacingObject();
  }, this);

  this.showFacingObject();
};
View.prototype.shutdown = function () {
  this.lo.destroy();
  this.hi.destroy();

  this.game.input.keyboard.removeKey(Phaser.KeyCode.UP);
};
View.prototype.setView = function (isHigh) {
  this.isHigh = isHigh;

  this.game.stage.backgroundColor = isHigh ? Constants.HiColor : Constants.LoColor;

  this.hi.volume = isHigh ? Constants.NoteVolume : 0;
  this.lo.volume = isHigh ? 0 : Constants.NoteVolume;
};
View.prototype.playPattern = function (key) {
  if (this.patternLoop) {
    this.game.time.events.remove(this.patternLoop);
    this.patternLoop = null;
    this.currentPattern = null;
  }

  this.currentPattern = Patterns[key];
  this.patternIndex = 0;
  this.setView(this.currentPattern[this.patternIndex]);

  this.patternLoop = this.game.time.events.loop(Constants.NoteLength, function () {
    this.patternIndex = (this.patternIndex + 1) % this.currentPattern.length;
    this.setView(this.currentPattern[this.patternIndex]);
  }, this);
};
View.prototype.getFacingForwardMapKey = function () {
  var targetX = this.currentX;
  var targetY = this.currentY;

  switch (this.facing) {
    case Constants.Directions.North:
    targetY--;
    break;
    case Constants.Directions.East:
    targetX++;
    break;
    case Constants.Directions.South:
    targetY++;
    break;
    case Constants.Directions.West:
    targetX--;
    break;
  }

  return Maps[this.currentLevel].data[targetY][targetX];
};
View.prototype.showFacingObject = function () {
  // don't play the key pattern if we're holding the key
  if (this.getFacingForwardMapKey() === 'ke' && this.hasKey === true) {
    this.playPattern('open');
  } else {
    this.playPattern(MapKeyToPattern[this.getFacingForwardMapKey()]);
  }
};
View.prototype.stepForward = function () {
  var targetX = this.currentX;
  var targetY = this.currentY;

  switch (this.facing) {
    case Constants.Directions.North:
    targetY--;
    break;
    case Constants.Directions.East:
    targetX++;
    break;
    case Constants.Directions.South:
    targetY++;
    break;
    case Constants.Directions.West:
    targetX--;
    break;
  }

  if (!(Maps[this.currentLevel].data[targetY][targetX] === "wa" || (Maps[this.currentLevel].data[targetY][targetX] === "lo" && this.hasKey === false))) {
    this.currentX = targetX;
    this.currentY = targetY;

    this.showFacingObject();
  } else {
    return;
  }

  if (Maps[this.currentLevel].data[targetY][targetX] === "ke" && this.hasKey === false) {
    this.hasKey = true;
  }

  if (Maps[this.currentLevel].data[targetY][targetX] === "gl") {
    this.game.state.start('View', true, false, (this.currentLevel + 1) % Maps.length);
  }
};
View.prototype.stepBackward = function () {
  var targetX = this.currentX;
  var targetY = this.currentY;

  switch (this.facing) {
    case Constants.Directions.North:
    targetY++;
    break;
    case Constants.Directions.East:
    targetX--;
    break;
    case Constants.Directions.South:
    targetY--;
    break;
    case Constants.Directions.West:
    targetX++;
    break;
  }

  if (!(Maps[this.currentLevel].data[targetY][targetX] === "wa" || (Maps[this.currentLevel].data[targetY][targetX] === "lo" && this.hasKey === false))) {
    this.currentX = targetX;
    this.currentY = targetY;
    
    this.showFacingObject();
  } else {
    return;
  }

  if (Maps[this.currentLevel].data[targetY][targetX] === "ke" && this.hasKey === false) {
    this.hasKey = true;
  }

  if (Maps[this.currentLevel].data[targetY][targetX] === "gl") {
    this.game.state.start('View', true, false, (this.currentLevel + 1) % Maps.length);
  }
};
View.prototype.turn = function (angles) {
  this.facing = (this.facing + angles + 4) % 4;
};

// debug map exploration
/*
View.prototype.render = function () {
  for (var i = 0; i < Maps[this.currentLevel].data.length; i++) {
    for (var j = 0; j < Maps[this.currentLevel].data[i].length; j++) {
      if (Maps[this.currentLevel].data[i][j] === "wa") {
        this.game.debug.geom(new Phaser.Rectangle(j * 3, i * 3, 3, 3));
      } else if (Maps[this.currentLevel].data[i][j] === "gl") {
        this.game.debug.geom(new Phaser.Rectangle(j * 3, i * 3, 3, 3), 'pink');
      } else if (Maps[this.currentLevel].data[i][j] === "lo") {
        this.game.debug.geom(new Phaser.Rectangle(j * 3, i * 3, 3, 3), 'green');
      } else if (Maps[this.currentLevel].data[i][j] === "ke" && this.hasKey === false) {
        this.game.debug.geom(new Phaser.Rectangle(j * 3, i * 3, 3, 3), 'light green');
      }
    }
  }

  this.game.debug.geom(new Phaser.Rectangle(this.currentX * 3, this.currentY * 3, 3, 3), 'red');
  switch (this.facing) {
    case Constants.Directions.North:
    this.game.debug.geom(new Phaser.Rectangle(this.currentX * 3 + 1, this.currentY * 3, 1, 1), 'blue');
    break;
    case Constants.Directions.East:
    this.game.debug.geom(new Phaser.Rectangle(this.currentX * 3 + 2, this.currentY * 3 + 1, 1, 1), 'blue');
    break;
    case Constants.Directions.South:
    this.game.debug.geom(new Phaser.Rectangle(this.currentX * 3 + 1, this.currentY * 3 + 2, 1, 1), 'blue');
    break;
    case Constants.Directions.West:
    this.game.debug.geom(new Phaser.Rectangle(this.currentX * 3, this.currentY * 3 + 1, 1, 1), 'blue');
    break;
  }
};
*/

var main = function () {
  var game = new Phaser.Game(32, 32);
  game.state.add('View', View, false);
  game.state.start('View', true, false, 4);
};


