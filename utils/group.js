const urlRegex = /(\b(https?|ftp|ftps|http|file):\/\/([A-Z0-9.-]+(\.[A-Z]{2,})?)(:[0-9]{1,5})?(\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*)?)/ig;

let antilinkEnabled = false;

async function antiLink(sock, m, cmd) {
    if (cmd.startsWith('.antilink true')) {
        antilinkEnabled = true;
        await sock.sendMessage(m.key.remoteJid, { text: 'AntiLink has been activated.' });
        return false;
    } else if (cmd.startsWith('.antilink false')) {
        antilinkEnabled = false;
        await sock.sendMessage(m.key.remoteJid, { text: 'AntiLink has been deactivated.' });
        return false;
    }

    if (antilinkEnabled) {
        const messageText = m.message?.conversation || m.message?.extendedTextMessage?.text;

        if (messageText && urlRegex.test(messageText)) {
            await sock.sendMessage(m.key.remoteJid, { delete: m.key });
            return true;
        }
    }
    return false;
}

module.exports = {
    antiLink
};
