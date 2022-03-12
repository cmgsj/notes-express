const getCompareFunction = (order) => {
  switch (order) {
    case 'last-edited-first':
      return (a, b) =>
        -(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    case 'first-edited-first':
      return (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    case 'last-created-first':
      return (a, b) =>
        -(new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'first-created-first':
      return (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    default:
      return (a, b) => 0;
  }
};

export default getCompareFunction;
