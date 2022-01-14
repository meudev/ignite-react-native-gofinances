import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

import { useAuth } from '../hooks/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Routes() {
    const { user } = useAuth();
    console.log(user)

    return (
        <NavigationContainer>
            {user.id ? <AppRoutes /> : <AuthRoutes /> }
        </NavigationContainer>
    )
}