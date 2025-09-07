import { useNavigate } from "react-router-dom";
import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Layout } from "../../components/Layout/Layout";
import classes from './ResetPassword.module.scss'
import { useState } from "react";
export function Resetpassword()
{
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    return (
    <Layout className={classes.root}>
        <Box>
            <h1>Reset Password</h1>
            {
                !emailSent ? (<form action="">
                <p>
                    Enter your email and we'll send a verification code if ir matches an existing HiveNet account.
                </p>
                <Input name="email" type="email" label="Email"/>
                <p style={{color:"red"}}>{errorMessage}</p>
                <Button type="submit">Next</Button>
                <Button type="button" outline onClick={() => {navigate("/login");}}>Back</Button>
            </form>):(
                <form action="">
                <p>
                    Enter the verification code we sent to your email and your new password.
                </p>
                <Input type="text" label="Verification Code" key="code" name="code"/>
                <Input label="New Password" name="password" key="password" type="password" id="password"/>
                <p style={{color:"red"}}>{errorMessage}</p>
                <Button type="submit">Reset Password</Button>
                <Button type="button" outline onClick={() => {setEmailSent(false);}}>Back</Button>
            </form>
            )}            
        </Box>
        

    </Layout>);
}