var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/shortly.sqlite')
  },
  useNullAsDefault: true
});
var db = require('bookshelf')(knex);

db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('baseUrl', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table urls', table);
    });
  }
});

db.knex.schema.hasTable('clicks').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('clicks', function (click) {
      click.increments('id').primary();
      click.integer('linkId');
      click.timestamps();
    }).then(function (table) {
      console.log('Created Table clicks', table);
    });
  }
});

/************************************************************/
// Add additional schema definitions below
/************************************************************/
db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.text('name');
      user.text('password');
    }).then(function (table) {
      console.log('Created Table users', table);
    });
  }
});

// db.knex.schema.hasTable('users_urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users_urls', function (pair) {
//       pair.increments('id').primary();
//       pair.text('userid').references(users.id);
//       pair.text('urlid').references(urls.id);
//     }).then(function (table) {
//       console.log('Created Table users_urls', table);
//     });
//   }
// });

module.exports = db;
