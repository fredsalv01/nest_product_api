import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../entities/product.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async search(text: string) {
    const limit = 5;
    const page = 1;
    const offset = (page - 1) * limit;

    text = text.trim().toLowerCase();
    let product: Product[];

    product = await this.productModel
      .find({
        slug: { $regex: text, $options: 'i' },
      })
      .skip(offset)
      .limit(limit)
      .sort({ _id: 1 })
      .select('-__v');

    // is category?
    if (!product) {
      product = await this.productModel
        .find({
          'category.slug': { $regex: text, $options: 'i' },
        })
        .skip(offset)
        .limit(limit)
        .sort({ _id: 1 })
        .select('-__v');
    }

    // is brand?
    if (!product) {
      product = await this.productModel
        .find({
          'brand.slug': { $regex: text, $options: 'i' },
        })
        .skip(offset)
        .limit(limit)
        .sort({ _id: 1 })
        .select('-__v');
    }

    return {
      total: product.length,
      page,
      limit,
      data: product,
    };
  }
}
