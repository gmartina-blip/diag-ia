import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ozkvwnlvqzletaxnmvsp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a3Z3bmx2cXpsZXRheG5tdnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTg4NDIsImV4cCI6MjA5MTY3NDg0Mn0.4w715wJDEduE2jrKq1osFTOl_vF-3K3A95RRp-MM1wU'

export const supabase = createClient(supabaseUrl, supabaseKey)
