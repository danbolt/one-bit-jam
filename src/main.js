var SetupState = function () {
  //
};
SetupState.prototype.init = function () {
  // gamepad input
  this.game.input.gamepad.start();

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
};
SetupState.prototype.preload = function () {
  this.game.load.audio('hi', 'asset/sfx/hi.wav');
  this.game.load.audio('lo', 'asset/sfx/lo.wav');
};
SetupState.prototype.create = function () {
  this.game.state.start('BeginLevel', true, false, 0);
}


var main = function () {
  var game = new Phaser.Game(32, 32);
  game.state.add('SetupState', SetupState, false);
  game.state.add('BeginLevel', BeginLevel, false);
  game.state.add('Gameplay', Gameplay, false);
  game.state.start('SetupState', true, false);
};


