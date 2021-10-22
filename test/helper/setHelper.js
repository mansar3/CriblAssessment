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

// Find the difference between the two sets explicity for the second set:
// i.e [1, 2, 3, 4] [5, 4, 3, 2]  => {5}
function except(firstSet, secondSet) {
  let difference = new Set([...secondSet].filter((x) => !firstSet.has(x)));
  return difference;
}

// Export functions for use in other files
module.exports = {
  removeAll,
  intersection,
  except,
};
