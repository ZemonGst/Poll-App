import axios from 'axios';

async function test() {
  try {
    const res = await axios.get('http://localhost:8000/api/polls');
    console.log(res.data);
  } catch (e) {
    console.error(e.message);
  }
}
test();
