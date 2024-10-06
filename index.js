const { HyWaBot, HytechMessages } = require('wabot-ai');
const { antiLink, extractImage } = require('./utils/group');
const processCommand = require('./utils/private');
require('dotenv').config();

const data = {
    phoneNumber: process.env.PHONE,
    sessionId: 'session',
    useStore: true,
};

const bot = new HyWaBot(data);
bot.start()
    .then(sock => {
        sock.ev.on('messages.upsert', async chatUpdate => {
            try {
                let m = chatUpdate.messages[0];
                if (!m.message) return;

                const result = await HytechMessages(m);
                console.log('Processed message:', result);
                
                if (!result || !result.chatsFrom) {
                    console.warn('Result tidak valid:', result);
                    return;
                }

                let cmd;
                if (result.chatsFrom === 'private') {
                    cmd = result.message;
                } else if (result.chatsFrom === 'group') {
                    cmd = result.participant ? result.participant.message : result.message;
                }

                if (result.chatsFrom === 'group') {
                    const messageDeleted = await antiLink(sock, m, cmd);
                    if (messageDeleted) return;
					await extractImage(sock, m);
                }

                if (cmd) {
                    await processCommand(cmd, result, sock);
                }
				
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });
    })
    .catch(error => {
        console.error('Error starting bot:', error);
    });
