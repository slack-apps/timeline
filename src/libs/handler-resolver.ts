export const handlerPath = (context: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`
};
