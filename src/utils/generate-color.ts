const LOOP_OFFSET = 3;
const MantineColors = [
  'red',
  'indigo',
  'orange',
  'lime',
  'grape',
  'cyan',
  'yellow',
  'green',
  'violet',
  'pink',
  'teal',
];

export const generateColor = (index: number) => {
  const loopNumber = Math.floor(index / MantineColors.length) + LOOP_OFFSET;
  const colorIndex = index % MantineColors.length;

  return loopNumber > LOOP_OFFSET
    ? `${MantineColors[colorIndex]}.${loopNumber}`
    : MantineColors[colorIndex];
};
