const getCompareFunction = (order) => {
  switch (order) {
    case 'newest-edited':
      return (a, b) =>
        -(new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    case 'oldest-edited':
      return (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    case 'newest-created':
      return (a, b) =>
        -(new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'oldest-created':
      return (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    default:
      return (a, b) => 0;
  }
};

export default getCompareFunction;
