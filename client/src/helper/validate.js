import { toast } from "react-hot-toast";

export async function usernameValidate(values) {
    return usernameVerify({}, values);
}

export async function passwordValidate(values) {
    return passwordVerify({}, values);
}

export async function resetPasswordValidate(values) {
    const errors = passwordVerify({}, values);
    if(values.password !== values.confirm_password)
        errors.exist = toast.error('Passwords do not match');
    return errors;
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
