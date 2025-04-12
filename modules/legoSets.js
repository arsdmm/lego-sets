const { Sequelize, DataTypes } = require('sequelize');
const themeData = require('../data/themeData.json');

class LegoData {
    constructor() {
        this.sequelize = new Sequelize(
            process.env.PGDATABASE,
            process.env.PGUSER,
            process.env.PGPASSWORD,
            {
                host: process.env.PGHOST,
                dialect: 'postgres',
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    },
                },
            }
        );

        this.Set = this.sequelize.define("Set", {
            set_num: { type: DataTypes.STRING, primaryKey: true },
            name: DataTypes.STRING,
            year: DataTypes.INTEGER,
            num_parts: DataTypes.INTEGER,
            theme_id: DataTypes.INTEGER,
            img_url: DataTypes.STRING,
        }, {
            tableName: 'sets',
            timestamps: false
        });

        this.Theme = this.sequelize.define("Theme", {
            id: { type: DataTypes.INTEGER, primaryKey: true },
            name: DataTypes.STRING
        }, {
            tableName: 'themes',
            timestamps: false
        });

        this.Set.belongsTo(this.Theme, { foreignKey: 'theme_id' });
    }

    initialize() {
        return this.sequelize.sync()
            .then(() => this.loadThemes())
            .catch(err => console.error("Error syncing database: ", err));
    }

    loadThemes() {

        return Promise.all(themeData.map(theme => {
            return this.Theme.findOrCreate({
                where: { id: theme.id },
                defaults: { name: theme.name }
            });
        }));
    }

    getAllSets() {
        return this.Set.findAll({ include: this.Theme });
    }

    getSetByNum(setNum) {
        return this.Set.findOne({
            where: { set_num: setNum },
            include: this.Theme
        });
    }

    getSetsByTheme(theme) {
        return this.Set.findAll({
            include: {
                model: this.Theme,
                where: {
                    name: {
                        [Sequelize.Op.iLike]: `%${theme}%`
                    }
                }
            }
        });
    }

    getAllThemes() {
        return this.Theme.findAll();
    }    

    addSet(newSet) {
        return this.Set.create(newSet);
    }

    deleteSetByNum(setNum) {
        return this.Set.destroy({
            where: { set_num: setNum }
        });
    }

    getThemeById(themeId) {
        return this.Theme.findByPk(themeId);
    }
}

module.exports = LegoData;
