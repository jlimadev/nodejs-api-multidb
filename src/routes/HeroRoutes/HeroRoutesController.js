class HeroRoutesController {
  constructor(db) {
    this.db = db;
  }

  async list(request, response) {
    try {
      const { query } = request;
      const { name, limit, skip } = query;
      const search = name ? { name: { $regex: `.*${name}*.` } } : {};
      const dbResponse = await this.db.read(search, limit, skip);
      return response.json(dbResponse).status(200);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = HeroRoutesController;
