export type IceCreamInfo = {
  story: string;
  award?: { label: string; image: string };
  contains: string[];
  dietary: string[];
};

export const iceCreamRangeCopy = {
  title: 'Luxury ice cream, made in the Lakes.',
  paragraphs: [
    'The range is made by Lakes Ice Cream using whole milk, double cream and butter, with fruit, sauces, biscuits and other inclusions chosen for each flavour.',
    'We select and scoop the flavours here at Lakeside Picnic in Waterhead. Several recipes have received Great Taste awards; availability can vary from day to day.',
  ],
};

export const iceCreamInfo: Record<string, IceCreamInfo> = {
  jersey: {
    story: 'A deeply creamy, beautifully simple ice cream made with whole milk, Jersey double cream and butter, without added flavourings or colourings.',
    award: { label: 'Great Taste 2-Star Award · 2019', image: '/Icecream/2019-2star.png' },
    contains: ['Milk'],
    dietary: ['Vegetarian', 'Gluten free'],
  },
  thunder: {
    story: 'Creamy dairy ice cream rippled with chocolate sauce and pieces of crunchy cinder toffee. The name was inspired during a Kendal thunderstorm, and it became one of the maker’s most popular flavours.',
    award: { label: 'Great Taste 1-Star Award · 2019', image: '/Icecream/2019-1star.png' },
    contains: ['Milk', 'Soya'],
    dietary: ['Vegetarian', 'Gluten free'],
  },
  raspberry: {
    story: 'Creamy dairy ice cream with raspberry fruit and pieces of real meringue, bringing together tart berry flavour and a sweet pavlova finish.',
    award: { label: 'Great Taste 1-Star Award · 2019', image: '/Icecream/2019-1star.png' },
    contains: ['Milk', 'Egg'],
    dietary: ['Vegetarian'],
  },
  sticky: {
    story: 'A Lake District collaboration made with Cartmel sticky toffee sauce and pudding crumb folded through creamy dairy ice cream.',
    award: { label: 'Great Taste 1-Star Award · 2021', image: '/Icecream/2021-1star.png' },
    contains: ['Milk', 'Wheat', 'Egg'],
    dietary: ['Vegetarian'],
  },
  blackcurrant: {
    story: 'Local milk and cream meet blackcurrants and a tangy fruit sauce in this rich, bright flavour, made without added colourings or flavourings.',
    award: { label: 'Great Taste 2-Star Award · 2023', image: '/Icecream/2023-2star.png' },
    contains: ['Milk'],
    dietary: ['Vegetarian', 'Gluten free'],
  },
  crushed: {
    story: 'Fresh milk and double cream blended with real strawberry juice and crushed strawberries for a rounded, fruity scoop.',
    award: { label: 'Great Taste 1-Star Award · 2023', image: '/Icecream/2023-1star.png' },
    contains: ['Milk'],
    dietary: ['Vegetarian', 'Gluten free'],
  },
  biscoff: {
    story: 'Creamy dairy ice cream made with Lotus Biscoff spread and caramelised biscuit for a warmly spiced, biscuity finish.',
    award: { label: 'Great Taste 1-Star Award · 2021', image: '/Icecream/2021-1star.png' },
    contains: ['Milk', 'Wheat / gluten', 'Soya'],
    dietary: ['Vegetarian'],
  },
  rum: {
    story: 'Fresh milk and double cream with rum and Californian raisins. The recipe contains 1.5% rum and 7.8% raisins.',
    award: { label: 'Great Taste 1-Star Award · 2023', image: '/Icecream/2023-1star.png' },
    contains: ['Milk', 'Alcohol'],
    dietary: ['Vegetarian', 'Gluten free'],
  },
  mint: {
    story: 'A delicately minted dairy ice cream with natural colouring and pieces of Belgian chocolate.',
    contains: ['Milk', 'Soya'],
    dietary: ['Vegetarian', 'Gluten free'],
  },
  choc: {
    story: 'A full chocolate flavour made with cocoa and a dark chocolate sauce folded through creamy dairy ice cream.',
    contains: ['Milk', 'Soya'],
    dietary: ['Vegetarian'],
  },
  cookies: {
    story: 'A cookies-and-cream favourite: vanilla dairy ice cream generously mixed with Oreo biscuit pieces.',
    contains: ['Milk', 'Wheat', 'Soya'],
    dietary: ['Vegetarian'],
  },
  pistachio: {
    story: 'Silky dairy ice cream made with pistachio paste for a smooth, rounded nut flavour.',
    contains: ['Pistachio nuts', 'Almonds', 'Milk', 'Soya'],
    dietary: ['Vegetarian', 'Gluten free'],
  },
};

export function nutritionRows(value: string) {
  const match = value.match(/^Energy (.+?) Fat (.+?) of which saturates (.+?) Carbohydrates (.+?) of which sugars (.+?) Protein (.+?) Fibre (.+?) Salt (.+)$/i);
  if (!match) return [];
  const [, energy, fat, saturates, carbohydrates, sugars, protein, fibre, salt] = match;
  return [
    ['Energy', energy],
    ['Fat', fat],
    ['of which saturates', saturates],
    ['Carbohydrates', carbohydrates],
    ['of which sugars', sugars],
    ['Protein', protein],
    ['Fibre', fibre],
    ['Salt', salt],
  ];
}
