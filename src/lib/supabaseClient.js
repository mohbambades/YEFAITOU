import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wovzjfmqjgnfudnvmxgt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdnpqZm1xamduZnVkbnZteGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNDY1MTQsImV4cCI6MjEwMzkyMjUxNH0.2VzrE3cIpCCCCGm1QnzXmQ95YaZp9t1LkaA2HHIiruY";

export const supabase = createClient(supabaseUrl, supabaseKey);
