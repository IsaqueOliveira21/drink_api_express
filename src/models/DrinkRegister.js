import Sequelize, { Model } from "sequelize";

export default class DrinkRegister extends Model {
  static init(sequelize) {
    super.init({
      user_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: 'user id required'
        }
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: 'A title is required'
        }
      },
      description: Sequelize.STRING,
      qty_ml: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          notEmpty: 'Drink ML is required',
          isNumeric: 'A integer value is required'
        }
      },
    }, {
      sequelize,
      tableName: 'drinks_registers'
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}
