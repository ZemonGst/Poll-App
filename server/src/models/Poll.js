import mongoose from "mongoose";

const pollOptionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    options: {
      type: [pollOptionSchema],
      validate: {
        validator: (value) => value.length >= 2,
        message: "Poll must contain at least 2 options",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    pollType: {
      type: String,
      enum: ["single-choice", "multiple-choice"],
      default: "single-choice",
    },
    status: {
      type: String,
      enum: ["active", "expired", "draft"],
      default: "active",
    },
    allowAnonymousVotes: {
      type: Boolean,
      default: false,
    },
    allowMultipleVotes: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      uniqueParticipants: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

pollSchema.index({
  createdBy: 1,
  createdAt: -1,
});

pollSchema.index({
  status: 1,
});

pollSchema.index({
  expiresAt: 1,
});

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;