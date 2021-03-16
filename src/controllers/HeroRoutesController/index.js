class HeroRoutesController {
  constructor(deps) {
    this.db = deps.db;
  }

  async list(request, response) {
    try {
      const { query } = request;
      const { name, skip, limit } = query;
      const search = query.name ? { name: { $regex: `.*${name}*.` } } : {};

      const dbResponse = await this.db.read(
        search,
        parseInt(skip, 10),
        parseInt(limit, 10)
      );

      if (dbResponse.length === 0) {
        const error = {
          statusCode: 404,
          error: "Not Found",
          message: "Hero not found",
        };
        return response.status(error.statusCode).json(error);
      }

      return response.status(200).json(dbResponse);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async create(request, response) {
    try {
      const { name, power } = request.body;
      const dbResponse = await this.db.create({ name, power });
      return response.status(201).json(dbResponse);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async update(request, response) {
    try {
      const { body, params } = request;
      const { id } = params;
      const patchData = JSON.parse(JSON.stringify(body));

      const dbResponse = await this.db.update(id, patchData);
      return response.status(200).json(dbResponse);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;
      const dbResponse = await this.db.delete(id);
      return response.status(200).json(dbResponse);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
}

module.exports = HeroRoutesController;
