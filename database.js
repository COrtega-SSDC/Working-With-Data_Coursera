import * as SQLite from 'expo-sqlite';
import { SECTION_LIST_MOCK_DATA } from './utils';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        console.log('Retrieved items from DB:', rows._array);
        resolve(rows._array || []); // Ensure an array is returned
      },
      (_, error) => {
        console.error("Error in getMenuItems:", error);
        reject(error); // Make sure to handle the error
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      menuItems.forEach(item => {
        tx.executeSql(
          'insert into menuitems (uuid, title, price, category) values (?, ?, ?, ?)',
          [item.uuid, item.title, item.price, item.category],
          () => {
            console.log(`Item ${item.uuid} saved to the database`);
          },
          (_, error) => {
            console.error('Error saving menu item to the database:', error);
            reject(error);
          }
        );
      });
    },
    (error) => {
      console.error('Transaction error:', error);
      reject(error);
    },
    () => {
      console.log('All menu items saved to the database.');
      resolve();
    });
  });
}

/**
 * 4. Implement a transaction that executes a SQL statement to filter the menu by 2 criteria:
 * a query string and a list of categories.
 *
 * The query string should be matched against the menu item titles to see if it's a substring.
 * For example, if there are 4 items in the database with titles: 'pizza, 'pasta', 'french fries' and 'salad'
 * the query 'a' should return 'pizza' 'pasta' and 'salad', but not 'french fries'
 * since the latter does not contain any 'a' substring anywhere in the sequence of characters.
 *
 * The activeCategories parameter represents an array of selected 'categories' from the filter component
 * All results should belong to an active category to be retrieved.
 * For instance, if 'pizza' and 'pasta' belong to the 'Main Dishes' category and 'french fries' and 'salad' to the 'Sides' category,
 * a value of ['Main Dishes'] for active categories should return  only'pizza' and 'pasta'
 *
 * Finally, the SQL statement must support filtering by both criteria at the same time.
 * That means if the query is 'a' and the active category 'Main Dishes', the SQL statement should return only 'pizza' and 'pasta'
 * 'french fries' is excluded because it's part of a different category and 'salad' is excluded due to the same reason,
 * even though the query 'a' it's a substring of 'salad', so the combination of the two filters should be linked with the AND keyword
 *
 */
export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    // Construct the SQL query with placeholders for parameters
    let sql = 'SELECT * FROM menuitems WHERE title LIKE ?';
    let params = [`%${query}%`]; // '%' is a wildcard in SQL LIKE

    // If there are active categories to filter by
    if (activeCategories.length > 0) {
      sql += ' AND category IN (' + activeCategories.map(() => '?').join(',') + ')';
      params = params.concat(activeCategories);
    }

    // Execute the transaction
    db.transaction((tx) => {
      tx.executeSql(sql, params, (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          console.error('Error filtering menu items:', error);
          reject(error);
        }
      );
    });
  });
}
