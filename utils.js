import { useRef, useEffect } from 'react';

export const SECTION_LIST_MOCK_DATA = [
  {
    title: 'Appetizers',
    data: [
      {
        id: '1',
        title: 'Pasta',
        price: '10',
      },
      {
        id: '3',
        title: 'Pizza',
        price: '8',
      },
    ],
  },
  {
    title: 'Salads',
    data: [
      {
        id: '2',
        title: 'Caesar',
        price: '2',
      },
      {
        id: '4',
        title: 'Greek',
        price: '3',
      },
    ],
  },
];

/**
 * 3. Implement this function to transform the raw data
 * retrieved by the getMenuItems() function inside the database.js file
 * into the data structure a SectionList component expects as its "sections" prop.
 * @see https://reactnative.dev/docs/sectionlist as a reference
 */
export function getSectionListData(data) {
  // SECTION_LIST_MOCK_DATA is an example of the data structure you need to return from this function.
  // The title of each section should be the category.
  // The data property should contain an array of menu items. 
  // Each item has the following properties: "id", "title" and "price"
  if (!Array.isArray(data)) {
    // If data is not an array, log an error and return an empty array
    console.error('Invalid data type for getSectionListData, expected an array:', data);
    return [];
  }

  const groupedByCategory = data.reduce((acc, item) => {
    // Ensure the category exists on the accumulator and is an array
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ id: item.id.toString(), title: item.title, price: item.price.toString() });
    return acc;
  }, {});

  return Object.keys(groupedByCategory).map(category => ({
    title: category,
    data: groupedByCategory[category]
  }));
  // return SECTION_LIST_MOCK_DATA;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
