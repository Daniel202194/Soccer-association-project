const cloneArray = require('./cloneArray');

test('properly clones array', () => {
  expect(cloneArray([1,2,3])).toEqual([1,2,3]);
  expect(cloneArray([1,2,3])).not.toBe([1,2,3]);
});