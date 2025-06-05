const TOKEN_KEY = "token";

//Get the jwt token 
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

//Save the jwt token 
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

//Remove the jwt token 
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};
