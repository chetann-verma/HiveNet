import { useState } from "react";
import { Box } from "../../components/Box/Box";
import { Input } from "../../components/Input/Input";
import { Layout } from "../../components/Layout/Layout";
import classes from './VerifyEmail.module.scss';
import { Button } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

export function VerifyEmail()
{
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    //receive the code that well enter
    const validateEmail = async (code: string) => {
        setMessage("");
        try {
            //make an api call to veri. token
            const response = await fetch(
                //take code as param
                `${import.meta.env.VITE_API_URL}/api/v1/authentication/validate-email-verification-token?token=${code}`,
                    {
                        //its an put request
                       method: "PUT",
                       headers: {
                        //it is authenticated route we give token
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                       },
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

    // send again endpoint funtion to send email again
    const sendEmailVerificationToken = async () => {
        setErrorMessage("");
        try {
            const response = await fetch (
                //call this api and this send new email on click
                `${import.meta.env.VITE_API_URL}/api/v1/authentication/send-email-verification-token`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if(response.ok)
            {
                setErrorMessage("");
                setMessage("Code sent successfully. Please check your email.");
                return;
            }
            const {message} = await response.json();
            setErrorMessage(message);
        } catch (e) {
            console.log(e);
            setErrorMessage("Something went wrong, please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (<Layout className={classes.root}>
        <Box>
            <h1>Verify your email</h1>
            {/* on submit send email call that is grab an event*/}
            <form onSubmit={async e=>{
                //get default behaviour of page
                e.preventDefault();
                setIsLoading(true);
                //grab the code
                const code = e.currentTarget.code.value;
                //give code to vaildat email
                await validateEmail(code);
                setIsLoading(false);
            }}>
                <p>Only one step left to complete your registration. Verify your email address.</p>
                <Input type="text" label="Verification Code" key="code" name="code"/>
                {message && <p style={{color:"green"}}>{message}</p>}
                {
                   errorMessage && <p style={{color:"red"}}>{errorMessage}</p>
                }
                {/* disable buttons when loading */}
                <Button type="submit" disabled={isLoading}>Validate Email</Button>
                <Button outline type="button" 
                disabled={isLoading}
                onClick={() => {
                    sendEmailVerificationToken();
                }}>Send again</Button>
            </form>
        </Box>
    </Layout>);
}