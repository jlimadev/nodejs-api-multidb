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
      return response.json({ error: error.message }).status(400);
    }
  }

  async create(request, response) {
    try {
      const { name, power } = request.body;
      const dbResponse = await this.db.create({ name, power });
      return response.json(dbResponse).status(200);
    } catch (error) {
      return response.json({ error: error.message }).status(400);
    }
  }

  async update(request, response) {
    try {
      const { body, params } = request;
      const { id } = params;
      const patchData = JSON.parse(JSON.stringify(body));

      const dbResponse = await this.db.update(id, patchData);
      return response.json(dbResponse).status(200);
    } catch (error) {
      return response.json({ error: error.message }).status(400);
    }
  }

  async delete(request, response) {
    try {
      const id = request.params.id;
      const dbResponse = await this.db.delete(id);
      return response.json(dbResponse).status(200);
    } catch (error) {
      return response.json({ error: error.message }).status(400);
    }
  }
}

module.exports = HeroRoutesController;
