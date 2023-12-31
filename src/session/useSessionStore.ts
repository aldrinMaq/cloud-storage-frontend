import {defineStore} from 'pinia';

export const useSessionStore = defineStore('session', {
    state: () => ({
        email: undefined
    }),
    getters: {
        getEmail: (state) => state.email
    },
    actions: {
        setEmail(newEmail) {
            this.email = newEmail;
        },
        clearSession() {
            this.email = undefined;
            // Optionally clear persisted state if used
            localStorage.removeItem('session');
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'my-app-session',
                storage: localStorage, // or sessionStorage
            }
        ]
    }
});
