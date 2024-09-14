import { Sequelize, Model } from "sequelize";
import bcrypt from 'bcryptjs';

export default class User extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: Sequelize.STRING,
                defaultValue: ''
            },
            email: {
                type: Sequelize.STRING,
                defaultValue: '',
                unique: {
                    msg: 'E-mail already exists',
                },
                validate: {
                    isEmail: {
                        msg: 'Invalid e-mail',
                    }
                }
            },
            password: {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            password_hash: {
                type: Sequelize.VIRTUAL,
                defaultValue: '',
                validate: {
                    len: {
                        args: [8, 50],
                        msg: 'The password must have between 8 and 50 characters'
                    }
                }
            }
        }, {
            sequelize
        });

        this.addHook('beforeSave', async user => {
            if(user.password_hash) {
                user.password = await bcrypt.hash(user.password_hash, 8);
            }
        });

        return this;
    }

    passwordValidator(password) {
        return bcrypt.compare(password, this.password);
    }

    static associate(models) {
        this.hasMany(models.DrinkRegister, {foreignKey: 'user_id', as: 'drinksRegisters'});
    }
}