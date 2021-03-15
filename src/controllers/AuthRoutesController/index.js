class AuthRoutesController {
  constructor(deps) {
    this.secret = deps.secret;
    this.db = deps.db;
    this.passwordHelper = deps.passwordHelper;
    this.jwtSign = deps.jwtSign;
  }

  async signIn(request, response) {
    try {
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
        return response.status(error.statusCode).json(error);
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
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }

  async signUp(request, response) {
    try {
      const { username, password } = request.body;
      const hashedPassword = await this.passwordHelper.hashPassword(password);

      const [userExists] = await this.db.read({
        username: username.toLowerCase(),
      });

      if (userExists) {
        const error = {
          statusCode: 409,
          error: 'Conflict',
          message: 'This user already exists',
        };
        return response.status(error.statusCode).json(error);
      }

      const result = await this.db.create({
        username: username.toLowerCase(),
        password: hashedPassword,
      });

      const createdUser = { _id: result._id, username: result.username };

      return response.status(200).json(createdUser);
    } catch (error) {
      console.log(error);
      return response.status(500).json(error);
    }
  }

  async signOut(request, response) {
    return response.status(200).json({ auth: false, token: null });
  }
}

module.exports = AuthRoutesController;
