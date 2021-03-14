class AuthRoutesController {
  constructor(secret, db, passwordHelper, JWTClient) {
    this.secret = secret;
    this.db = db;
    this.passwordHelper = passwordHelper;
    this.JWTClient = JWTClient;
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
      return response.json(error).code(error.statusCode);
    }

    const token = this.JWTClient.sign(
      {
        username,
        id: user.id,
      },
      this.secret,
    );

    return { token };
  }
  async signUp() {}
  async signOut() {}
}

module.exports = AuthRoutesController;
