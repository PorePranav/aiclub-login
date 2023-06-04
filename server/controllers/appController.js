
export async function register(req, res) {
    res.join('register route');
}

export async function login(req, res) {
    res.join('login route');
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
