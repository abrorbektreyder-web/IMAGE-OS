import { client } from '@gradio/client';

async function checkApi() {
  const app = await client('Nymbo/Virtual-Try-On');
  const info = await app.view_api();
  console.log(JSON.stringify(info, null, 2));
}

checkApi().catch(console.error);
