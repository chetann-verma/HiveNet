import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box } from "../../components/Box/Box";
import { Input } from "../../../../components/Input/Input";
import classes from './Login.module.scss';
import { Separator } from "../../components/Separator/Separator";
import { useState, type FormEvent } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";
import { Button } from "../../../../components/Button/Button";

export function Login()
{
    const [errorMessage, setErrorMessage] = useState("");
    //tell user redirect is done
     const [isLoading, setIsLoading] = useState(false);
    //grab login() from context it is calling when form is submit 
    const {login} = useAuthentication();
    //to redirect to the pages w/o user credetials
    const navigate = useNavigate();
    const location = useLocation();

    //this will call login from context that take form event ie html form element
    const doLogin = async(e:FormEvent<HTMLFormElement>) => {
        //refresh the page
        e.preventDefault();
        //make it true if redirect done
        setIsLoading(true);
        //grab email & pw into its value
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;
        //throw error on logging if any
        try {
            await login(email, password);
            //after redirection check location is on profile but not logged in then go to login page and then retrun to that page
            const destination = location.state?.from || "/";
            navigate(destination);
        } catch (error) 
        //if error from js it messg 
        {
            if(error instanceof Error)
            {
                setErrorMessage(error.message);
            }else{
                setErrorMessage("An unknown error occured.");
            }            
        }
        finally{
            setIsLoading(false);
        }
    };

    return( <div className={classes.root}>
        <Box>
            <h1>Login</h1>
            <h2>The ultimate hub for all things tech</h2>
            
            <form onSubmit={doLogin} //call do login () to redirect
            >            
            
                <Input type="email" id="email" label="Email" placeholder="Enter your email" onFocus={() => setErrorMessage("")}/>
                <Input type="password" id="password" label="Password" placeholder="Enter your password" onFocus={() => setErrorMessage("")}/>

                {errorMessage && <p className={classes.error}>{errorMessage}</p>}
                {/* disable when loading is true */}
                <Button type="submit" disabled={isLoading}>
                    {//if is loading button show ... if not then lgoin
                        isLoading ? "..." : "Login"
                    }
                </Button>
                <Link to="/authentication/request-password-reset">Forgot password?</Link>
            </form>
            <Separator>Or</Separator>
            <div className={classes.register}>
                New to HiveNet? <Link to="/authentication/signup">join now</Link>
            </div>
        </Box></div>
            );
}