import { DataSource } from 'typeorm';
import {Cart, CartItem, Product} from './models';

export const cartProviders = [
    {
        provide: 'CART_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Cart),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'CART_ITEM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CartItem),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'PRODUCT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
        inject: ['DATA_SOURCE'],
    },
];