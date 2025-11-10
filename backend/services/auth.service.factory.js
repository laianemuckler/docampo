import jwt from "jsonwebtoken";

export function createAuthService({ userRepo, tokenRepo, jwtLib = jwt }) {
  const generateTokens = (userId) => {
    const accessToken = jwtLib.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwtLib.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  };

  const signup = async ({ name, email, password, document, address }) => {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      const err = new Error("User already exists");
      err.status = 400;
      throw err;
    }

    const user = await userRepo.createUser({ name, email, password, document, address });
    const tokens = generateTokens(user._id);
    await tokenRepo.setRefreshToken(user._id, tokens.refreshToken);

    return { user, tokens };
  };

  const login = async ({ email, password }) => {
    const user = await userRepo.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      const err = new Error("Invalid email or password");
      err.status = 400;
      throw err;
    }

    const tokens = generateTokens(user._id);
    await tokenRepo.setRefreshToken(user._id, tokens.refreshToken);

    return { user, tokens };
  };

  const logout = async (refreshToken) => {
    if (!refreshToken) return;
    const decoded = jwtLib.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await tokenRepo.deleteRefreshToken(decoded.userId);
  };

  const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
      const err = new Error("No refresh token provided");
      err.status = 401;
      throw err;
    }

    const decoded = jwtLib.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const stored = await tokenRepo.getRefreshToken(decoded.userId);

    if (stored !== refreshToken) {
      const err = new Error("Invalid refresh token");
      err.status = 401;
      throw err;
    }

    const accessToken = jwtLib.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    return accessToken;
  };

  const getProfile = async (userId) => {
    return userRepo.findById(userId);
  };

  return { signup, login, logout, refreshAccessToken, getProfile };
}
