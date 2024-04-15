import { useRouter } from 'next/router';
import {jwtDecode} from "jwt-decode";
import api from "../api";
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants";
import {useEffect, useState} from "react";

function ProtectedRoute({children} : {children: React.ReactNode}) {
    const router = useRouter();
    const [isAutorised, setIsAuthorised] = useState(Boolean);

    useEffect(() => {
        auth().catch(() => setIsAuthorised(false)); // Perform initial authorization check
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await api.post('/token/refresh/', {
                refresh: refreshToken
            });
            if(res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorised(true);
            }else {
                setIsAuthorised(false);
            }
        } catch(e) {
            console.log(e);
            setIsAuthorised(false);
        }
    }

    const auth = async () =>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(!token){
            setIsAuthorised(false);
            return;
        }
        const decoded = jwtDecode(token);
        if(!decoded || typeof decoded.exp !== 'number'){
            setIsAuthorised(false);
            return;
        }
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if(tokenExpiration < now){
            await refreshToken();
        }else{
            setIsAuthorised(true);
        }
    }  

    if(isAutorised === null){
        return <div>Loading...</div>
    }

    return isAutorised ? children : router.push('/login')
}

export default ProtectedRoute;
