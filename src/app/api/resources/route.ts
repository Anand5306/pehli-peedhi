import { NextResponse } from 'next/server';
import { SAMPLE_RESOURCES } from '../../../data/mockData';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          ok: true,
          source: 'supabase_postgres',
          count: data.length,
          resources: data.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            eligibility: item.eligibility,
            deadline: item.deadline,
            amountOrBenefit: item.amount_or_benefit,
            officialLink: item.official_link,
            featuredTag: item.featured_tag
          }))
        });
      }
    }
  } catch (err) {
    console.warn('Supabase query error, falling back to mock resources:', err);
  }

  return NextResponse.json({
    ok: true,
    source: 'fallback_mock',
    count: SAMPLE_RESOURCES.length,
    resources: SAMPLE_RESOURCES
  });
}
