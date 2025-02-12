import { useEffect, useState } from "react";
import { PublicRoutes } from "../models/Routes";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../helpers/supabaseClient";

export function AuthGuard() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) {
				//   console.error('Error fetching session:', error);
				setIsAuthenticated(false);
			} else {
				//   console.log('Session data:', data);
				setIsAuthenticated(!!data.session?.access_token);
			}
		};

		checkAuth();
	}, []);

	// Show a loading indicator while checking authentication status
	if (isAuthenticated === null) {
		return <div>Loading...</div>;
	}

	// Render based on authentication status
	return isAuthenticated ? <Outlet /> : <Navigate replace to={PublicRoutes.MESAS} />;
}