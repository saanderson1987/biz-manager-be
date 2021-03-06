const { Model, Op } = require("sequelize");

const modelExtensionMethods = {
  getAll: function (query) {
    const attributesString = query.attributes;
    const { attributes, include } = this.createAttributesAndIncludeOptions(
      attributesString
    );
    const where = this.createWhereOption(query);
    return this.findAll({ attributes, where, include }).then(
      (data) =>
        new Promise((resolve) =>
          resolve(this.formatFindAll(data, attributesString, include))
        )
    );
  },

  getOne: function (id, query) {
    const attributesString = query.attributes;
    const { attributes, include } = this.createAttributesAndIncludeOptions(
      attributesString
    );
    return this.findOne({
      attributes,
      include,
      where: { id },
    }).then(
      (data) =>
        new Promise((resolve) =>
          resolve(this.formatRecord(data, attributesString, include))
        )
    );
  },

  createAndGet: function (record, returnAttributes) {
    return this.create(record).then((data) => {
      return this.getRecordWithReturnAttributes(data, returnAttributes);
    });
  },

  updateAndGet: function (id, record, returnAttributes) {
    return this.update(record, {
      where: { id },
      returning: true,
    }).then((data) => {
      const updatedRecord = this.parseUpdate(data);
      return this.getRecordWithReturnAttributes(
        updatedRecord,
        returnAttributes
      );
    });
  },

  getRecordWithReturnAttributes(record, returnAttributes) {
    if (record.id && returnAttributes) {
      const returnAttributesArr = returnAttributes.split(",");

      // if attribute possibly has attribute from join table
      if (returnAttributesArr.some((attr) => !this.tableAttributes[attr])) {
        return this.getOne(record.id, { attributes: returnAttributes });
      }

      // "returning" option on sequelize Model methods does not work, so filter for returnAttributes
      returnAttributesArr.push("id");
      return Object.entries(record.get({ plain: true })).reduce(
        (acc, [attr, value]) => {
          if (returnAttributesArr.includes(attr)) {
            acc[attr] = value;
          }
          return acc;
        },
        {}
      );
    }
    return new Promise((resolve) => resolve(record));
  },

  createAttributesAndIncludeOptions: function (attributesString) {
    const result = {};
    if (attributesString) {
      const { attributes, includeByAssociationTable } = attributesString
        .split(",")
        .reduce(
          (acc, attribute) => {
            if (this.tableAttributes[attribute]) {
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
              this.associations[associationTable] &&
              this.associations[associationTable].target.tableAttributes[
                associationTableAttribute
              ]
            ) {
              if (!acc.includeByAssociationTable[associationTable]) {
                acc.includeByAssociationTable[associationTable] = {
                  model: this.associations[associationTable].target,
                  as: associationTable,
                  attributes: [],
                };
              }
              acc.includeByAssociationTable[associationTable].attributes.push(
                associationTableAttribute
              );
              return acc;
            }

            throw new Error(`Attribute "${attribute}" does not exist`);
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
  },

  createWhereOption: function (queryParams) {
    const where = { ...queryParams };
    delete where.attributes;
    return Object.entries(where).reduce((acc, [key, val]) => {
      valSplitByComma = val.split(",");
      if (valSplitByComma.length > 1) {
        acc[key] = { [Op.or]: valSplitByComma };
      } else {
        acc[key] = val;
      }
      return acc;
    }, {});
  },

  formatRecord: function (record, attributesString, include) {
    if (include) {
      return Object.keys(record.get({ plain: true })).reduce(
        (acc, attribute) => {
          if (this[`formatAttr_${attribute}`]) {
            acc = this[`formatAttr_${attribute}`](acc, record[attribute]);
          } else if (record[attribute] instanceof Array) {
            if (attributesString)
              acc[attribute] = this.formatRecord(record[attribute]);
          } else if (
            record[attribute] &&
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
  },

  formatFindAll: function (data, attributesString, include) {
    if (data instanceof Array) {
      return data.reduce((acc, record) => {
        if (record.id) {
          acc[record.id] = this.formatRecord(record, attributesString, include);
        }
        return acc;
      }, {});
    }
    return data;
  },

  parseUpdate(data) {
    if (data instanceof Array && data[1] && data[1][0]) {
      return data[1][0];
    }
    return data;
  },

  formatDelete(data, id) {
    if (data === 1) {
      return { id };
    }
    throw new Error(
      `Error deleting record with id ${id}: DB response / number of rows deleted: ${data}`
    );
  },
};

module.exports = function extendBaseModel() {
  for (const methodName in modelExtensionMethods) {
    Model[methodName] = modelExtensionMethods[methodName];
  }
};
