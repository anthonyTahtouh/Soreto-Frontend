export default {
  noEmptySpaces: /^\S*$/g,
  onlyLetterNumberUndescoreAndDash: /^[aA-zZ_0-9.-\s]+$/,
  validUrl:
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
};
