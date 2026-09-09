import mongoose, { HydratedDocument, Types } from 'mongoose'
import { PROVIDER_CATEGORIES } from '../constants/provider-categories.constant'

export type ProviderServiceDocument = HydratedDocument<IProviderService>

export interface IAvailability {
  startDate: Date
  endDate: Date
}

export interface ILocation {
  type: string
  coordinates: number[]
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface IProviderService {
  title: string
  providerId: Types.ObjectId
  category: string
  pricePerDay: number
  description: string
  location: ILocation
  contact?: string
  availability: IAvailability[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const providerServiceSchema = new mongoose.Schema<IProviderService>(
  {
    title: { type: String, required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true, enum: PROVIDER_CATEGORIES },
    pricePerDay: { type: Number, required: true },
    description: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: { type: [Number], required: true },
      address: String,
      city: String,
      state: String,
      zipCode: String,
    },
    contact: String,
    availability: [{ startDate: Date, endDate: Date }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

providerServiceSchema.index({ 'location': '2dsphere' })

export const ProviderServiceModel = mongoose.model<IProviderService, mongoose.Model<ProviderServiceDocument>>('ProviderService', providerServiceSchema)
