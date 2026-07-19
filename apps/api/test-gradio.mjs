import { client } from '@gradio/client';

async function checkApi() {
  const app = await client('yisol/IDM-VTON');
  const info = await app.view_api();
  console.log(JSON.stringify(info.named_endpoints['/tryon'].parameters, null, 2));
}

checkApi().catch(console.error);
