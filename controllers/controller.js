module.exports = class Controller {
  constructor(model) {
    this.model = model;
    this.index = this.index.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
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

  formatReturnData(data) {
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

  index(req, res, next) {
    const attributes = this.formatAttributes(req.query.attributes);
    const where = this.createWhereObject(req.query);
    this.model
      .findAll({ attributes, where })
      .then((data) => res.send(this.formatReturnData(data)));
    // this.send(this.model.findAll({ attributes, where }), res, next);
  }

  getById(req, res, next) {
    const attributes = this.formatAttributes(req.query.attributes);
    this.send(
      this.model.findOne({ attributes, where: { id: req.params.id } }),
      res,
      next
    );
  }

  create(req, res, next) {
    console.log(req.body);
    const record = req.body;
    this.send(this.model.create(record), res, next);
  }

  update(req, res, next) {
    console.log(req.body);
    const record = req.body;
    this.send(
      this.model
        .update(record, {
          where: { id: req.params.id },
          returning: true,
        })
        .then(
          (data) =>
            new Promise((resolve) =>
              resolve(data[1] && data[1][0] ? data[1][0] : {})
            )
        ),
      res,
      next
    );
  }

  delete(req, res, next) {
    const id = req.params.id;
    this.model
      .destroy({ where: { id } })
      .then((numberOfRowsDeleted) =>
        this.send(
          new Promise((resolve, reject) =>
            numberOfRowsDeleted === 1
              ? resolve({ id })
              : reject(
                  new Error(
                    "Error deleting: DB response / number of rows deleted: " +
                      numberOfRowsDeleted
                  )
                )
          ),
          res,
          next
        )
      );
  }

  send(queryPromise, res, next) {
    return queryPromise
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        next(err);
        // res.sendStatus(500).send(err);
      });
  }

  createWhereObject(queryParams) {
    const where = { ...queryParams };
    delete where.attributes;
    return where;
  }
};
