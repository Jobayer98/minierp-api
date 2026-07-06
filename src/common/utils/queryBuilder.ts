import { Model, Document } from 'mongoose';

interface QueryOptions {
  searchableFields?: string[];
  filterableFields?: string[];
  defaultSort?: string;
  defaultLimit?: number;
  baseFilter?: Record<string, unknown>;
}

export interface ParsedQuery {
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  [key: string]: string | undefined;
}

export const buildQuery = async <T extends Document>(
  model: Model<T>,
  rawQuery: ParsedQuery,
  options: QueryOptions = {},
) => {
  const {
    searchableFields = [],
    filterableFields = [],
    defaultSort = '-createdAt',
    defaultLimit = 10,
    baseFilter = {},
  } = options;

  const page = Math.max(1, parseInt(rawQuery.page ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(rawQuery.limit ?? String(defaultLimit), 10)));
  const skip = (page - 1) * limit;
  const sortBy = rawQuery.sortBy ?? defaultSort;

  const filter: Record<string, unknown> = { ...baseFilter };

  if (rawQuery.search && searchableFields.length > 0) {
    filter.$or = searchableFields.map((field) => ({
      [field]: { $regex: rawQuery.search, $options: 'i' },
    }));
  }

  for (const field of filterableFields) {
    if (rawQuery[field] !== undefined) {
      filter[field] = rawQuery[field];
    }
  }

  const [data, total] = await Promise.all([
    model.find(filter).sort(sortBy).skip(skip).limit(limit).lean(),
    model.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
