export const reducer = (categories, router) =>
  categories.reduce((acc, v) => {
    const key = v.path[0];
    if (!acc[key]) acc[key] = { children: [] };
    const obj = acc[key];
    if (v.path.indexOf(router.query.category) >= 0) obj.open = true;
    if (v.path.length === 1) {
      obj.name = v.name;
      obj.slug = v.slug;
      obj.order = v.order;
    } else obj.children.push({ ...v, path: v.path.slice(1) });
    return acc;
  }, {});

export default reducer;
