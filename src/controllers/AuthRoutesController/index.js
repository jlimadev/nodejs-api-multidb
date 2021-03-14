class AuthRoutesController {
  constructor(deps) {
    this.secret = deps.secret;
    this.db = deps.db;
    this.passwordHelper = deps.passwordHelper;
    this.jwtSign = deps.jwtSign;
  }

  async signIn(request, response) {
    const { username, password } = request.body;

    const [user] = await this.db.read({
      username: username.toLowerCase(),
    });

    const passwordMatches = user
      ? this.passwordHelper.comparePassword(password, user.password)
      : false;

    if (!user || !passwordMatches) {
      const error = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid username or password',
      };
      return response.json(error).status(error.statusCode);
    }

    const token = this.jwtSign(
      {
        username,
        id: user.id,
      },
      this.secret,
    );

    const auth = { auth: true, token };
    return response.json(auth).status(200);
  }
  async signOut(request, response) {
    response.json({ auth: false, token: null }).status(200);
  }

  async signUp() {}
}

module.exports = AuthRoutesController;
