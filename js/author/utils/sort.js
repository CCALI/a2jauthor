const sort = Array.prototype.sort

export default function(list, comparator) {
  var outList = sort.call(list, comparator);
  return outList
}
