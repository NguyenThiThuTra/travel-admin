export function flagPathname(params, pathname) {
  let flag = false;
  params.forEach((path) => {
    if (pathname.includes(path)) {
      flag = true;
    }
  });
  return flag;
}
