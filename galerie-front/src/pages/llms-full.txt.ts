import type { APIRoute } from 'astro';
import { loadLlmsData } from '../lib/llms-data';
import { buildLlmsFullTxt } from '../lib/llms';

export const GET: APIRoute = async ({ site }) =>
  new Response(buildLlmsFullTxt(await loadLlmsData(site)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
