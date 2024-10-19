export const getConfig = () => ({
  apiURL: 'http://localhost:5555/',
});

export type AppConfig = ReturnType<typeof getConfig>;