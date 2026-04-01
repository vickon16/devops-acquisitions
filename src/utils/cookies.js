export const cookiesObj = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  }),

  setCookie: (res, name, value, options = {}) => {
    res.cookie(name, value, { ...cookiesObj.getOptions(), ...options });
  },

  clearCookie: (res, name, options = {}) => {
    res.clearCookie(name, { ...cookiesObj.getOptions(), ...options });
  },

  getCookie: (req, name) => {
    return req.cookies[name];
  },
};
