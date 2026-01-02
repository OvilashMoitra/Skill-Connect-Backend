import { Feedback, IFeedback } from './feedback.model';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createFeedback = async (data: IFeedback): Promise<IFeedback> => {
  const result = await Feedback.create(data);

  // Update User Rating
  const user = await User.findById(data.revieweeId);
  if (user) {
    const currentTotal = (user.averageRating || 0) * (user.ratingsCount || 0);
    const newCount = (user.ratingsCount || 0) + 1;
    const newAverage = (currentTotal + data.rating) / newCount;
    
    user.averageRating = parseFloat(newAverage.toFixed(1));
    user.ratingsCount = newCount;
    await user.save();
  }

  return result;
};

const getFeedbacks = async (projectId: string): Promise<IFeedback[]> => {
  const result = await Feedback.find({ projectId })
    .populate('reviewerId', 'name')
    .populate('revieweeId', 'name');
  return result;
};

export const FeedbackService = {
  createFeedback,
  getFeedbacks,
};
