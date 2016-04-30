var main = function () {
  var game = new Phaser.Game(32, 32);
  game.state.add('Gameplay', Gameplay, false);
  game.state.start('Gameplay', true, false, 0);
};


