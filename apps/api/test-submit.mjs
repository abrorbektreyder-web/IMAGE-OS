import { client, handle_file } from '@gradio/client';

async function testSubmit() {
  try {
    const app = await client('yisol/IDM-VTON');
    
    console.log('Connecting to submit...');
    const submission = app.submit('/tryon', [
      { background: handle_file('https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png'), layers: [], composite: null },
      handle_file('https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png'),
      "A red bus",
      true,
      false,
      30,
      42
    ]);

    for await (const msg of submission) {
      console.log('Update:', msg.type, msg.stage, msg.message);
      if (msg.type === 'data') {
        console.log('Final Data:', msg.data);
      }
    }
  } catch (err) {
    console.error('Error in submit:', err);
  }
}

testSubmit();
