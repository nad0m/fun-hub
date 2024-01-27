export const isString = (data: any) => typeof data === 'string';

export const isNonEmptyString = (data: any) =>
  isString(data) && data.length > 0;

export const isObject = (data: any) => {
  if (!data || data === null || Array.isArray(data)) return false;
  return typeof data === 'object';
};

export const isNonEmptyObject = (data: any) =>
  isObject(data) && Object.keys(data).length > 0;

export const validatePlayerData = (data: any) => {
  if (!isNonEmptyObject(data)) return false;
  return (
    isNonEmptyString(data.playerID) && isNonEmptyString(data.playerCredentials)
  );
};
