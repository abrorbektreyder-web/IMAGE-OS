import { client, handle_file } from '@gradio/client';

async function testSubmit() {
  try {
    const app = await client('levihsu/OOTDiffusion');
    
    console.log('Connecting to OOTDiffusion...');
    const result = await app.predict('/process_hd', [
      handle_file('https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png'),
      handle_file('https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png'),
      1,
      20,
      2,
      -1
    ]);

    console.log('Result:', result.data);
  } catch (err) {
    console.error('Error in predict:', err);
  }
}

testSubmit();
