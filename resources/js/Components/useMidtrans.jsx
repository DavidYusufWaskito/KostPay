import { useEffect } from "react";

export function useMidtrans(Client_Key) {
    useEffect(() => {
        // You can also change below url value to any script url you wish to load, 
        // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';  
      
        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;
      
        // Optional: set script attribute, for example snap.js have data-client-key attribute 
        // (change the value according to your client-key)
        const myMidtransClientKey = Client_Key;
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);
      
        document.body.appendChild(scriptTag);
        
        return () => {
          document.body.removeChild(scriptTag);
        }
    }, [Client_Key]);
}