import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState } from '../types';
import { AppAction, Reducer } from './reducer';
import { saveState } from '../utils/storage';

type AppContextValue = [AppState, React.Dispatch<AppAction>];

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppDataProviderProps {
  initialState: AppState;
  reducer: Reducer;
  children: ReactNode;
}

export const AppDataProvider = ({ initialState, reducer, children }: AppDataProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist state to localStorage on every change (debounce not needed at this scale)
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};

export const useStateValue = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useStateValue must be used within an AppDataProvider');
  }
  return context;
};
