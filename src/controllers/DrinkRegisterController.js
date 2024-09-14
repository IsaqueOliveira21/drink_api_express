import { Op, Sequelize } from "sequelize";
import DrinkRegister from "../models/DrinkRegister";
import { DateTime } from "luxon";
import User from "../models/User";

class DrinkRegisterController {
  async index(req, res) {
    try {
      const { dataInicio, dataFim } = req.query;
      const filters = {
        user_id: req.userId,
      };
      if (dataInicio && dataFim) {
        filters.created_at = {
          [Sequelize.Op.between]: [new Date(dataInicio), new Date(dataFim)],
        };
      }
      const drinks = await DrinkRegister.findAll({
        where: filters,
      });
      return res.status(200).json({ drinks });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  async monthRanking(req, res) {
    const inicioMes = DateTime.now().startOf('month').toFormat('yyyy-MM-dd HH:mm:ss');
    const fimMes = DateTime.now().endOf('month').toFormat('yyyy-MM-dd HH:mm:ss');
    
    const drinksRegisters = await DrinkRegister.findAll({
        attributes: [
            'user_id',
            [Sequelize.fn('COUNT', Sequelize.col('DrinkRegister.id')), 'registers_count'],
            [Sequelize.fn('SUM', Sequelize.col('DrinkRegister.qty_ml')), 'ml_sum']
        ],
        where: {
            created_at: {
                [Sequelize.Op.between]: [inicioMes, fimMes],
            }
        },
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['name']
            }
        ],
        group: ['user_id', 'user.id'],
        order: [[Sequelize.fn('SUM', Sequelize.col('DrinkRegister.qty_ml')), 'DESC']]
    });
    const position = drinksRegisters.findIndex(user => user.user_id == req.userId) + 1;
    return res.status(200).json({user_position: position, ranking: drinksRegisters});
  }

  async yearRanking(req, res) {
    const inicioAno = DateTime.now().startOf('year').toFormat('yyyy-MM-dd HH:mm:ss');
    const fimAno = DateTime.now().endOf('year').toFormat('yyyy-MM-dd HH:mm:ss');
    
    const drinksRegisters = await DrinkRegister.findAll({
        attributes: [
            'user_id',
            [Sequelize.fn('COUNT', Sequelize.col('DrinkRegister.id')), 'registers_count'],
            [Sequelize.fn('SUM', Sequelize.col('DrinkRegister.qty_ml')), 'ml_sum']
        ],
        where: {
            created_at: {
                [Sequelize.Op.between]: [inicioAno, fimAno],
            }
        },
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['name']
            }
        ],
        group: ['user_id', 'user.id'],
        order: [[Sequelize.fn('SUM', Sequelize.col('DrinkRegister.qty_ml')), 'DESC']]
    });
    const position = drinksRegisters.findIndex(user => user.user_id == req.userId) + 1;
    return res.status(200).json({user_position: position, ranking: drinksRegisters});
  }

  async create(req, res) {
    try {
      const { title, description, qty_ml } = req.body;
      const newDrinkRegister = await DrinkRegister.create({
        user_id: req.userId,
        title: title,
        description: description,
        qty_ml: qty_ml,
      });
      return res.status(200).json(newDrinkRegister);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, qty_ml } = req.body;
      const drinkRegister = await DrinkRegister.findByPk(id);

      if (!drinkRegister || drinkRegister.user_id !== req.userId)
        return res.status(404).json({ error: "Register not found" });

      const drinkRegisterUpdate = await drinkRegister.update({
        title,
        description,
        qty_ml,
      });
      return res.status(200).json(drinkRegisterUpdate);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const drinkRegister = await DrinkRegister.findByPk(id);

      if (!drinkRegister || drinkRegister.user_id !== req.userId)
        return res.status(404).json({ error: "Register not found" });

      await drinkRegister.destroy();
      return res
        .status(200)
        .json({ success: true, msg: "Register deleted successfully" });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
}
export default new DrinkRegisterController();
