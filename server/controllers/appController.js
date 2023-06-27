import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config.js';
import otpGenerator from 'otp-generator';

export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method === 'GET' ? req.query : req.body;
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error: 'Cannot find user'});
        next();
    } catch(error) {
        return res.status(404).send({error: 'Authentication error'})
    }
}

export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;        

        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }).then(usernameData => {
                if(usernameData) reject( {error: 'Username is already taken!'} );
                resolve();
            });
        });

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
                                .then(result => res.status(201).send({ msg: "User registered successfully"}))
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
            { expiresIn: '24h' }
        );
  
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
    const { username } = req.params;

    try {
        if(!username) return res.status(501).send({ error: 'Invalid username' });
        UserModel.findOne({ username })
            .then((user) => {
                if(!user) return res.status(501).send({ error: 'Could not find the user' });
                const { password, ...rest } = Object.assign({}, user.toJSON());
                return res.status(201).send(rest);
            }) 
            .catch((error) => {
                return res.status(501).send({ error: 'Could not find the user' });
            })
    } catch(error) {
        return res.status(404).send({ error: 'Cannot find user data' });
    }
}

export async function updateUser(req, res) {
    try {
        const { userId } = req.user;
        const { body } = req;

        if (userId) {
            UserModel.updateOne({ _id: userId }, body)
            .then(() => {
                    return res.status(201).send({ msg: 'Record updated!' });
            })
            .catch((err) => {
                throw err;
            });
        } else {
            return res.status(401).send({ error: 'User not found' });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
  
export async function generateOTP(req, res) {
    req.app.locals.otp = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    res.status(201).send({ code: req.app.locals.otp });
}

export async function verifyOTP(req, res) {
    const { code } = req.query;
    if(parseInt(req.app.locals.otp) === parseInt(code)) {
        req.app.locals.otp = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg: 'Verifed successfully' });
    }
    return res.status(400).send({ error: 'Invalid OTP'});
}

export async function createResetSession(req, res) {
    if(req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession });
    }
    return res.status(440).send({ error: 'Session expired' });
}

export async function resetPassword(req,res){
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const { username, password } = req.body;

        try { 
            UserModel.findOne({ username})
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username: user.username }, { password: hashedPassword })
                                .then((data) => {
                                    req.app.locals.resetSession = false;
                                    return res.status(201).send({ msg: "Record Updated...!" });
                            })
                            .catch((err) => {
                                throw err;
                            });
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Username not Found"});
                })
        } catch (error) {
            return res.status(500).send({ error })
        }
    } catch (error) {
        return res.status(401).send({ error })
    }
}

