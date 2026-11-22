import { AppError } from '../core-utils/err-util';
import mongoose, { FilterQuery, PipelineStage } from 'mongoose';
import { Db, ReadPreference } from 'mongodb';
import { FILTER_CONSTANTS } from '../core-constants/common.constants';
import { IFilter } from '../../interface/common.interface';

export const getDataByFilter = async <T>(filterQuery: IFilter, basepipeline: PipelineStage[], searchFields: string[], model: mongoose.Model<T>) => getDataWithLookupsAfterFilter(
  filterQuery,
  basepipeline,
  [],
  searchFields,
  model,
  ReadPreference.primary,
);

export const getDataByFilterSecondary = async <T>(filterQuery: IFilter, basepipeline: PipelineStage[], searchFields: string[], model: mongoose.Model<T>) => getDataWithLookupsAfterFilter(
  filterQuery,
  basepipeline,
  [],
  searchFields,
  model,
  ReadPreference.secondaryPreferred,
);

export const runQueryMongoDriverSecondary = async (mongoDB: Db, collectionName: string, basepipeline: PipelineStage[]) => {
  try {

    return await mongoDB.collection(collectionName).aggregate(basepipeline).toArray();

  } catch (error: any) {
    throw new AppError(error.message || 'unknown', { msg: 'Failed to fetch data by filter query', apiName: 'runQueryMongoDriverSecondary', debugValues: { collectionName, basepipeline } });
  }
};

export const getDataWithLookupsAfterFilter = async <T>(
  filterQuery: IFilter,
  basepipeline: PipelineStage[],
  lookupPipeline: any[],
  searchFields: string[],
  model: mongoose.Model<T>,
  readPref: ReadPreference | string = ReadPreference.primary,
) => {
  try {
    const {
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = FILTER_CONSTANTS.page,
      pageSize = FILTER_CONSTANTS.pageSize,
      fromDate = '',
      toDate = '',
    } = filterQuery;

    const pageNumber = Math.max(1, Number(page) || 1);
    const limit = Math.max(1, Number(pageSize) || Number(FILTER_CONSTANTS.pageSize) || 10);
    const skip = (pageNumber - 1) * limit;
    const matchStage: FilterQuery<any> = {};

    if (fromDate && toDate) {
      matchStage.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    if (search && searchFields && searchFields.length > 0) {
      matchStage.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' }, // Case-insensitive search
      }));
    }

    const pipeline: PipelineStage[] = [
      ...basepipeline,
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            ...lookupPipeline,
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const result = await model.aggregate(pipeline).read(readPref as any).exec();

    const data: any[] = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      totalCount,
      totalPages: totalPages,
      currentPage: pageNumber,
      hasPrev: pageNumber > 1,
      hasNext: pageNumber < totalPages,
    };
  } catch (error: any) {
    throw new AppError(error.message || 'unknown', {
      msg: 'Failed to fetch data by filter query',
      apiName: 'getDataWithLookupsAfterFilter',
      debugValues: { filterQuery, searchFields },
    });
  }
};

