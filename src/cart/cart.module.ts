import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { cartProviders } from './cart.providers';

import { CartService } from './services';
import { DatabaseModule } from "../database.module";


@Module({
  imports: [ OrderModule, DatabaseModule ],
  providers: [ ...cartProviders, CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
