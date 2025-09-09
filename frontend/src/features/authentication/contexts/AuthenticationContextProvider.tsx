console.log("VITE_API_URL from env:", import.meta.env.VITE_API_URL);
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/Loader/Loader";

interface User{
    id:string;
    email:string;
    emailVerified: boolean;
}

interface AuthenticationContextType{
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password:string) => Promise<void>;
    logout: () => void;
}

 const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

 //to access data on other pages
 export function useAuthentication()
 {
    return useContext(AuthenticationContext);
 }

 // and wrap all the pages in main
export function AuthenticationContextProvider(){
    //to protect user
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    //to change url evertime and redirect to new again after login call fetchuser() grab user location
    const location = useLocation();

    //auth pages
    const isOnAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/request-password-reset";

    //login will make a post request to login end point using content type json
    const login = async (email: string, password: string) => {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/login",{method: "POST", headers: {
            "Content-Type": "application/json",},
        body: JSON.stringify({email, password}),});
        if(response.ok)//is it is ok 
        {
            const {token} = await response.json();//send toekn as response as a part of response
            localStorage.setItem("token", token);//setting token in local stoergae for login
        }else //is not okay send error message
        {
            const {message} = await response.json();
            throw new Error(message);//error catch by login page to display error
        }
    };

    //signup will make a post request to signup end point using content type json
    const signup = async (email: string, password: string) => {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/register",{method: "POST", headers: {
            "Content-Type": "application/json",},
        body: JSON.stringify({email, password}),});
        if(response.ok)//if it is ok 
        {
            const {token} = await response.json();//send toekn as response as a part of response
            localStorage.setItem("token",token);//setting token in local stoergae for signup
        }else //is not okay send error message
        {
            const {message} = await response.json();
            throw new Error(message);//error catch by login page to display error
        }
    };
 
    //remove the token form storage and set user to null and give this to context all page
    const logout = async () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    //to get user when page load
    const fetchUser = async () => {
        try{
            //make url to end point that we built
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/user",{ headers: {
            //send token as part of barrier
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },});
        if(!response.ok)//if not ok 
        {
            throw new Error("Authentication failed");
        }
        const user = await response.json();
        //we receive the user we set user 
        setUser(user);
    }catch (e)
    {
        console.log(e);
    }
    finally {
        //finally we had laoding state
        setIsLoading(false);
        //we seta fter laoding false 
    }
    };

    //use fetchuser() when context s red
    useEffect(() => {
        if(user)//if already user return
        {
            return;
        }//if not user tehn and this will going to login
        fetchUser();
    },[user, location.pathname]//using user as depenedency and its location
    );

    //when loading is true
    if(isLoading)
    {
        return <Loader/>
        //loader is in src folder to use by all the features
    }
    //is not laoding not a user and not on auth page page naviaget to logi page
    if(!isLoading && !user && !isOnAuthPage)
    {
    return <Navigate to="/login"/>
    }

    //if user is and dont no email verified and on auth page return to home page
    if(user && user?.emailVerified && isOnAuthPage)
    {
        return <Navigate to="/"/>
    }

    return (

    <AuthenticationContext.Provider value={{user, login, signup, logout}}> 
    {
        //if user not email verified return to verifiy otherwise dont
        user && !user.emailVerified ? <Navigate to="/verify-email"/> : null
    }    <Outlet //to render to pages
    /> 
    </AuthenticationContext.Provider>
    );//user value to login signup logout


}