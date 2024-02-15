export const validatePassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@''‘'`ʼ"№;:?#$%^&*()_+-=./\|,~{}^<>€£•‘]{8,30}$/.test(
    password,
  );
