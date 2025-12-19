export const emailIsValid = (s: string) => /\S+@\S+\.\S+/.test(s);
export const phoneIsValid = (s: string) => /^\+?\d{7,15}$/.test(s);
export const cardNumberIsValid = (s: string) => /^\d{12,19}$/.test(s.replace(/\s+/g, ""));
export const expiryIsValid = (s: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(s);
export const cvvIsValid = (s: string) => /^\d{3,4}$/.test(s);
