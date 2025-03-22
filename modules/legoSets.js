const setData = require("../data/setData");
const themeData = require("../data/themeData");

class LegoData {
    constructor() {
        this.sets = [];
        this.themes = [];
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
            this.themes = themeData; 
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

    getAllThemes() {
        return new Promise((resolve) => {
            resolve(this.themes);
        });
    }

    addSet(newSet) {
        return new Promise((resolve, reject) => {
            console.log(newSet)
            const exists = this.sets.some(set => set.set_num === newSet.set_num);
            if (exists) {
                reject("Set already exists");
            } else {
                const theme = this.themes.find(t => t.id === newSet.theme_id);
                if (theme) {
                    newSet.theme = theme.name;
                }
                this.sets.push(newSet);
                resolve("Set added successfully");
            }
        });
    }

    deleteSetByNum(setNum) {
        return new Promise((resolve, reject) => {
          const index = this.sets.findIndex(set => set.set_num === setNum);
          if (index !== -1) {
            this.sets.splice(index, 1); 
            resolve();
          } else {
            reject("Set not found");
          }
        });
      }
    
      getThemeById(themeId) {
        return new Promise((resolve, reject) => {
            console.log("Searching for theme ID:", themeId);
            const theme = this.themes.find(t => t.id === themeId);
            if (theme) {
                console.log("Theme found:", theme);
                resolve(theme);
            } else {
                const errorMessage = `Theme not found for ID: ${themeId}`;
                console.error(errorMessage); 
                reject(new Error(errorMessage)); 
            }
        });
    }
     
      
}

module.exports = LegoData;
