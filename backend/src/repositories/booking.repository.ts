import { Model, Types } from 'mongoose'
import { IBooking, BookingDocument, BookingStatus } from '../models/booking.model'
import { BookingRepository } from '../interfaces/ibooking.repository'

export class MongooseBookingRepository implements BookingRepository {
  constructor(private readonly _bookingModel: Model<BookingDocument>) {}

  async create(data: Partial<IBooking>): Promise<BookingDocument> {
    const booking = new this._bookingModel(data)
    return booking.save()
  }

  async findByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ items: BookingDocument[]; total: number }> {
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      this._bookingModel
        .find({ userId: new Types.ObjectId(userId) })
        .populate('serviceId', 'title category pricePerDay')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._bookingModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ])
    return { items, total }
  }

  async findByProvider(
    providerId: string,
    page: number,
    limit: number,
  ): Promise<{ items: BookingDocument[]; total: number }> {
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      this._bookingModel
        .find({ providerId: new Types.ObjectId(providerId) })
        .populate('serviceId', 'title category')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._bookingModel.countDocuments({ providerId: new Types.ObjectId(providerId) }),
    ])
    return { items, total }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ items: BookingDocument[]; total: number }> {
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      this._bookingModel
        .find()
        .populate('serviceId', 'title category')
        .populate('userId', 'name email')
        .populate('providerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this._bookingModel.countDocuments(),
    ])
    return { items, total }
  }

  async findActiveByServiceId(serviceId: string): Promise<BookingDocument[]> {
    return this._bookingModel
      .find({
        serviceId: new Types.ObjectId(serviceId),
        status: BookingStatus.CONFIRMED,
      })
      .exec()
  }

  async findById(id: string): Promise<BookingDocument | null> {
    return this._bookingModel.findById(id).exec()
  }

  async cancel(id: string): Promise<BookingDocument | null> {
    return this._bookingModel
      .findByIdAndUpdate(id, { status: BookingStatus.CANCELLED }, { new: true })
      .exec()
  }
}
