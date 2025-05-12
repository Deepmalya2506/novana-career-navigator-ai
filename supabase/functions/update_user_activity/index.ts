
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get the authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get request data
    const { userId, groupId } = await req.json();
    
    if (!userId || !groupId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Get user's current stats
    const { data: userData, error: userError } = await supabaseClient
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 means not found
      throw userError;
    }

    // Get message count
    const { count: messageCount, error: messageError } = await supabaseClient
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (messageError) {
      throw messageError;
    }

    // Get group count
    const { count: groupCount, error: groupError } = await supabaseClient
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (groupError) {
      throw groupError;
    }

    // Calculate points: 5 points per message, 10 points per group
    const activityPoints = (messageCount || 0) * 5 + (groupCount || 0) * 10;

    // Insert or update user activity
    const { data, error } = await supabaseClient
      .from('user_activity')
      .upsert({
        user_id: userId,
        messages_sent: messageCount || 0,
        groups_joined: groupCount || 0,
        last_active: new Date().toISOString(),
        activity_points: activityPoints,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
