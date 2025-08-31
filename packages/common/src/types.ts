import { z } from 'zod'

export const RoleEnum = z.enum(['EDITOR', 'YOUTUBER'])
export const VideoStatusEnum = z.enum(['PENDING', 'APPROVED', 'PUBLISHED', 'REJECTED'])

export const UserSchema = z.object({
  id: z.string().cuid().optional(), // cuid generated
  email: z.string().email(),
  password: z.string().min(6), // add a minimum length for security
  role: RoleEnum,
  createdAt: z.date().optional(), // handled by DB
  updatedAt: z.date().optional(), // handled by DB
})

export const VideoSchema = z.object({
  id: z.string().cuid().optional(), // cuid generated
  title: z.string().min(1),
  description: z.string().optional(),
  s3Key: z.string().min(1), // should be a unique identifier for file, assumed required
  status: VideoStatusEnum.optional().default('PENDING'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),

  authorId: z.string().cuid(), // relation to User
})
