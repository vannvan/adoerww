import { serve } from 'https://deno.land/std@0.121.0/http/server.ts'

console.log('http://localhost:8200/')
serve((req) => new Response('Hello World\n'), { port: 8200 })
