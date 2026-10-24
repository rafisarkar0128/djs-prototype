/**
 * @file Enterprise Color Palette & Design Tokens
 */

const baseColors = {
  // Brand & Architecture Identity (From Banner & Logo)
  BrandPurple: '#7082FF',
  BrandCyan: '#00F0FF',
  BrandDark: '#0D1117',
  BrandBorder: '#1F2937',

  // System & Lifecycle Semantics
  Success: '#2ECC71',
  Warning: '#F1C40F',
  Error: '#ED4245',
  Info: '#5865F2',
  Pending: '#E67E22',
  Debug: '#9B59B6',

  // Red & Warm
  LightCoral: '#F08080',
  Salmon: '#FA8072',
  DarkSalmon: '#E9967A',
  LightSalmon: '#FFA07A',
  Crimson: '#DC143C',
  Red: '#FF0000',
  FireBrick: '#B22222',
  DarkRed: '#8B0000',
  AmericanRose: '#FF033E',

  // Pink & Rose
  Pink: '#FFC0CB',
  LightPink: '#FFB6C1',
  HotPink: '#FF69B4',
  DeepPink: '#FF1493',

  // Orange & Amber
  Coral: '#FF7F50',
  OrangeRed: '#FF4500',
  DarkOrange: '#FF8C00',
  Orange: '#FFA500',

  // Yellow & Gold
  Gold: '#FFD700',
  Yellow: '#FFFF00',
  LightYellow: '#FFFFE0',
  PapayaWhip: '#FFEFD5',
  Moccasin: '#FFE4B5',
  PeachPuff: '#FFDAB9',
  PaleGoldenrod: '#EEE8AA',
  Khaki: '#F0E68C',

  // Purple & Violet
  Lavender: '#E6E6FA',
  Plum: '#DDA0DD',
  Violet: '#EE82EE',
  Orchid: '#DA70D6',
  Magenta: '#FF00FF',
  BlueViolet: '#8A2BE2',
  DarkViolet: '#9400D3',
  Purple: '#800080',
  Indigo: '#4B0082',
  SlateBlue: '#6A5ACD',
  DarkSlateBlue: '#483D8B',

  // Green & Mint
  GreenYellow: '#ADFF2F',
  LawnGreen: '#7CFC00',
  Lime: '#00FF00',
  LimeGreen: '#32CD32',
  PaleGreen: '#98FB98',
  LightGreen: '#90EE90',
  AndroidGreen: '#32DE84',
  MediumSpringGreen: '#00FA9A',
  SpringGreen: '#00FF7F',
  SeaGreen: '#2E8B57',
  ForestGreen: '#228B22',
  Green: '#008000',
  DarkGreen: '#006400',
  YellowGreen: '#9ACD32',
  Olive: '#808000',
  MediumAquamarine: '#66CDAA',
  LightSeaGreen: '#20B2AA',
  DarkCyan: '#008B8B',

  // Blue & Cyan
  Aqua: '#00FFFF',
  Cyan: '#00FFFF',
  LightCyan: '#E0FFFF',
  Aquamarine: '#7FFFD4',
  Turquoise: '#40E0D0',
  DarkTurquoise: '#00CED1',
  SteelBlue: '#4682B4',
  PowderBlue: '#B0E0E6',
  LightBlue: '#ADD8E6',
  SkyBlue: '#87CEEB',
  LightSkyBlue: '#87CEFA',
  DeepSkyBlue: '#00BFFF',
  DodgerBlue: '#1E90FF',
  CornflowerBlue: '#6495ED',
  RoyalBlue: '#4169E1',
  Blue: '#0000FF',
  DarkBlue: '#00008B',
  Navy: '#000080',
  MidnightBlue: '#191970',

  // Earth & Brown
  Cornsilk: '#FFF8DC',
  Bisque: '#FFE4C4',
  Wheat: '#F5DEB3',
  BurlyWood: '#DEB887',
  SandyBrown: '#F4A460',
  Chocolate: '#D2691E',
  Brown: '#A52A2A',
  Maroon: '#800000',

  // White & Light Grayscale
  White: '#FFFFFF',
  Snow: '#FFFAFA',
  HoneyDew: '#F0FFF0',
  MintCream: '#F5FFFA',
  Azure: '#F0FFFF',
  WhiteSmoke: '#F5F5F5',
  SeaShell: '#FFF5EE',
  FloralWhite: '#FFFAF0',
  LavenderBlush: '#FFF0F5',
  MistyRose: '#FFE4E1',

  // Gray & Dark Grayscale
  LightGray: '#D3D3D3',
  Silver: '#C0C0C0',
  DarkGray: '#A9A9A9',
  Gray: '#808080',
  DimGray: '#696969',
  LightSlateGray: '#778899',
  SlateGray: '#708090',
  DarkSlateGray: '#2F4F4F',
  Black: '#000000',

  // Discord Official UI
  Blurple: '#5865F2',
  OldBlurple: '#7289DA',
  DarkBackground: '#313338',
  Transparent: '#2B2D31',
};

const hexValues = Object.values(baseColors);

export const colors = Object.freeze({
  ...baseColors,

  /**
   * Returns a random hex color string from the palette.
   * @returns {string} Hex color string (e.g. '#7082FF')
   */
  getRandom() {
    return hexValues[Math.floor(Math.random() * hexValues.length)];
  },

  /**
   * Converts any hex color in this palette (or custom hex) to a 24-bit integer
   * directly consumable by Discord.js `embed.setColor(...)`.
   * @param {keyof typeof baseColors | string} color Key or Hex string
   * @returns {number} 24-bit numeric integer
   * @example
   * colors.toInt('BrandCyan'); // 61695
   * colors.toInt('#ED4245');   // 15549061
   */
  toInt(color) {
    const raw = baseColors[color] ?? color;
    return Number.parseInt(raw.replace(/^#/, ''), 16);
  },

  /**
   * Generates a completely random 24-bit integer color for embeds.
   * @returns {number}
   */
  getRandomInt() {
    return Math.floor(Math.random() * 0xffffff);
  },
});

export default colors;
