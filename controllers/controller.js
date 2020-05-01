module.exports = class Controller {
  constructor(model) {
    this.model = model;
    this.index = this.index.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  index(req, res, next) {
    const attributes = this.formatAttributes(req.query.attributes);
    const where = this.createWhereObject(req.query);
    this.model
      .findAll({ attributes, where })
      .then((data) => res.send(this.formatFindAll(data)))
      .catch((err) => next(err));
  }

  getById(req, res, next) {
    const attributes = this.formatAttributes(req.query.attributes);
    this.model
      .findOne({ attributes, where: { id: req.params.id } })
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }

  create(req, res, next) {
    console.log(req.body);
    const record = req.body;
    this.model
      .create(record)
      .then((data) => res.send(data))
      .catch((err) => next(err));
  }

  update(req, res, next) {
    console.log(req.body);
    const record = req.body;
    this.model
      .update(record, {
        where: { id: req.params.id },
        returning: true,
      })
      .then((data) => res.send(this.formatUpdate(data)))
      .catch((err) => next(err));
  }

  delete(req, res, next) {
    const id = req.params.id;
    this.model
      .destroy({ where: { id } })
      .then((data) => res.send(this.formatDelete(data, id)))
      .catch((err) => next(err));
  }

  createWhereObject(queryParams) {
    const where = { ...queryParams };
    delete where.attributes;
    return where;
  }

  formatAttributes(attributes) {
    if (attributes) {
      const formattedAttributes = attributes.split(",");
      if (!formattedAttributes.includes("id")) {
        formattedAttributes.push("id");
      }
      return formattedAttributes;
    }
  }

  formatFindAll(data) {
    if (data instanceof Array) {
      return data.reduce((acc, record) => {
        if (record.id) {
          acc[record.id] = record;
        }
        return acc;
      }, {});
    }
    return data;
  }

  formatUpdate(data) {
    if (data instanceof Array && data[1] && data[1][0]) {
      return data[1][0];
    }
    return data;
  }

  formatDelete(data, id) {
    if (data === 1) {
      return { id };
    }
    throw new Error(
      `Error deleting record with id ${id}: DB response / number of rows deleted: ${data}`
    );
  }
};
