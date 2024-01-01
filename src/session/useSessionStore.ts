import {defineStore} from 'pinia';

export const useSessionStore = defineStore({
    id: 'session',
    state: () => ({
        email: undefined as string | undefined,
        username: undefined as string | undefined, // Add a username field
    }),
    getters: {
        getEmail: (state) => state.email,
        getUsername: (state) => state.username, // Add a getter for the username
    },
    actions: {
        setEmail(newEmail: string) {
            this.email = newEmail;
        },
        setUsername(newUsername: string) {
            this.username = newUsername; // Add a method to set the username
        },
        clearSession() {
            this.email = undefined;
            this.username = undefined; // Clear the username as well
            localStorage.removeItem('session');
        },
    },
    persist: {
        key: 'my-app-session',
        storage: window.localStorage,
    },
});