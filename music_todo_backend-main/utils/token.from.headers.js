export const extractAccessTokenFromHeaders = (authorization) => {
  const splittedValue = authorization.split(" ");

  const token = splittedValue[1];

  return token;
};
