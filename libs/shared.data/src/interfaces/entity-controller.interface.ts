import { Document } from 'mongoose';
import { EntityService } from './entity-service.interface';

export interface EntityController<T, Resource extends Partial<T>> {
  service: EntityService<T, Resource>;
  /**
   * Get a list of {content-type} entries:
   * GET /{content-type}
   */
  get(): Promise<T[]>;

  /**
   * Get a specific {content-type} entry:
   * GET /{content-type}/:id
   */
  getById(id: string): Promise<T>;

  /**
   * Count {content-type} entries:
   * GET /{content-type}/count
   */
  getCount(): Promise<number>;

  /**
   * Create a {content-type} entry:
   * POST /{content-type}
   */
  create(resource: Resource): Promise<T>;

  /**
   * Delete a {content-type} entry:
   * DELETE	/{content-type}/:id
   */
  delete(id: string): Promise<T>;

  /**
   * Update a {content-type} entry:
   * PUT	/{content-type}/:id
   */
  update(id: string, resource: Resource): Promise<T>;
}
