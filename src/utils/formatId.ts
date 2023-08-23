export const formatId = (id: string): string => {
  return id.substring(0, 5) + "..." + id.substring(id.length - 3);
};
