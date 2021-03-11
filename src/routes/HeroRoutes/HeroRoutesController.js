class HeroRoutesController {
  constructor(db) {
    this.db = db;
  }

  async list(request, response) {
    try {
      const { query } = request;
      const { name, skip, limit } = query;

      const search = query.name ? { name: { $regex: `.*${name}*.` } } : {};

      const dbResponse = await this.db.read(
        search,
        parseInt(skip),
        parseInt(limit),
      );
      return response.json(dbResponse).status(200);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(request, response) {
    try {
      const { name, power } = request.body;
      const dbResponse = await this.db.create({ name, power });
      return response.json(dbResponse).status(200);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = HeroRoutesController;
