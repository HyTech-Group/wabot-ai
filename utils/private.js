require('dotenv').config();
const { HytechHandle, HytechHandleGemini } = require('wabot-ai');

async function processCommand(cmd, result, sock) {
    try {
        if (cmd.startsWith(process.env.PREFIX_OPENAI)) {
            const messageToProcess = cmd.replace(process.env.PREFIX_OPENAI, '').trim();
            const response = await HytechHandle(messageToProcess);
            await sock.sendMessage(result.remoteJid, { 
                text: `${response}`
            });
        } else if (cmd.startsWith(process.env.PREFIX_GEMINI)) {
            const messageToProcess = cmd.replace(process.env.PREFIX_GEMINI, '').trim();
            const response = await HytechHandleGemini(messageToProcess);
            await sock.sendMessage(result.remoteJid, { 
                text: `${response}`
            });
        } else if (cmd.startsWith('.menu')) {
            await sock.sendMessage(result.remoteJid, {
                text: `*Whastapp Bot*

- *.openai* _<pertanyaan>_
- *.gemini* _<pertanyaan>_
- *.antilink* _<true/false>_`
            });
        }
    } catch (error) {
        console.error('Error processing command:', error);
    }
}

module.exports = processCommand;
