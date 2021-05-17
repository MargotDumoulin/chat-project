import { createContext } from 'react';

const PubnubContext = createContext({
    pubnub: undefined,
    updatePubnub: () => {}
});

export const PubnubProvider = PubnubContext.Provider;

export default PubnubContext;