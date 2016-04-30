var Constants = {
  NoteLength: 200,

  NoteVolume: 0.1,

  Directions: {
    East: 0,
    West: 2,
    South: 1,
    North: 3
  },

  LoColor: 0x0D355E,
  HiColor: 0x90D5F0,
};

var Patterns = {
  wall: [0],
  open: [1],
  a: [0, 1],
  b: [0, 0, 1, 1, 0, 0],
  bp: [1, 1, 0, 0, 1, 1],
  c: [0, 1, 0, 0, 1, 1],
};

var MapKeyToPattern = {};
MapKeyToPattern['wa'] = 'wall';
MapKeyToPattern[0] = 'open';

var Maps = [
{
  data: [['wa', 'wa', 'wa', "wa"],
         ["wa",   0,     0, "wa"],
         ["wa", "st",  "wa", "wa"],
         ["wa", "wa", "wa", "wa"],
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
};
View.prototype.init = function () {
  // game scaling
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.game.scale.refresh();
  this.game.scale.pageAlignHorizontally = true;
  this.game.scale.pageAlignVertically = true;

  // gamepad input
  this.game.input.gamepad.start();

  this.lo = null;
  this.hi = null;
  this.isHigh = false;

  this.patternLoop = null;
  this.currentPattern = null;
  this.patternIndex = 0;

  this.facing = Constants.Directions.North;
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
  this.playPattern('wall');
  this.game.time.events.add(1000, function () { this.playPattern('bp'); }, this);

  this.facing = Constants.Directions.North;
};
View.prototype.shutdown = function () {
  this.lo.destroy();
  this.hi.destroy();
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
var main = function () {
  var game = new Phaser.Game(32, 32);
  game.state.add('View', View, false);
  game.state.start('View');
};
