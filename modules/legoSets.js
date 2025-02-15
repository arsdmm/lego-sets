/********************************************************************************
 * WEB700 – Assignment 02
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Dmytro Litvinov Student ID: 132258237 Date: 1/31/2025
 *
 ********************************************************************************/

const setData = require("../data/setData");
const themeData = require("../data/themeData");

class LegoData {
    constructor() {
        this.sets = [];
    }

    initialize() {
        return new Promise((resolve, reject) => {
            setData.forEach(set => {
                this.sets.push(set);
            });
            this.sets.forEach(set => {
                const theme = themeData.find(t => t.id === set.theme_id);
                if (theme) {
                    set.theme = theme.name;
                }
            });
            if (this.sets.length > 0) {
                resolve("Data downloaded");
            } else {
                reject("Error occurred");
            }
        });
    }

    getAllSets() {
        return new Promise((resolve, reject) => {
            if (this.sets.length > 0) {
                resolve(this.sets);
            } else {
                reject("No sets available");
            }
        });
    }

    getSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            const set = this.sets.find(s => s.set_num === setNum);
            if (set) {
                resolve(set);
            } else {
                reject(`Unable to find set with set_num: ${setNum}`);
            }
        });
    }

    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {
            const sets = this.sets.filter(s => s.theme.toLowerCase().includes(theme.toLowerCase()));
            if (sets.length > 0) {
                resolve(sets);
            } else {
                reject(`Unable to find sets with theme containing: ${theme}`);
            }
        });
    }
}

module.exports = LegoData;

// Testing the LegoData class
let data = new LegoData();
data.initialize()
    .then(() => {
        return data.getAllSets(); 
    })
    .then(sets => {
        console.log(`Number of Sets: ${sets.length}`);
        return data.getSetByNum("001-1");
    })
    .then(set => {
        console.log(set);
        return data.getSetsByTheme('tech');
    })
    .then(techSets => {
        console.log(`Number of 'tech' sets: ${techSets.length}`);
    })
    .catch(error => {
        console.error(error);
    });