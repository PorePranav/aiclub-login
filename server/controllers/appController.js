import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config.js';

export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;        

        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }).then(usernameData => {
                if(usernameData) reject( {error: 'Username is already taken!'} );
                resolve();
            });
        });


        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }).then(emailData => {
                if(emailData) reject( {error: 'Another account has taken this email'} );
                resolve();
            }); 
        });

        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error => res.status(500).send({error}))

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Unable to hash password"
                            })
                        });
                }
            }).catch(error => {
                return res.status(500).send(error);
            });

    } catch (error) {
        return res.status(500).send(error);
    }

}

export async function login(req, res) {
    const { username, password } = req.body;
  
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: 'Username not found' });
        }
      
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).send({ error: 'Password does not match' });
        }
  
        const token = jwt.sign({
          userId: user._id,
          username: user.username,
        },
        env.JWT_SECRET,
        { expiresIn: '24h' });
  
        return res.status(200).send({
            msg: 'Login successful',
            username: user.username,
            token,
        });

    } catch (error) {
        return res.status(500).send({ error });
    }
}
  

export async function getUser(req, res) {
    res.join('getUser route');
}

export async function updateUser(req, res) {
    res.join('updateUser route');
}

export async function generateOTP(req, res) {
    res.join('generateOTP route');
}

export async function verifyOTP(req, res) {
    res.join('verifyOTP route');
}

export async function createResetSession(req, res) {
    res.join('createResetSession route');
}

export async function resetPassword(req, res) {
    res.join('resetPassword route');
}
