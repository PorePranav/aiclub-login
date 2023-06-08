import { toast } from "react-hot-toast";
import { authenticate } from "./helper";

export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);
    if(values.username) {
        const { status } = await authenticate(values.username);
    
        if(status !== 200) {
            errors.exist = toast.error('User does not exist');
        }
    }
    return errors;
}

export async function passwordValidate(values) {
    return passwordVerify({}, values);
}

export async function resetPasswordValidate(values) {
    const errors = passwordVerify({}, values);
    if(values.password !== values.confirm_password) {
        console.log(values.password, values.confirm_password);
        errors.exist = toast.error('Passwords do not match');
        console.log(values.password !== values.confirm_password);
    }
    return errors;
} 

export async function registerValidation(values) {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors;
}

export async function profileValidation(values) {
    return emailVerify({}, values);
}

function usernameVerify(error = {}, values) {
    if(!values.username) 
        error.username = toast.error('Username is required!');
    else if(values.username.includes(' '))
        error.username = toast.error('Invalid username!');

    return error;
}

function passwordVerify(error = {}, values) {
    if(!values.password)
        error.password = toast.error('Password is required!');
    else if(values.password.includes(' '))
        error.password = toast.error('Wrong password!');
    else if(values.password.length < 4)
        error.password = toast.error('Password should be more than 4 characters long');
    return error;
}

function emailVerify(error = {}, values) {
    if(!values.email)
        error.email = toast.error('Email is required');
    else if(values.email.includes(' ') || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email))
        error.email = toast.error('Enter a valid email');
    return error;
}


