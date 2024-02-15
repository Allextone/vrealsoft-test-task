export const validateEmail = (email: string) => {
  if (email) {
    return email.toLowerCase().trim();
  }

  return undefined;
};
