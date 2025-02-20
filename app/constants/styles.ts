export const BOARD_MAX_WIDTHS: Record<number, Record<number | 'all', string>> = {
  1: {
    1: 'max-w-[100px]',
    2: 'max-w-[250px]',
    3: 'max-w-[400px]',
    'all': 'max-w-[600px]'
  },
  2: {
    1: 'max-w-[200px]',
    2: 'max-w-[400px]',
    3: 'max-w-[550px]',
    'all': 'max-w-[800px]'
  },
  3: {
    1: 'max-w-[300px]',
    2: 'max-w-[400px]',
    3: 'max-w-[600px]',
    'all': 'max-w-[900px]'
  }
}; 