import { Module } from '@nestjs/common';
import { DishesModule } from './dishes/dishes.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DishesModule, OrdersModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
