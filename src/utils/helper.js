const isMd5 = str => {
  return /[a-fA-F0-9]{32}/.test(str);
};

export { isMd5 };
