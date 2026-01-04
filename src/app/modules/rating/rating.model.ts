import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  relatedEntity: {
    entityType: 'task' | 'project';
    entityId: mongoose.Types.ObjectId;
  };
  rating: number;
  comment?: string;
  createdAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['task', 'project'],
        required: true,
      },
      entityId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate ratings
RatingSchema.index(
  { fromUserId: 1, 'relatedEntity.entityType': 1, 'relatedEntity.entityId': 1 },
  { unique: true }
);

// Index for efficient querying
RatingSchema.index({ toUserId: 1, createdAt: -1 });

export const Rating = mongoose.model<IRating>('Rating', RatingSchema);
