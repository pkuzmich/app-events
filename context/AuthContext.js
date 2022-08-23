import {createContext, useEffect, useState} from "react";
import {NEXT_URL} from "@/config/index";
import {useRouter} from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	const router = useRouter();

	useEffect(() => {
		checkUserLoggedIn()
	}, []);

	// Register user
	const register = async (user) => {
		const res = await fetch(`${NEXT_URL}/api/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		});
		const data = await res.json();

		if(res.ok) {
			setUser(data.user);

			// After log in, user redirect to Dashboard
			await router.push('/account/dashboard');
		} else {
			setError(data.message);
		}
	};

	// Login user
	const login = async ({ email:identifier, password }) => {
		const res = await fetch(`${NEXT_URL}/api/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				identifier,
				password
			})
		});
		const data = await res.json();

		if(res.ok) {
			setUser(data.user);

			// After log in, user redirect to Dashboard
			await router.push('/account/dashboard');
		} else {
			setError(data.message);
		}
	};

	// Logout user
	const logout= async () => {
		const res = await fetch(`${NEXT_URL}/api/logout`, {
			method: 'POST'
		});

		if(res.ok) {
			setUser(null);
			await router.push('/'); // redirect to Homepage
		}
	};

	// Check if user is logged in
	const checkUserLoggedIn = async (user) => {
		const res = await fetch(`${NEXT_URL}/api/user`);
		const data = await res.json();

		if(res.ok) {
			setUser(data.user);
		} else {
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider value={{ user, error, register, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;