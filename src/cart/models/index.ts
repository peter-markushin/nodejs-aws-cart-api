import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Relation, JoinColumn} from 'typeorm';

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn("uuid", { primaryKeyConstraintName: "products_pkey" })
  id: string;
  @Column({length: 200})
  title: string;
  @Column('text')
  description: string;
  @Column("decimal")
  price: number;
}

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn()
  product: Product;
  @Column("int")
  count: number;
  @ManyToOne(() => Cart)
  cart: Relation<Cart>;
}

@Entity()
export class Cart {
  constructor(userId: string) {
    this.userId = userId;
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ length: 50, unique: true })
  userId: string
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { eager: true, cascade: true })
  items: CartItem[];
}
