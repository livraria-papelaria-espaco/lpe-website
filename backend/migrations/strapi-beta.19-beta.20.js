var models = {
  Category: {
    collection: 'categories',
    files: {},
  },
  HomePage: {
    collection: 'home_pages',
    files: {},
  },
  Newsroom: {
    collection: 'newsrooms',
    files: {},
  },
  Order: {
    collection: 'orders',
    files: {},
  },
  PrivacyPolicy: {
    collection: 'privacy_policies',
    files: {},
  },
  ProductHighlights: {
    collection: 'product_highlights',
    files: {},
  },
  Product: {
    collection: 'product',
    files: {
      images: 'multiple',
    },
  },
  TermsOfService: {
    collection: 'terms_of_services',
    files: {},
  },
  UploadFile: {
    collection: 'upload_file',
    files: {},
  },
  UsersPermissionsPermission: {
    collection: 'users-permissions_permission',
    files: {},
  },
  UsersPermissionsRole: {
    collection: 'users-permissions_role',
    files: {},
  },
  UsersPermissionsUser: {
    collection: 'users-permissions_user',
    files: {},
  },
  ComponentBookstoreBookInfo: {
    collection: 'components_meta_book_infos',
    files: {},
  },
  ComponentCheckoutAddress: {
    collection: 'components_checkout_addresses',
    files: {},
  },
  ComponentHighlightProductList: {
    collection: 'components_highlight_product_lists',
    files: {},
  },
  ComponentHighlightProductWithDescription: {
    collection: 'components_highlight_product_with_descriptions',
    files: {},
  },
  ComponentHighlightTop10: {
    collection: 'components_highlight_top_10_s',
    files: {},
  },
};

for (var i in models) {
  var model = models[i];
  var update = {};
  var keyCount = 0;

  for (var key in model.files) {
    keyCount += 1;
    update[key] = '';
  }

  if (keyCount > 0) {
    db.getCollection(model.collection).update({}, { $unset: update }, { multi: true });
  }
}

var fileCursor = db.getCollection('upload_file').find({});

while (fileCursor.hasNext()) {
  var el = fileCursor.next();
  el.related.forEach(function (fileRef) {
    var model = models[fileRef.kind];

    if (!model) {
      return;
    }

    var fieldType = model.files && model.files[fileRef.field];

    // stop if the file points to a field the user didn't specify
    if (!fieldType) {
      return;
    }

    if (fieldType === 'single') {
      db.getCollection(model.collection).updateOne(
        { _id: fileRef.ref },
        { $set: { [fileRef.field]: el._id } }
      );
    } else if (fieldType === 'multiple') {
      db.getCollection(model.collection).updateOne(
        { _id: fileRef.ref },
        { $push: { [fileRef.field]: el._id } }
      );
    }
  });
}
