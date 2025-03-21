import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
      (set) => {
        let inputElement = null;
  
        return {
          setInputRef: (ref) => {
            inputElement = ref;
          },
          focusInput: () => {
            if (inputElement) inputElement.focus();
          },
  
          userData: null,
          setUserData: (_data) => set(() => ({ userData: _data })),
  
          isLoggedIn: false,
          setLoggedIn: () => set((state) => ({ isLoggedIn: !state.isLoggedIn })),
  
          walletAddress: null,
          setWalletAddress: (add) => set(() => ({ walletAddress: add })),
  
          selectedPanelOption: "dashboard",
          setSelectedPanelOption: (option) => set(() => ({ selectedPanelOption: option })),
  
          preferences: {
            currency: "$",
            lang: "eng",
          },
          setPreferences: (_preferences) =>
            set((state) => ({
              preferences: { ...state.preferences, ..._preferences },
            })),
        };
      },
      { name: "app-store" }
    )
);

export const useErrorStore = create(
    persist(
        (set)=>({
            error: { show: false, title: null, message: null, type: null },
            setError: (show, title, message, type) => {
                set(() => ({ error: { show, title, message, type } }));
                setTimeout(() => {
                    set(() => ({ error: { show: false, title: null, message: null, type: null } }));
                }, 5000);
            },
        }),
        {
            name: 'error-store'
        }
    )
);