export const getPagination = (page, size) => {
  const limit = size ? +size : 1;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;

  return { from, to };
};
