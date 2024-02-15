'use client'
import axios from 'axios';

let API_URL ="6986509758:AAGXhRZQswRB14Q9KVCPOsfULvxR0LDMEzc"
let CHAT_ID ="-4051471487"

export default function ContactBlock() {
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const firstName = event.target.first.value;
    const lastName = event.target.last.value;
    const message = event.target.message.value;

    try {
      const response = await axios.post(`https://api.telegram.org/bot${API_URL}/sendMessage`, {
        chat_id: CHAT_ID,
        text: `
Name: ${firstName} ${lastName}
Phone: ${phone}
Email: ${email}
Message: ${message} `,
        });

      event.target.email.value = '';
      event.target.phone.value = '';
      event.target.first.value = '';
      event.target.last.value = '';
      event.target.message.value = '';

      console.log('Telegram API response:', response.data);
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <p className="text-center text-3xl font-bold py-2">Contact us</p>
        <div className="mb-4 flex pt-5">
        <div className="mr-2 w-1/2">
            <label htmlFor="frm-first" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
            <input id="frm-first" type="text" name="first" autoComplete="given-name" required placeholder="Trung"
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="ml-2 w-1/2">
            <label htmlFor="frm-last" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
            <input id="frm-last" type="text" name="last" autoComplete="family-name" required placeholder="Cao"
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        </div>
        <div className="mb-4">
        <label htmlFor="frm-phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
        <input id="frm-phone" type="text" name="phone" autoComplete="tel" required placeholder="0123456789"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-4">
        <label htmlFor="frm-email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input id="frm-email" type="email" name="email" autoComplete="email" required placeholder="caotrung@gmail.com"
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="mb-4">
        <label htmlFor="frm-message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
        <textarea id="frm-message" name="message" placeholder="Message"
            className="shadow appearance-none border rounded-lg w-full h-28 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
        <div className="flex justify-center">
        <button type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        >Submit</button>
        </div>
    </form>
    </div>
  );
}
