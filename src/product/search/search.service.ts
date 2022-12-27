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
    text = text.trim().toLowerCase();
    let product: Product[];

    product = await this.productModel.find({
      slug: { $regex: text, $options: 'i' },
    });

    // is category?
    if (!product) {
      product = await this.productModel.find({
        'category.slug': { $regex: text, $options: 'i' },
      });
    }

    // is brand?
    if (!product) {
      product = await this.productModel.find({
        'brand.slug': { $regex: text, $options: 'i' },
      });
    }

    return {
      product,
    };
  }
}
