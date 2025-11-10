import { authService } from "../bootstrap.js";

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000,
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

export const signup = async (req, res) => {
	try {
		const { user, tokens } = await authService.signup(req.body);

		setCookies(res, tokens.accessToken, tokens.refreshToken);

		res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { user, tokens } = await authService.login(req.body);

		setCookies(res, tokens.accessToken, tokens.refreshToken);

		res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		await authService.logout(refreshToken);

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const refreshTokenCookie = req.cookies.refreshToken;
		const accessToken = await authService.refreshAccessToken(refreshTokenCookie);

		setCookies(res, accessToken, refreshTokenCookie); // refreshTokenCookie kept same

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(error.status || 500).json({ message: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		const user = await authService.getProfile(req.user._id);
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
