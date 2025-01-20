import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const brands = pgTable('brand', {
  id: serial().primaryKey(),
  name: text().notNull(),
  slug: text().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow(),
})

export const categories = pgTable('category', {
  id: serial().primaryKey(),
  name: text().notNull(),
  slug: text().notNull(),
  parentId: integer().references((): any => categories.id),
  description: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export const productClasses = pgTable('product_class', {
  id: serial().primaryKey(),
  name: text().notNull(),
  slug: text().notNull(),
  description: text(),
  trackStock: boolean().default(true),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export const productStatus = pgEnum('product_status', ['Draft', 'Published'])

export const products = pgTable('product', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  specification: text(),
  brandId: integer().references(() => brands.id),
  categoryId: integer().references(() => categories.id),
  productClassId: integer().references(() => productClasses.id),
  link: text(),
  thumbnail: text(),
  price: numeric({ precision: 100 }),
  discountedPrice: numeric({ precision: 100 }),
  inventoryCost: numeric({ precision: 100 }),
  status: productStatus().default('Draft'),
  stockQuantity: integer().default(0),
  isFeatured: boolean().default(false),
  isBestSeller: boolean().default(false),
  relatedProducts: integer().references((): any => products.id),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export const productImages = pgTable('product_image', {
  id: serial().primaryKey(),
  productId: integer().references(() => products.id),
  imageUrl: text().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})


type BaseEntity = {
  id: number
  createdAt: string
  updatedAt: string
}

export type Product = typeof products.$inferSelect
export type NewProduct = Omit<typeof products.$inferInsert, keyof BaseEntity>
export type UpdateProduct = Partial<NewProduct>

export type NewProductImage = Omit<typeof productImages.$inferInsert, keyof BaseEntity>
export type ProductImage = typeof productImages.$inferSelect
export type UpdateProductImage = Partial<NewProductImage>

export type NewProductClass = Omit<typeof productClasses.$inferInsert, keyof BaseEntity>
export type ProductClass = typeof productClasses.$inferSelect
export type UpdateProductClass = Partial<NewProductClass>

export type NewCategory = Omit<typeof categories.$inferInsert, keyof BaseEntity>
export type Category = typeof categories.$inferSelect
export type UpdateCategory = Partial<NewCategory>

export type NewBrand = Omit<typeof brands.$inferInsert, keyof BaseEntity>
export type Brand = typeof brands.$inferSelect
export type UpdateBrand = Partial<NewBrand>
