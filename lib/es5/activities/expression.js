"use strict";
"use strict";
var Activity = require("./activity");
var util = require("util");
function Expression() {
  Activity.call(this);
  this.expr = null;
  this.nonSerializedProperties.add("_f");
}
util.inherits(Expression, Activity);
Expression.prototype.run = function(callContext, args) {
  var self = this;
  var expr = self.get("expr");
  if (expr) {
    try {
      var f = self.get("_f");
      if (!f) {
        f = self.set("_f", new Function("return (" + expr + ")"));
      }
      callContext.complete(f.call(self));
    } catch (e) {
      callContext.fail(e);
    }
  } else {
    callContext.complete(null);
  }
};
module.exports = Expression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4cHJlc3Npb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxXQUFXLENBQUM7QUFFWixBQUFJLEVBQUEsQ0FBQSxRQUFPLEVBQUksQ0FBQSxPQUFNLEFBQUMsQ0FBQyxZQUFXLENBQUMsQ0FBQztBQUNwQyxBQUFJLEVBQUEsQ0FBQSxJQUFHLEVBQUksQ0FBQSxPQUFNLEFBQUMsQ0FBQyxNQUFLLENBQUMsQ0FBQztBQUUxQixPQUFTLFdBQVMsQ0FBRSxBQUFELENBQUc7QUFDbEIsU0FBTyxLQUFLLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQztBQUNuQixLQUFHLEtBQUssRUFBSSxLQUFHLENBQUM7QUFDaEIsS0FBRyx3QkFBd0IsSUFBSSxBQUFDLENBQUMsSUFBRyxDQUFDLENBQUM7QUFDMUM7QUFBQSxBQUVBLEdBQUcsU0FBUyxBQUFDLENBQUMsVUFBUyxDQUFHLFNBQU8sQ0FBQyxDQUFDO0FBRW5DLFNBQVMsVUFBVSxJQUFJLEVBQUksVUFBVSxXQUFVLENBQUcsQ0FBQSxJQUFHLENBQUc7QUFDcEQsQUFBSSxJQUFBLENBQUEsSUFBRyxFQUFJLEtBQUcsQ0FBQztBQUNmLEFBQUksSUFBQSxDQUFBLElBQUcsRUFBSSxDQUFBLElBQUcsSUFBSSxBQUFDLENBQUMsTUFBSyxDQUFDLENBQUM7QUFDM0IsS0FBSSxJQUFHLENBQUc7QUFDTixNQUFJO0FBQ0EsQUFBSSxRQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsSUFBRyxJQUFJLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQztBQUN0QixTQUFJLENBQUMsQ0FBQSxDQUFHO0FBQ0osUUFBQSxFQUFJLENBQUEsSUFBRyxJQUFJLEFBQUMsQ0FBQyxJQUFHLENBQUcsSUFBSSxTQUFPLEFBQUMsQ0FBQyxVQUFTLEVBQUksS0FBRyxDQUFBLENBQUksSUFBRSxDQUFDLENBQUMsQ0FBQztNQUM3RDtBQUFBLEFBQ0EsZ0JBQVUsU0FBUyxBQUFDLENBQUMsQ0FBQSxLQUFLLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQ0EsT0FBTSxDQUFBLENBQUc7QUFDTCxnQkFBVSxLQUFLLEFBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUN2QjtBQUFBLEVBQ0osS0FDSztBQUNELGNBQVUsU0FBUyxBQUFDLENBQUMsSUFBRyxDQUFDLENBQUM7RUFDOUI7QUFBQSxBQUNKLENBQUM7QUFFRCxLQUFLLFFBQVEsRUFBSSxXQUFTLENBQUM7QUFDM0IiLCJmaWxlIjoiYWN0aXZpdGllcy9leHByZXNzaW9uLmpzIiwic291cmNlUm9vdCI6ImxpYi9lczYiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgLVcwNTQqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBBY3Rpdml0eSA9IHJlcXVpcmUoXCIuL2FjdGl2aXR5XCIpO1xubGV0IHV0aWwgPSByZXF1aXJlKFwidXRpbFwiKTtcblxuZnVuY3Rpb24gRXhwcmVzc2lvbigpIHtcbiAgICBBY3Rpdml0eS5jYWxsKHRoaXMpO1xuICAgIHRoaXMuZXhwciA9IG51bGw7XG4gICAgdGhpcy5ub25TZXJpYWxpemVkUHJvcGVydGllcy5hZGQoXCJfZlwiKTtcbn1cblxudXRpbC5pbmhlcml0cyhFeHByZXNzaW9uLCBBY3Rpdml0eSk7XG5cbkV4cHJlc3Npb24ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uIChjYWxsQ29udGV4dCwgYXJncykge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICBsZXQgZXhwciA9IHNlbGYuZ2V0KFwiZXhwclwiKTtcbiAgICBpZiAoZXhwcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGYgPSBzZWxmLmdldChcIl9mXCIpO1xuICAgICAgICAgICAgaWYgKCFmKSB7XG4gICAgICAgICAgICAgICAgZiA9IHNlbGYuc2V0KFwiX2ZcIiwgbmV3IEZ1bmN0aW9uKFwicmV0dXJuIChcIiArIGV4cHIgKyBcIilcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsbENvbnRleHQuY29tcGxldGUoZi5jYWxsKHNlbGYpKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICBjYWxsQ29udGV4dC5mYWlsKGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjYWxsQ29udGV4dC5jb21wbGV0ZShudWxsKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV4cHJlc3Npb247XG4iXX0=