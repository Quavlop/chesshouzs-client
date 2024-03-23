import { useRouter } from "next/router"
import getConfig from "next/config";
import getCsrfToken from '@/helpers/getCsrfToken';
import { useEffect, useState } from "react"
import ServerError from "@/components/main/ServerError";
import UserContext from "@/contexts/UserContext";
import { useContext } from "react";


export default function GoogleAuth(){

    const config = getConfig();
    const { publicRuntimeConfig } = config;
    const { API_URL } = publicRuntimeConfig;    

    const {user, setUser} = useContext(UserContext);
 
    const [serverError, setServerError] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    
    const router = useRouter();
    const { code } = router.query;

    const exchangeToken = async () => {
        try {
            const xsrfToken = await getCsrfToken(API_URL);            
            const response = await fetch(API_URL + '/auth/google/exchange_auth_token', {
                method : "POST", 
                headers : {
                    'Content-Type' : "application/json",
                    'X-CSRF-Token' : xsrfToken
                },
                credentials : 'include',
                body : JSON.stringify({code})
            });

            const parsedResponse = await response.json();            

            if (parsedResponse.code === 200 || parsedResponse.code === 302){
                if (parsedResponse.account){
                    setUser(parsedResponse.account);
                }
                router.push('/');
                return;
            }

            // handle 401
            if (parsedResponse.code === 401 || parsedResponse.code === 404){
                router.push('/login?err_code=AUTH401');
                return;
            }

            // handle 409
            if (parsedResponse.code === 409){
                router.push('/login?err_code=AUTH409');
                return;
            }

            if (parsedResponse.code === 500){
                setServerError(true);
                return;                     
            }
    
          } catch (err) {
            setServerError(true);
            return;     
        }

    }

    useEffect(() => {
        
        if (!code){
            router.push('/');
            return;
        }
        exchangeToken();

    }, [code]);
    

    return (
        serverError ? <ServerError/> :
            <>
            </>
    )
}

GoogleAuth.getLayout = (page) => {
    return (
        (page)
    );
}