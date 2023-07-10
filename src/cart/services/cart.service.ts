import { Inject, Injectable } from '@nestjs/common';

import {Cart, CartItem, Product} from '../models';
import { Repository } from "typeorm";

@Injectable()
export class CartService {
  constructor(
      @Inject('CART_REPOSITORY')
      private cartRepository: Repository<Cart>,
      @Inject('CART_ITEM_REPOSITORY')
      private cartItemRepository: Repository<CartItem>,
      @Inject('PRODUCT_REPOSITORY')
      private productRepository: Repository<Product>
  ) {
  }

  async findByUserId(userId: string): Promise<Cart> {
    return await this.cartRepository.findOneBy({ userId: userId });
  }

  async createByUserId(userId: string) {
    const userCart = new Cart(userId);

    return await this.cartRepository.save(userCart);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);

    await this.cartItemRepository.delete({ cart: cart });

    items.map(async (i) => {
      i.cart = cart;
    });

    await this.cartItemRepository.save(items);

    return await this.findByUserId(cart.userId);
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.cartRepository.delete({ userId: userId });
  }

}
