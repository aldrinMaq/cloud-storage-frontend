import {defineStore} from 'pinia';

export const useSessionStore = defineStore({
    id: 'session',
    state: () => ({
        email: undefined as string | undefined,
    }),
    getters: {
        getEmail: (state) => state.email,
    },
    actions: {
        setEmail(newEmail: string) {
            this.email = newEmail;
        },
        clearSession() {
            this.email = undefined;
            localStorage.removeItem('session');
        },
    },
    persist: {
        key: 'my-app-session',
        storage: window.localStorage,
    },
});