import { Link } from "react-router-dom";
import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Layout } from "../../components/Layout/Layout";
import classes from './Login.module.scss';
import { Separator } from "../../components/Separator/Separator";
import { useState, type FormEvent } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";

export function Login()
{
    const [errorMessage, setErrorMessage] = useState("");
    //grab login() from context it is calling when form is submit 
    const {login} = useAuthentication()
    //this will call login from context that take form event ie html form element
    const doLogin = async(e:FormEvent<HTMLFormElement>) => {
        //refresh the page
        e.preventDefault();
        //grab email & pw into its value
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;
        //throw error on logging if any
        try {
            await login(email, password);
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
    };

    return( <Layout className={classes.root}>
        <Box>
            <h1>Sign in</h1>
            <p>Stay updated on your professional world.</p>
            
            <form onSubmit={doLogin} //call do login () to redirect
            >            
            
                <Input type="email" id="email" label="Email" onFocus={() => setErrorMessage("")}/>
                <Input type="password" id="password" label="Password" onFocus={() => setErrorMessage("")}/>

                {errorMessage && <p className={classes.error}>{errorMessage}</p>}

                <Button type="submit">"Sign in"</Button>
                <Link to="/request-password-reset">Forgot password?</Link>
            </form>
            <Separator>Or</Separator>
            <div className={classes.register}>
                New to HiveNet? <Link to="/signup">join now</Link>
            </div>
            </Box></Layout>
            );
}