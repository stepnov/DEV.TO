export const darkModeKey = 'darkMode'

export const styleKey = 'style'
export const hostApi = process.env.NODE_ENV === 'development' ? 'http://localhost' : '';
export const portApi = process.env.NODE_ENV === 'development' ? 8080 : '';
export const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}/api`;
export const redirectUrl = process.env.NODE_ENV === 'http://localhost:3000/verify-email';
