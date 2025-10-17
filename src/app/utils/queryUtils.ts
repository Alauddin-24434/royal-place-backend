import { Model, Document, PipelineStage } from "mongoose";

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  select?: string | Record<string, 1 | 0>;
  search?: { fields: string[]; value: string };
  filters?: Record<string, any>;
  dateRange?: { field: string; start?: Date; end?: Date };
  lookup?: PipelineStage.Lookup[];
}

/**
 * Convert select string "name email" to object { name: 1, email: 1 }
 */
const buildProject = (select?: string | Record<string, 1 | 0>) => {
  if (!select) return undefined;
  if (typeof select === "string") {
    return select
      .split(" ")
      .filter(Boolean)
      .reduce((acc: Record<string, 1>, field) => {
        acc[field] = 1;
        return acc;
      }, {});
  }
  return select;
};

/**
 * Universal query utility
 */
export const universalQuery = async <T extends Document>(
  model: Model<T>,
  options: QueryOptions
) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select,
    search,
    filters = {},
    dateRange,
    lookup = [],
  } = options;

  const skip = (page - 1) * limit;

  const match: Record<string, any> = { ...filters };

  // Search term
  if (search?.value && search.fields.length) {
    match.$or = search.fields.map((field) => ({
      [field]: { $regex: search.value, $options: "i" },
    }));
  }

  // Date range filter
  if (dateRange?.field) {
    const range: any = {};
    if (dateRange.start) range.$gte = dateRange.start;
    if (dateRange.end) range.$lte = dateRange.end;
    if (Object.keys(range).length) match[dateRange.field] = range;
  }

  // Aggregation pipeline
  const pipeline: PipelineStage[] = [{ $match: match }];

  // Add lookups if any
  if (lookup.length) pipeline.push(...lookup);

  // Pagination + total count using $facet
  const projectStage = buildProject(select);

  pipeline.push({
    $facet: {
      data: [
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        ...(projectStage ? [{ $project: projectStage }] : []),
      ],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await model.aggregate(pipeline);

  return {
    meta: {
      total: result[0]?.totalCount[0]?.count || 0,
      page,
      limit,
    },
    data: result[0]?.data || [],
  };
};
