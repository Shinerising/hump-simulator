export const trackData: {
  type: number,
  data: [[number, number], [number, number]],
  id?: string,
  active?: boolean,
  curveData?: {
    curve: Phaser.Curves.CubicBezier,
    points: Phaser.Math.Vector2[],
    tangents: Phaser.Math.Vector2[]
  }
}[] = [
    {
      type: 0,
      data: [[-4, 14], [4, 14]]
    },
    {
      type: 0,
      data: [[-4, 18], [4, 18]]
    },
    {
      type: 1,
      id: 'S01',
      active: true,
      data: [[4, 14], [10, 14]]
    },
    {
      type: 1,
      id: 'S03',
      active: true,
      data: [[10, 14], [16, 14]]
    },
    {
      type: 1,
      id: 'S01',
      active: false,
      data: [[4, 14], [10, 16]]
    },
    {
      type: 1,
      id: 'S03',
      active: false,
      data: [[10, 16], [16, 14]]
    },

    {
      type: 0,
      data: [[16, 14], [22, 10]]
    },
    {
      type: 0,
      data: [[22, 10], [30, 10]]
    },
    {
      type: 1,
      id: 'S05',
      active: true,
      data: [[30, 10], [36, 6]]
    },
    {
      type: 0,
      data: [[36, 6], [46, 6]]
    },

    {
      type: 1,
      id: 'S07',
      active: false,
      data: [[46, 6], [52, 2]]
    },
    {
      type: 0,
      data: [[52, 2], [60, 2]]
    },
    {
      type: 1,
      id: 'S11',
      active: false,
      data: [[60, 2], [66, 0]]
    },
    {
      type: 1,
      id: 'S11',
      active: true,
      data: [[60, 2], [66, 2]]
    },




    {
      type: 1,
      id: 'S07',
      active: true,
      data: [[46, 6], [52, 6]]
    },
    {
      type: 0,
      data: [[52, 6], [60, 6]]
    },
    {
      type: 1,
      id: 'S12',
      active: false,
      data: [[60, 6], [66, 4]]
    },
    {
      type: 1,
      id: 'S12',
      active: true,
      data: [[60, 6], [66, 6]]
    },




    {
      type: 1,
      id: 'S05',
      active: false,
      data: [[30, 10], [36, 13]]
    },
    {
      type: 0,
      data: [[36, 13], [46, 13]]
    },
    {
      type: 1,
      id: 'S08',
      active: false,
      data: [[46, 13], [52, 10]]
    },
    {
      type: 0,
      data: [[52, 10], [60, 10]]
    },
    {
      type: 1,
      id: 'S13',
      active: false,
      data: [[60, 10], [66, 8]]
    },
    {
      type: 1,
      id: 'S13',
      active: true,
      data: [[60, 10], [66, 10]]
    },


    {
      id: 'S08',
      active: true,
      type: 1,
      data: [[46, 13], [52, 14]]
    },
    {
      type: 0,
      data: [[52, 14], [60, 14]]
    },
    {
      type: 1,
      id: 'S14',
      active: false,
      data: [[60, 14], [66, 12]]
    },
    {
      type: 1,
      id: 'S14',
      active: true,
      data: [[60, 14], [66, 14]]
    },


    {
      type: 0,
      data: [[66, 0], [72, 0]]
    },
    {
      type: 0,
      data: [[66, 2], [72, 2]]
    },
    {
      type: 0,
      data: [[66, 4], [72, 4]]
    },
    {
      type: 0,
      data: [[66, 6], [72, 6]]
    },
    {
      type: 0,
      data: [[66, 8], [72, 8]]
    },
    {
      type: 0,
      data: [[66, 10], [72, 10]]
    },
    {
      type: 0,
      data: [[66, 12], [72, 12]]
    },
    {
      type: 0,
      data: [[66, 14], [72, 14]]
    },





    {
      type: 1,
      id: 'S02',
      active: true,
      data: [[4, 18], [10, 18]]
    },
    {
      type: 1,
      id: 'S04',
      active: true,
      data: [[10, 18], [16, 18]]
    },
    {
      type: 1,
      id: 'S02',
      active: false,
      data: [[4, 18], [10, 16]]
    },
    {
      type: 1,
      id: 'S04',
      active: false,
      data: [[10, 16], [16, 18]]
    },



    {
      type: 0,
      data: [[16, 18], [22, 22]]
    },
    {
      type: 0,
      data: [[22, 22], [30, 22]]
    },
    {
      type: 1,
      id: 'S06',
      active: false,
      data: [[30, 22], [36, 19]]
    },
    {
      type: 0,
      data: [[36, 19], [46, 19]]
    },

    {
      type: 1,
      id: 'S09',
      active: true,
      data: [[46, 19], [52, 18]]
    },
    {
      type: 0,
      data: [[52, 18], [60, 18]]
    },
    {
      type: 1,
      id: 'S15',
      active: false,
      data: [[60, 18], [66, 20]]
    },
    {
      type: 1,
      id: 'S15',
      active: true,
      data: [[60, 18], [66, 18]]
    },




    {
      type: 1,
      id: 'S09',
      active: false,
      data: [[46, 19], [52, 22]]
    },
    {
      type: 0,
      data: [[52, 22], [60, 22]]
    },
    {
      type: 1,
      id: 'S16',
      active: true,
      data: [[60, 22], [66, 22]]
    },
    {
      type: 1,
      id: 'S16',
      active: false,
      data: [[60, 22], [66, 24]]
    },




    {
      type: 1,
      id: 'S06',
      active: true,
      data: [[30, 22], [36, 26]]
    },
    {
      type: 0,
      data: [[36, 26], [46, 26]]
    },
    {
      type: 1,
      id: 'S10',
      active: false,
      data: [[46, 26], [52, 30]]
    },
    {
      type: 0,
      data: [[52, 30], [60, 30]]
    },
    {
      type: 1,
      id: 'S18',
      active: true,
      data: [[60, 30], [66, 30]]
    },
    {
      type: 1,
      id: 'S18',
      active: false,
      data: [[60, 30], [66, 32]]
    },


    {
      type: 1,
      id: 'S10',
      active: true,
      data: [[46, 26], [52, 26]]
    },
    {
      type: 0,
      data: [[52, 26], [60, 26]]
    },
    {
      type: 1,
      id: 'S17',
      active: true,
      data: [[60, 26], [66, 26]]
    },
    {
      type: 1,
      id: 'S17',
      active: false,
      data: [[60, 26], [66, 28]]
    },


    {
      type: 0,
      data: [[66, 18], [72, 18]]
    },
    {
      type: 0,
      data: [[66, 20], [72, 20]]
    },
    {
      type: 0,
      data: [[66, 22], [72, 22]]
    },
    {
      type: 0,
      data: [[66, 24], [72, 24]]
    },
    {
      type: 0,
      data: [[66, 26], [72, 26]]
    },
    {
      type: 0,
      data: [[66, 28], [72, 28]]
    },
    {
      type: 0,
      data: [[66, 30], [72, 30]]
    },
    {
      type: 0,
      data: [[66, 32], [72, 32]]
    },
  ];

export const spriteData = [
  {
    id: 'S01',
    connect: 'S04',
    exclude: 'S02',
    type: 0,
    active: false,
    data: [[6.5, 14.5], [6, 3]]
  },
  {
    id: 'S02',
    connect: 'S03',
    exclude: 'S01',
    type: 0,
    active: false,
    data: [[6.5, 17.5], [6, 3]]
  },
  {
    id: 'S03',
    connect: 'S02',
    exclude: 'S01',
    type: 0,
    active: false,
    data: [[12.5, 14.5], [6, 3]]
  },
  {
    id: 'S04',
    connect: 'S01',
    exclude: 'S02',
    type: 0,
    active: false,
    data: [[12.5, 17.5], [6, 3]]
  },
  {
    id: 'S05',
    type: 0,
    active: false,
    data: [[32.5, 9.5], [6, 8]]
  },
  {
    id: 'S06',
    type: 0,
    active: false,
    data: [[32.5, 22.5], [6, 8]]
  },
  {
    id: 'S07',
    type: 0,
    active: false,
    data: [[48.5, 4], [6, 5]]
  },
  {
    id: 'S08',
    type: 0,
    active: false,
    data: [[48.5, 12], [6, 5]]
  },
  {
    id: 'S09',
    type: 0,
    active: false,
    data: [[48.5, 20], [6, 5]]
  },
  {
    id: 'S10',
    type: 0,
    active: false,
    data: [[48.5, 28], [6, 5]]
  },
  {
    id: 'S11',
    type: 0,
    active: false,
    data: [[62.5, 1], [6, 3]]
  },
  {
    id: 'S12',
    type: 0,
    active: false,
    data: [[62.5, 5], [6, 3]]
  },
  {
    id: 'S13',
    type: 0,
    active: false,
    data: [[62.5, 9], [6, 3]]
  },
  {
    id: 'S14',
    type: 0,
    active: false,
    data: [[62.5, 13], [6, 3]]
  },
  {
    id: 'S15',
    type: 0,
    active: false,
    data: [[62.5, 19], [6, 3]]
  },
  {
    id: 'S16',
    type: 0,
    active: false,
    data: [[62.5, 23], [6, 3]]
  },
  {
    id: 'S17',
    type: 0,
    active: false,
    data: [[62.5, 27], [6, 3]]
  },
  {
    id: 'S18',
    type: 0,
    active: false,
    data: [[62.5, 31], [6, 3]]
  },
  {
    id: 'J01',
    type: 1,
    active: false,
    data: [[25, 10], [3, 1]]
  },
  {
    id: 'J02',
    type: 1,
    active: false,
    data: [[25, 22], [3, 1]]
  },
  {
    id: 'J03',
    type: 1,
    active: false,
    data: [[41, 6], [3, 1]]
  },
  {
    id: 'J04',
    type: 1,
    active: false,
    data: [[41, 13], [3, 1]]
  },
  {
    id: 'J05',
    type: 1,
    active: false,
    data: [[41, 19], [3, 1]]
  },
  {
    id: 'J06',
    type: 1,
    active: false,
    data: [[41, 26], [3, 1]]
  },
  {
    id: 'J07',
    type: 1,
    active: false,
    data: [[56, 2], [3, 1]]
  },
  {
    id: 'J08',
    type: 1,
    active: false,
    data: [[56, 6], [3, 1]]
  },
  {
    id: 'J09',
    type: 1,
    active: false,
    data: [[56, 10], [3, 1]]
  },
  {
    id: 'J10',
    type: 1,
    active: false,
    data: [[56, 14], [3, 1]]
  },
  {
    id: 'J11',
    type: 1,
    active: false,
    data: [[56, 18], [3, 1]]
  },
  {
    id: 'J12',
    type: 1,
    active: false,
    data: [[56, 22], [3, 1]]
  },
  {
    id: 'J13',
    type: 1,
    active: false,
    data: [[56, 26], [3, 1]]
  },
  {
    id: 'J14',
    type: 1,
    active: false,
    data: [[56, 30], [3, 1]]
  }
]

export const textList = [{
  text: '01',
  x: 73.5,
  y: -0.5
}, {
  text: '02',
  x: 73.5,
  y: 1.5
}, {
  text: '03',
  x: 73.5,
  y: 3.5
}, {
  text: '04',
  x: 73.5,
  y: 5.5
}, {
  text: '05',
  x: 73.5,
  y: 7.5
}, {
  text: '06',
  x: 73.5,
  y: 9.5
}, {
  text: '07',
  x: 73.5,
  y: 11.5
}, {
  text: '08',
  x: 73.5,
  y: 13.5
}, {
  text: '09',
  x: 73.5,
  y: 17.5
}, {
  text: '10',
  x: 73.5,
  y: 19.5
}, {
  text: '11',
  x: 73.5,
  y: 21.5
}, {
  text: '12',
  x: 73.5,
  y: 23.5
}, {
  text: '13',
  x: 73.5,
  y: 25.5
}, {
  text: '14',
  x: 73.5,
  y: 27.5
}, {
  text: '15',
  x: 73.5,
  y: 29.5
}, {
  text: '16',
  x: 73.5,
  y: 31.5
}];
export const treeData = [
  [
      -1,
      33
  ],
  [
      -1,
      34
  ],
  [
      2,
      33
  ],
  [
      0,
      34
  ],
  [
      5,
      34
  ],
  [
      2,
      35
  ],
  [
      -3,
      35
  ],
  [
      4,
      33
  ],
  [
      5,
      35
  ],
  [
      9,
      33
  ],
  [
      7,
      35
  ],
  [
      9,
      35
  ],
  [
      23,
      35
  ],
  [
      21,
      33
  ],
  [
      25,
      33
  ],
  [
      21,
      34
  ],
  [
      27,
      35
  ],
  [
      26,
      35
  ],
  [
      32,
      34
  ],
  [
      29,
      33
  ],
  [
      31,
      35
  ],
  [
      12,
      30
  ],
  [
      14,
      30
  ],
  [
      17,
      30
  ],
  [
      42,
      35
  ],
  [
      44,
      35
  ],
  [
      47,
      35
  ],
  [
      45,
      34
  ],
  [
      48,
      34
  ],
  [
      47,
      33
  ],
  [
      50,
      35
  ],
  [
      62,
      36
  ],
  [
      64,
      35
  ],
  [
      68,
      35
  ],
  [
      60,
      34
  ],
  [
      72,
      35
  ],
  [
      1,
      -3
  ],
  [
      3,
      -3
  ],
  [
      6,
      -2
  ],
  [
      9,
      -1
  ],
  [
      12,
      0
  ],
  [
      10,
      -3
  ],
  [
      14,
      -1
  ],
  [
      18,
      0
  ],
  [
      11,
      -1
  ],
  [
      17,
      -1
  ],
  [
      26,
      -1
  ],
  [
      29,
      0
  ],
  [
      58,
      -2
  ],
  [
      61,
      -2
  ],
  [
      64,
      -2
  ],
  [
      57,
      -4
  ],
  [
      45,
      -4
  ],
  [
      42,
      -3
  ],
  [
      42,
      -1
  ],
  [
      22,
      -3
  ],
  [
      21,
      0
  ],
  [
      70,
      -2
  ]
];
export const lightData = [
  [
    14,
    11
  ],
  [
    14,
    21
  ],
  [
    45,
    3
  ],
  [
    45,
    29
  ],
  [
    45,
    11
  ],
  [
    45,
    21
  ]
];
export const houseData = [
  [
    1,
    30
  ],
  [
    7,
    30
  ],
  [
    20,
    27
  ],
  [
    24,
    27
  ],
  [
    14,
    34
  ],
  [
    34,
    32
  ],
  [
    40,
    32
  ],
  [
    23,
    2
  ],
  [
    27,
    2
  ],
  [
    49,
    -2
  ],
  [
    52,
    -2
  ],
    [
        53,
        35
    ],
    [
        57,
        35
    ],
    [
        18,
        34
    ],
    [
        36,
        34
    ]
];