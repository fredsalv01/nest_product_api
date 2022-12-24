import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Product } from '../entities/product.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async search(text: string) {
    let product: Product;

    product = await this.productModel.findOne({
      name: { $regex: text, $options: 'i' },
    });

    //is mongo id?
    if (!product && isValidObjectId(text)) {
      product = await this.productModel.findById(text);
    }

    // is category?
    if (!product) {
      product = await this.productModel.findOne({
        category: { $regex: text, $options: 'i' },
      });
    }

    // is brand?
    if (!product) {
      product = await this.productModel.findOne({
        brand: { $regex: text, $options: 'i' },
      });
    }

    return {
      text,
    };
  }
}
