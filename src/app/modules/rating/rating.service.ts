import { Rating, IRating } from './rating.model';
import { Profile } from '../profile/profile.model';
import { Task } from '../task/task.model';
import { Project } from '../project/project.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createRating = async (data: {
  fromUserId: string;
  toUserId: string;
  entityType: 'task' | 'project';
  entityId: string;
  rating: number;
  comment?: string;
}): Promise<IRating> => {
  const { fromUserId, toUserId, entityType, entityId, rating, comment } = data;

  // Validate: Cannot rate yourself
  if (fromUserId === toUserId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot rate yourself');
  }

  // Validate: Check if entity exists and is completed
  if (entityType === 'task') {
    const task = await Task.findById(entityId);
    if (!task) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }
    if (task.status !== 'completed') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Can only rate completed tasks');
    }
  } else if (entityType === 'project') {
    const project = await Project.findById(entityId);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    if (project.status !== 'completed') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Can only rate completed projects');
    }
  }

  // Check if already rated
  const existingRating = await Rating.findOne({
    fromUserId,
    'relatedEntity.entityType': entityType,
    'relatedEntity.entityId': entityId,
  });

  if (existingRating) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already rated this ' + entityType);
  }

  // Create rating
  const newRating = await Rating.create({
    fromUserId,
    toUserId,
    relatedEntity: {
      entityType,
      entityId,
    },
    rating,
    comment,
  });

  // Update profile rating
  await updateProfileRating(toUserId);

  return newRating;
};

const getUserRatings = async (
  userId: string,
  options: {
    limit?: number;
    skip?: number;
  } = {}
): Promise<{ ratings: IRating[]; total: number }> => {
  const { limit = 50, skip = 0 } = options;

  const ratings = await Rating.find({ toUserId: userId })
    .populate('fromUserId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await Rating.countDocuments({ toUserId: userId });

  return { ratings: ratings as IRating[], total };
};

const getRatingsGivenByUser = async (userId: string): Promise<IRating[]> => {
  const ratings = await Rating.find({ fromUserId: userId })
    .populate('toUserId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return ratings as IRating[];
};

const getAverageRating = async (userId: string): Promise<number> => {
  const result = await Rating.aggregate([
    { $match: { toUserId: userId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  return result.length > 0 ? parseFloat(result[0].averageRating.toFixed(1)) : 0;
};

const getRatingsBreakdown = async (
  userId: string
): Promise<{ 5: number; 4: number; 3: number; 2: number; 1: number }> => {
  const ratings = await Rating.find({ toUserId: userId }).select('rating').lean();

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  ratings.forEach((r: any) => {
    breakdown[r.rating as keyof typeof breakdown]++;
  });

  return breakdown;
};

const updateProfileRating = async (userId: string): Promise<void> => {
  const averageRating = await getAverageRating(userId);
  const totalRatings = await Rating.countDocuments({ toUserId: userId });
  const ratingsBreakdown = await getRatingsBreakdown(userId);

  await Profile.findByIdAndUpdate(userId, {
    averageRating,
    totalRatings,
    ratingsBreakdown,
  });
};

const hasUserRated = async (
  fromUserId: string,
  entityType: 'task' | 'project',
  entityId: string
): Promise<boolean> => {
  const rating = await Rating.findOne({
    fromUserId,
    'relatedEntity.entityType': entityType,
    'relatedEntity.entityId': entityId,
  });

  return !!rating;
};

export const RatingService = {
  createRating,
  getUserRatings,
  getRatingsGivenByUser,
  getAverageRating,
  getRatingsBreakdown,
  updateProfileRating,
  hasUserRated,
};
