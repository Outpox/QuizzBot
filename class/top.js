"use strict";

const Database = require('./database.js');

class Score {
    constructor () {

    }

    /**
     * Convert the userlist object an array and sort it based on the user points.
     *
     * @param userlist {Object} - The userlist
     * @returns {Array} - The sorted array of users
     */
    static sortUserlist(userlist) {
        var ul = Object.keys(userlist).map((val)=> {
            return userlist[val];
        });
        ul.sort((a, b) => {
            if (a.points > b.points) {
                return -1;
            }
            if (a.points < b.points) {
                return 1;
            }
            return 0;
        });
        return ul;
    }

    /**
     * Filter the max possible value
     *
     * @param sortedUserlist {Array} - The sorted array of users
     * @param max - The max number of users to display
     * @returns {int} - The max value after it has been tested
     */
    static getMax(sortedUserlist, max) {
        if (max !== undefined) {
            if (max > sortedUserlist.length) {
                return sortedUserlist.length;
            }
            else if (max <= 0) {
                return 3;
            }
            else {
                return max;
            }
        }
    }
}

module.exports = Score;