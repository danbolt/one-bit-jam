var BeginLevel = function () {
  this.lo = null;
  this.hi = null;
  this.isHigh = false;

  this.patternLoop = null
  this.currentPattern = null;
};
BeginLevel.prototype.init = function (levelIndex) {

  this.lo = null;
  this.hi = null;
  this.isHigh = false;

  this.patternLoop = null;
  this.currentPattern = null;
  this.patternIndex = 0;

  this.levelIndex = levelIndex; // this is passed onto the gameplay state
};
BeginLevel.prototype.create = function () {
  this.lo = this.game.add.sound('lo', 0, true);
  this.lo.play();

  this.hi = this.game.add.sound('hi', 0, true);
  this.hi.play();

  var patternToPlay = this.levelIndex === 0 ? 'startJingle' : 'nextJingle';
  this.playPattern(patternToPlay);
  this.game.time.events.add(Constants.NoteLength * Patterns[patternToPlay].length, function () {
    this.game.state.start('Gameplay', true, false, this.levelIndex);
  }, this);
};
BeginLevel.prototype.shutdown = function () {
  this.lo.destroy();
  this.hi.destroy();

  this.game.input.keyboard.removeKey(Phaser.KeyCode.UP);
};
BeginLevel.prototype.setView = function (isHigh) {
  this.isHigh = isHigh;

  this.game.stage.backgroundColor = isHigh ? Constants.HiColor : Constants.LoColor;

  this.hi.volume = isHigh ? Constants.NoteVolume : 0;
  this.lo.volume = isHigh ? 0 : Constants.NoteVolume;
};
BeginLevel.prototype.playPattern = function (key) {
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