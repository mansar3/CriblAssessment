function removeAll(originalSet, toBeRemovedSet) {
  toBeRemovedSet.forEach(Set.prototype.delete, originalSet);
}

function intersection(firstSet, secondSet) {
  let intersection = new Set([...firstSet].filter((x) => secondSet.has(x)));
  return intersection;
}

module.exports = {
  removeAll,
  intersection,
};
