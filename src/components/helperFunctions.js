export const getBirthDateFromIdCode = (idCode) => {
  const code = idCode.toString();
  const yearCode = code.substring(0, 1);
  let year;
  switch (yearCode) {
    case '1':
    case '2':
      year = '18';
      break;
    case '3':
    case '4':
      year = '19';
      break;
    case '5':
    case '6':
      year = '20';
      break;
    default:
      year = '19';
      break;
  }

  return new Date(year + code.substring(1, 3), code.substring(3, 5), code.substring(5, 7), 0, 0, 0, 0);
};

export const formatIdCode = (idCode) => {
  const code = idCode.toString();
  const yearCode = code.substring(0, 1);
  let year;
  switch (yearCode) {
    case '1':
    case '2':
      year = '18';
      break;
    case '3':
    case '4':
      year = '19';
      break;
    case '5':
    case '6':
      year = '20';
      break;
    default:
      year = '19';
      break;
  }

  return code.substring(5, 7) + '.' + code.substring(3, 5) + '.' + year + code.substring(1, 3);
};
