var cursor = db.getCollection('product').find({});

while (cursor.hasNext()) {
  var el = cursor.next();

  if (!el.bookInfo) continue;

  el.bookInfo.forEach(function (bookInfoRef) {
    var ref = bookInfoRef.ref;

    var bookInfo = db.getCollection('components_meta_book_infos').findOne({ _id: ref });

    db.getCollection('product').updateOne(
      { _id: el._id },
      {
        $set: {
          bookAuthor: bookInfo.author,
          bookEdition: bookInfo.edition,
          bookPublisher: bookInfo.publisher,
          bookPages: bookInfo.pages,
          publishedDate: bookInfo.publishedDate,
          language: bookInfo.language,
        },
        $unset: { bookInfoSearch: '', bookInfo: '' },
      }
    );
  });
}

db.getCollection('components_meta_book_infos').drop();
