/******************************************************************************************* */
/**            File for all functions related to performing operations on sets              **/
/*********************************************************************************************/

// Removes all similar values that exist between the two sets
// from the originalSet
function removeAll(originalSet, toBeRemovedSet) {
  toBeRemovedSet.forEach(Set.prototype.delete, originalSet);
}

// Finds the similar values between two sets and returns the set containing
// the similar values.
function intersection(firstSet, secondSet) {
  let intersection = new Set([...firstSet].filter((x) => secondSet.has(x)));
  return intersection;
}

// Export functions for use in other files
module.exports = {
  removeAll,
  intersection,
};
