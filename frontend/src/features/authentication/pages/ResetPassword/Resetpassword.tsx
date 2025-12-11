import { useNavigate } from "react-router-dom";
import { Box } from "../../components/Box/Box";
import { Button } from "../../../../components/Button/Button";
import { Input } from "../../../../components/Input/Input";
import { AuthenticationLayout } from "../../components/AuthenticationLayout/AuthenticationLayout";
import classes from './ResetPassword.module.scss'
import { useState } from "react";

export function Resetpassword()
{
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");

     //called when click on forgot pw button
    const sendPasswordResetToken = async (email: string) => {
        try {
            //make an api call to veri. token
            const response = await fetch(
                //take code as param
                import.meta.env.VITE_API_URL + "/api/v1/authentication/send-password-reset-token?email=" + email,
                    {
                        //its an put request
                       method: "PUT",
                    }
            );
            //if ok we remove error msg that previously created
            if(response.ok)
            {
                setErrorMessage("");
                setEmailSent(true);
               return;
            }
            //if not ok grab the error msg here
            const {message} = await response.json();
            setErrorMessage(message);
        } catch (e) {
            console.log(e);
            setErrorMessage("Something went wrong, please try again.");            
        } finally {
            setIsLoading(false);
        }
    };

     //called when next is clicked
    const resetPassword = async (email: string, code: string, password: string) => {
        try {
            //make an api call to veri. token
            const response = await fetch(
                //take code as param
                `${import.meta.env.VITE_API_URL}/api/v1/authentication/reset-password?email=${email}&token=${code}&newPassword=${password}`,
                    {
                        //its an put request
                       method: "PUT",
                    }
            );
            //if ok we remove error msg that previously created
            if(response.ok)
            {
                setErrorMessage("");
                //go to home page
                navigate("/");
            }
            //if not ok grab the error msg here
            const {message} = await response.json();
            setErrorMessage(message);
        } catch (e) {
            console.log(e);
            setErrorMessage("Something went wrong, please try again.");            
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div className={classes.root}>
        <Box>
            <h1>Reset Password</h1>
            {
                !emailSent ? (<form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    //grab the email
                    const email = e.currentTarget.email.value;
                    //called send password token
                    await sendPasswordResetToken(email);
                    setEmail(email);
                    setIsLoading(false);
                }}>
                <p>
                    Enter your email and we'll send a verification code if ir matches an existing HiveNet account.
                </p>
                <Input name="email" type="email" label="Email"/>
                <p style={{color:"red"}}>{errorMessage}</p>
                <Button type="submit">Next</Button>
                <Button type="button" outline onClick={() => {navigate("/login");}}>Back</Button>
            </form>):(
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    //grab the code and pw
                    const code = e.currentTarget.code.value;
                    const password = e.currentTarget.password.value;
                    //called reset password
                    await resetPassword(email, code, password);
                    setIsLoading(false);
                }}>
                <p>
                    Enter the verification code we sent to your email and your new password.
                </p>
                <Input type="text" label="Verification Code" key="code" name="code"/>
                <Input label="New Password" name="password" key="password" type="password" id="password"/>
                <p style={{color:"red"}}>{errorMessage}</p>
                <Button type="submit">Reset Password</Button>
                <Button type="button" outline onClick={() => {
                    setErrorMessage("");
                    setEmailSent(false);}}>Back</Button>
            </form>
            )}            
        </Box>
        

    </div>);
}