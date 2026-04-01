import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateMenuForm } from '../components/MenuFormModal';
import type { MenuItemRequest } from '@shared/types';

// PBT-07: Domain-specific generator for valid MenuItemRequest
const validMenuItemRequestArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  price: fc.integer({ min: 0, max: 100000 }),
  description: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
  categoryId: fc.integer({ min: 1, max: 100 }),
  imageUrl: fc.option(fc.webUrl(), { nil: undefined }),
  displayOrder: fc.option(fc.nat({ max: 100 }), { nil: undefined }),
});

describe('Menu form validation - PBT', () => {
  // PBT-03: Invariant - valid inputs produce no errors
  it('valid MenuItemRequest produces no validation errors', () => {
    fc.assert(
      fc.property(validMenuItemRequestArb, (data) => {
        const errors = validateMenuForm(data);
        expect(Object.keys(errors).length).toBe(0);
      }),
      { numRuns: 200, seed: 42 }
    );
  });

  // PBT-03: Invariant - empty name always produces error
  it('empty name always produces name error', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.constant(''),
          price: fc.integer({ min: 0, max: 100000 }),
          categoryId: fc.integer({ min: 1, max: 100 }),
        }),
        (data) => {
          const errors = validateMenuForm(data as MenuItemRequest);
          expect(errors.name).toBeDefined();
        }
      ),
      { numRuns: 50, seed: 42 }
    );
  });

  // PBT-03: Invariant - negative price always produces error
  it('negative price always produces price error', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          price: fc.integer({ min: -100000, max: -1 }),
          categoryId: fc.integer({ min: 1, max: 100 }),
        }),
        (data) => {
          const errors = validateMenuForm(data as MenuItemRequest);
          expect(errors.price).toBeDefined();
        }
      ),
      { numRuns: 50, seed: 42 }
    );
  });
});
