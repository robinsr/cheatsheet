import { createContext, useContext } from 'react';

export const KeyContext = createContext();
export const Provider = KeyContext.Provider;

export function useKeys() {
    return useContext(KeyContext);
}
