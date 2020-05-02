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
    const attributesString = req.query.attributes;
    const { attributes, include } = this.createAttributesAndIncludeOptions(
      attributesString
    );
    const where = this.createWhereOption(req.query);
    this.model
      .findAll({ attributes, where, include })
      .then((data) =>
        res.send(this.formatFindAll(data, attributesString, include))
      )
      .catch((err) => next(err));
  }

  getById(req, res, next) {
    const attributesString = req.query.attributes;
    const { attributes, include } = this.createAttributesAndIncludeOptions(
      attributesString
    );
    this.model
      .findOne({ attributes, include, where: { id: req.params.id } })
      .then((data) =>
        res.send(this.formatRecord(data, attributesString, include))
      )
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

  createAttributesAndIncludeOptions(attributesString) {
    const result = {};
    if (attributesString) {
      const { attributes, includeByAssociationTable } = attributesString
        .split(",")
        .reduce(
          (acc, attribute) => {
            if (this.model.tableAttributes[attribute]) {
              acc.attributes.push(attribute);
              return acc;
            }

            const [
              associationTable,
              associationTableAttribute,
            ] = attribute.split("_");
            if (
              associationTable &&
              associationTableAttribute &&
              this.model.associations[associationTable] &&
              this.model.associations[associationTable].target.tableAttributes[
                associationTableAttribute
              ]
            ) {
              if (!acc.includeByAssociationTable[associationTable]) {
                acc.includeByAssociationTable[associationTable] = {
                  model: this.model.associations[associationTable].target,
                  as: associationTable,
                  attributes: [],
                };
              }
              acc.includeByAssociationTable[associationTable].attributes.push(
                associationTableAttribute
              );
              return acc;
            }

            throw new Error(`Attribute ${attribute} does not exist`);
          },
          { attributes: [], includeByAssociationTable: {} }
        );

      if (!attributes.includes("id")) {
        attributes.push("id");
      }

      result.attributes = attributes;

      const include = Object.values(includeByAssociationTable);
      if (include.length > 0) {
        result.include = include;
      }
    }
    return result;
  }

  formatRecord(record, attributesString, include) {
    if (include) {
      return Object.keys(record.get({ plain: true })).reduce(
        (acc, attribute) => {
          if (
            Object.getPrototypeOf(record[attribute].constructor).name ===
            "Model"
          ) {
            for (const subAttr in record[attribute].get({ plain: true })) {
              const joinTableAttribute = `${attribute}_${subAttr}`;
              if (attributesString.includes(joinTableAttribute)) {
                acc[joinTableAttribute] = record[attribute][subAttr];
              }
            }
          } else {
            acc[attribute] = record[attribute];
          }

          return acc;
        },
        {}
      );
    }
    return record;
  }

  createWhereOption(queryParams) {
    const where = { ...queryParams };
    delete where.attributes;
    return where;
  }

  formatFindAll(data, attributesString, include) {
    if (data instanceof Array) {
      return data.reduce((acc, record) => {
        if (record.id) {
          acc[record.id] = this.formatRecord(record, attributesString, include);
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
