export const formatIdCodeToDate = (idCode) => {
  const code = idCode.toString();
  const yearCode = code.substring(0, 1);
  const day = code.substring(5, 7);
  const month = code.substring(3, 5);
  const yearEnd = code.substring(1, 3);
  let yearStart;

  switch (yearCode) {
    case '1':
    case '2':
      yearStart = '18';
      break;
    case '3':
    case '4':
      yearStart = '19';
      break;
    case '5':
    case '6':
      yearStart = '20';
      break;
    case '7':
    case '8':
      yearStart = '21';
      break;
    default:
      yearStart = '19';
      break;
  }

  return new Date(yearStart + yearEnd, month - 1, day, 0, 0, 0, 0);
};
