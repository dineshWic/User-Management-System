import React, {createContext, useState, useContext, useEffect, use} from 'react';
import Keycloak from 'keycloak-js';
import {authService} from  '../services/authService';

const AuthContext = createContext(null);

export const AuthContext = ( {children} ) => {
    const [user, setUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [keycloakInstance, setKeycloakInstance] = useState(null);

    useEffect( () => {
        initKeycloak();
    }, []);

    const initKeycloak = async () => {
        try {
            const authenticated = await Keycloak.init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                pkceMethod: 's256',
            });

            setKeycloakInstance(Keycloak);
            setAuthenticated(authenticated);

            if(authenticated){
                await loadUserProfile();
            }

        } catch (error) {
            console.error('Keycloak initializatio failed: ', error);
        }
        finally{
            setLoading(false);
        }
    };

    const loadUserProfile = async () => {
        try {
        const profile = await keycloak.loadUserProfile();
        const userResponse = await authService.getCurrentUser();
        setUser({
            ...userResponse.data,
            keycloakProfile: profile
        });
        } catch (error) {
        console.error('Failed to load user profile:', error);
        }
    };

    const login = () => {
        keycloak.login();
    };

    const loginWithGoogle = () => {
        keycloak.login({
        idpHint: 'google'
        });
    };

    const logout = async () => {
        try {
        if (keycloak.refreshToken) {
            await authService.logout(keycloak.refreshToken);
        }
        keycloak.logout({
            redirectUri: window.location.origin
        });
        setUser(null);
        setAuthenticated(false);
        } catch (error) {
        console.error('Logout failed:', error);
        }
    };

    const register = async (userData) => {
        try {
        const response = await authService.register(userData);
        // After registration, Keycloak tokens are returned
        keycloak.token = response.data.accessToken;
        keycloak.refreshToken = response.data.refreshToken;
        setAuthenticated(true);
        await loadUserProfile();
        return response;
        } catch (error) {
        throw error;
        }
    };

    const hasRole = (role) => {
        return keycloak.hasRealmRole(role);
    };

    const getToken = () => {
        return keycloak.token;
    };

    const updateToken = async () => {
        try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
            return keycloak.token;
        }
        } catch (error) {
        console.error('Failed to refresh token:', error);
        logout();
        }
    };

    const value = {
        user,
        authenticated,
        loading,
        keycloak: keycloakInstance,
        login,
        loginWithGoogle,
        register,
        hasRole,
        getToken,
        updateToken
    };

    return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>;
};

export const useAuth =  () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be within AuthProvider');
    }
    return context;
}