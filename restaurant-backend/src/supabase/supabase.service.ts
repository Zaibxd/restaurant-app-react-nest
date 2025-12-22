import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase : SupabaseClient;

    constructor(private readonly configService : ConfigService){
        const supabaseUrl = this.configService.get<string>("SUPABASE_URL");
        const supabaseServiceKey = this.configService.get<string>("SUPABASE_SERVICE_KEY");
        this.supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    }    

    get client(){
        return this.supabase
    }
}
