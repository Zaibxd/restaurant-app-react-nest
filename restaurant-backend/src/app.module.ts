import { Module } from '@nestjs/common';
import { DishesModule } from './dishes/dishes.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
    }),
    DishesModule,
    OrdersModule, 
    UsersModule, 
    SupabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
