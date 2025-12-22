import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UsersService {

  constructor(private readonly supabaseService: SupabaseService){}

  // sign Up 
  async signUp(email: string, password: string, fullName?: string){
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
    })

    if (error) throw new Error(error.message);

    if(fullName && data.user?.id){
      await this.supabaseService.client
      .from("profiles")
      .insert({'id': data.user.id, email, full_name: fullName})
    }

    return data;
  }


  // sign In
  async signIn(email: string, password: string){
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email, 
      password,
    })

    if(error) throw new Error (error.message);

    return data; // contains access_token, refresh_token
  }



  // get user profile
  async getProfile(userId: string) {
    const { data, error } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }


  async getProfileByToken(token: string) {
    const { data: { user }, error } = await this.supabaseService.client.auth.getUser(token);
    if (error || !user)
      throw new UnauthorizedException('Invalid or expired token');
    return this.getProfile(user.id);
  } 

}
