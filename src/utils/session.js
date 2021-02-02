const get = (key, root = false) => {
  let value = localStorage.getItem("pf");
  if (!value) {
    return null;
  }
  try {
    value = JSON.parse(value);
    return root ? value : value[key];
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

const set = (key, value) => {
  let pf = get("pf", true);
  pf = pf ? pf : {};
  pf[key] = value;
  pf = JSON.stringify(pf);
  localStorage.setItem("pf", pf);
  return true;
};

const remove = key => {
  let pf = get("pf", true);
  delete pf[key];
  pf = JSON.stringify(pf);
  localStorage.setItem("pf", pf);
  return true;
};

const clear = () => {
  localStorage.removeItem("pf");
  return true;
};

export { get, set, remove, clear };
