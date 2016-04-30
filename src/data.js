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
  goal: [0, 1, 1, 0, 0, 1],
  bp: [1, 1, 0, 0, 1, 1],
  c: [0, 1, 0, 0, 1, 1],
  lock: [1, 1, 0, 0, 0, 1],
  key: [0, 1, 0, 0, 1, 0],
  startJingle: [0, 1, 0, 1, 0, 1, 0,],
  nextJingle: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,],
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
         ["wa", "wa",    0, "gl", "wa", "wa", "wa"],
         ["wa",    0,    0, "wa", "wa", "wa", "wa"],
         ["wa", "st", "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa"],
  ],
},
{
  data: [['wa', "wa", 'wa', "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "gl",    0, "wa", "wa"],
         ["wa",    0,    0,    0, "wa",    0, "wa", "wa"],
         ["wa",    0, "wa",    0, "wa",    0, "wa", "wa"],
         ["wa", "st", "wa",    0,    0,    0, "wa", "wa"],
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
{
  data: [['wa', "wa", "wa", 'wa', "wa", "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa",    0, "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa",    0, "lo",    0, "wa"],
         ["wa",    0,    0,    0,    0, "wa",    0, "wa",    0, "wa"],
         ["wa",    0, "wa", "wa",    0,    0,    0, "wa",    0, "wa"],
         ["wa",    0, "wa", "wa",    0, "wa", "wa", "wa", "gl", "wa"],
         ["wa",    0, "ke", "wa",    0, "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "st", "wa", "wa", "wa", "wa", "wa"],
         ["wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa", "wa"],
  ],
},
];