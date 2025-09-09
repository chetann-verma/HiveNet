import { Link, useNavigate } from "react-router-dom";
import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Layout } from "../../components/Layout/Layout";
import classes from './Signup.module.scss';
import { Separator } from "../../components/Separator/Separator";
import { useState, type FormEvent } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";

export function Signup()
{
    const [errorMessage, setErrorMessage] = useState("");
    //loading state
    const [isLoading, setIsLoading] = useState(false);
    //accessing signup from authprovider
    const {signup} = useAuthentication();
    const navigate = useNavigate();

    const doSignup = async(e:FormEvent<HTMLFormElement>) => {
            //refresh the page
            e.preventDefault();
            //make it true if redirect done
            setIsLoading(true);
            //grab email & pw into its value
            const email = e.currentTarget.email.value;
            const password = e.currentTarget.password.value;
            //throw error on logging if any
            try {
                await signup(email, password);
                navigate("/");
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

    return( <Layout className={classes.root}>
        <Box>
            <h1>Sign up</h1>
            <h2>The Future is Connected. Join Hivenet.</h2>
            <form onSubmit={doSignup}>
                <Input type="email" id="email" label="Email"/>
                <Input type="password" id="password" label="Password"/>
                {errorMessage && <p className={classes.error}>{errorMessage}</p>}
                <p className={classes.disclaimer}>
                    By clicking Agree & Join or Continue, you agree to HiveNet's{" "}
                    <a href="">User Agreement</a>, <a href="">Privacy Policy</a>, and{" "}
                    <a href="">Cookie Policy</a>
                </p>
                <Button type="submit" disabled={isLoading}>Create My Hive</Button>
            </form>
            <Separator>Or</Separator>
            <div className={classes.register}>
                Already on HiveNet? <Link to="/login">Sign in</Link>
            </div>
            </Box></Layout>
            );
}