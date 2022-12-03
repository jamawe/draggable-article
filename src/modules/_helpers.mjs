/**
 * Returns a sufficient enough random number
 * @returns {number}
 */
function generateId() {
    return Math.floor(Date.now() * Math.random());
}

export {
    generateId
}