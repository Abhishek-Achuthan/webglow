import mongoose, { HydratedDocument, Types } from 'mongoose'

export type BookingDocument = HydratedDocument<IBooking>

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface IBooking {
  userId: Types.ObjectId
  serviceId: Types.ObjectId
  providerId: Types.ObjectId
  startDate: Date
  endDate: Date
  numberOfDays: number
  pricePerDay: number
  totalAmount: number
  status: BookingStatus
  createdAt: Date
  updatedAt: Date
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderService', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.CONFIRMED,
    },
  },
  { timestamps: true },
)

export const BookingModel = mongoose.model<IBooking, mongoose.Model<BookingDocument>>('Booking', bookingSchema)
