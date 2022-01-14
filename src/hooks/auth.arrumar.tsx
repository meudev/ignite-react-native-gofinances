import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { AuthProvider, useAuth } from './auth';
import * as mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { logInAsync } from 'expo-google-app-auth';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('expo-google-app-session');

describe('Auth Hook', () => {

    
    it('should be able to sign in with Google account existing', async () => {
        const googleMocked = mocked(logInAsync as any);
        googleMocked.mockReturnValueOnce({
            type: 'success',
            user: {
                id: 'any_id',
                email: 'adrian@meudev.com',
                name: 'Adrian',
                photo: 'any_photo.png'
            }
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user.email).toBe('adrian@meudev.com');
    });

    it('user should not connect if cancel authentication with Google', async () => {
        const googleMocked = mocked(logInAsync as any);
        googleMocked.mockReturnValueOnce({
            type: 'cancel'
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(() => result.current.signInWithGoogle());

        expect(result.current.user).not.toHaveProperty('id');
    });
    
    it('should be error with  incorrectly Google parameters', async () => {

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        try{
            await act(() => result.current.signInWithGoogle());
        }catch{
            expect(result.current.user).toEqual({});
        }

    });
});
