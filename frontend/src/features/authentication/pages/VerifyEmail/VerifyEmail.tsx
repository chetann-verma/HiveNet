import { useState } from "react";
import { Box } from "../../components/Box/Box";
import { Input } from "../../components/Input/Input";
import { Layout } from "../../components/Layout/Layout";
import classes from './VerifyEmail.module.scss';
import { Button } from "../../components/Button/Button";

export function VerifyEmail()
{
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");

    return (<Layout className={classes.root}>
        <Box>
            <h1>Verify your email</h1>
            <form>
                <p>Only one step left to complete your registration. Verify your email address.</p>
                <Input type="text" label="Verification Code" key="code" name="code"/>
                {message && <p style={{color:"green"}}>{message}</p>}
                {
                   errorMessage && <p style={{color:"red"}}>{errorMessage}</p>
                }
                <Button type="submit">Validate Email</Button>
                <Button outline type="button">Send again</Button>
            </form>
        </Box>
    </Layout>);
}