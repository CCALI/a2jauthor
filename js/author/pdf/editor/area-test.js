import 'steal-mocha';
import { assert } from 'chai';
import {
  IdGenerator,
  getArea,
  fitWithinBoundary,
  trimToBoundary,
  nudgeArea
} from './area';

describe('pdf/editor/area', () => {
  describe('IdGenerator', () => {
    it('should create unique ids', () => {
      const gen = IdGenerator('');
      const len = 10;
      const vals = [];
      for (let i = 0; i < len; i++) {
        const id = gen([]);
        assert(vals.indexOf(id) === -1, 'id should not be a duplicate');
        vals[i] = id;
      }
    });

    it('should prefix all ids', () => {
      const prefix = 'foo-';
      const gen = IdGenerator(prefix);
      const len = 10;
      for (let i = 0; i < len; i++) {
        const id = gen([]);
        assert(id.indexOf(prefix) === 0, 'id start with prefix');
      }
    });

    it('should skip provided existing ids', () => {
      const prefix = 'foo-';
      const firstId = IdGenerator(prefix)([]);
      const existingIds = [firstId];

      const gen = IdGenerator(prefix);
      const newId = gen(existingIds);
      assert(newId !== firstId, 'newId should skip the existing id');
    });
  });

  describe('getArea', () => {
    const point = (x, y) => ({x, y});
    it('should return the area between two points (top-left and bottom-right)', () => {
      const topLeft = point(5, 5);
      const bottomRight = point(25, 25);
      assert.deepEqual(getArea(topLeft, bottomRight), {
        top: 5,
        left: 5,
        width: 20,
        height: 20
      }, 'top-left to bottom-right');

      assert.deepEqual(getArea(bottomRight, topLeft), {
        top: 5,
        left: 5,
        width: 20,
        height: 20
      }, 'bottom-right to top-left');
    });

    it('should return the area between two points (top-right and bottom-left)', () => {
      const topRight = point(25, 5);
      const bottomLeft = point(5, 25);
      assert.deepEqual(getArea(topRight, bottomLeft), {
        top: 5,
        left: 5,
        width: 20,
        height: 20
      }, 'top-right to bottom-left');

      assert.deepEqual(getArea(bottomLeft, topRight), {
        top: 5,
        left: 5,
        width: 20,
        height: 20
      }, 'bottom-left to top-right');
    });
  });

  const area = (left, top, width, height) => ({top, left, width, height});
  describe('fitWithinBoundary', () => {
    it('should return the second area moved within the first area', () => {
      const bounds = area(0, 0, 100, 100);
      const size = 25;

      const topLeftStray = area(-10, -10, size, size);
      assert.deepEqual(
        fitWithinBoundary(bounds, topLeftStray),
        area(0, 0, size, size),
        'top-left stray'
      );

      const topRightStray = area(110, -10, size, size);
      assert.deepEqual(
        fitWithinBoundary(bounds, topRightStray),
        area(75, 0, size, size),
        'top-right stray'
      );

      const bottomLeftStray = area(-10, 110, size, size);
      assert.deepEqual(
        fitWithinBoundary(bounds, bottomLeftStray),
        area(0, 75, size, size),
        'bottom-left stray'
      );

      const bottomRightStray = area(110, 110, size, size);
      assert.deepEqual(
        fitWithinBoundary(bounds, bottomRightStray),
        area(75, 75, size, size),
        'bottom-right stray'
      );
    });
  });

  describe('trimToBoundary', () => {
    it('should return the second area cut within the first area', () => {
      const bounds = area(0, 0, 100, 100);
      const bottomRightStray = area(90, 90, 20, 20);
      assert.deepEqual(
        trimToBoundary(bounds, bottomRightStray),
        area(90, 90, 10, 10),
        'bottom-right stray'
      );
    });
  });

  describe('nudgeArea(area, direction, delta)', () => {
    it('should move the {area} in {direction} by {delta}', () => {
      const size = 10;
      const box = (x, y) => area(x, y, size, size);
      const source = box(0, 0);
      const directions = ['up', 'down', 'left', 'right'];
      const getDestinations = delta => [
        box(0, -delta),
        box(0, delta),
        box(-delta, 0),
        box(delta, 0)
      ];

      const deltaMax = 5;
      for (let delta = 1; delta < deltaMax; delta++) {
        const destinations = getDestinations(delta);
        for (let i = 0; i < directions.length; i++) {
          const direction = directions[i];
          assert.deepEqual(
            nudgeArea(source, direction, delta),
            destinations[i],
            `Direction "${direction}" with delta ${delta}`
          );
        }
      }
    });
  });
});
