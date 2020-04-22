var cursor = db.getCollection('product').find({});

while (cursor.hasNext()) {
  var el = cursor.next();

  db.getCollection('product').updateOne({ _id: el._id }, { $set: { lastQuantity: el.quantity } });
}
