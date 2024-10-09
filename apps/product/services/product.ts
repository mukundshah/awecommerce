import { and, eq, like, or, SQL } from 'drizzle-orm'
import { db } from '../../../core/db'

import { NewProduct, Product, products } from '../schemas'

interface ProductFilter {
  brandId?: number
  categoryId?: number
  productClassId?: number
  status?: 'Draft' | 'Published'
  search?: string // searches id or name
  isFeatured?: boolean
  isBestSeller?: boolean
}

export const productService = {
  createProduct: async (product: NewProduct) => {
    const result = await db.insert(products).values(product).returning()
    return result[0]
  },

  filterProducts: async (filter: ProductFilter) => {
    const where: SQL[] = []

    if (filter.brandId) {
      where.push(eq(products.brandId, filter.brandId))
    }
    if (filter.categoryId) {
      where.push(eq(products.categoryId, filter.categoryId))
    }
    if (filter.productClassId) {
      where.push(eq(products.productClassId, filter.productClassId))
    }
    if (filter.status) {
      where.push(eq(products.status, filter.status))
    }
    if (filter.isFeatured !== undefined) {
      where.push(eq(products.isFeatured, filter.isFeatured))
    }
    if (filter.isBestSeller !== undefined) {
      where.push(eq(products.isBestSeller, filter.isBestSeller))
    }
    if (filter.search) {
      where.push(
        or(
          like(products.id, `%${filter.search}%`),
          like(products.name, `%${filter.search}%`),
        )!,
      )
    }

    const query = db
      .select()
      .from(products)
      .where(and(...where))

    const result = await query
    return result
  },

  markAsFeatured: async (productId: number) => {
    const result = await db.update(products).set({ isFeatured: true }).where(eq(products.id, productId)).returning()
    return result[0]
  },

  unmarkAsFeatured: async (productId: number) => {
    const result = await db.update(products).set({ isFeatured: false }).where(eq(products.id, productId)).returning()
    return result[0]
  },

  markAsBestSeller: async (productId: number) => {
    const result = await db.update(products).set({ isBestSeller: true }).where(eq(products.id, productId)).returning()
    return result[0]
  },

  unmarkAsBestSeller: async (productId: number) => {
    const result = await db.update(products).set({ isBestSeller: false }).where(eq(products.id, productId)).returning()
    return result[0]
  },
}

