export const removeHtmlExtension = (path: string): string => {
  const url = new URL(`http://localhost${path}`);
  const basePath = url.pathname.replace(/\.html$/, "");

  const searchParams = url.searchParams.toString();
  const query = searchParams ? `?${searchParams}` : "";

  return `${basePath}${query}${url.hash}`;
};
