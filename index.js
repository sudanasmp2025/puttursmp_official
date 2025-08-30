const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

let baseUsername = 'puttursmp_official';
let botInstance = null;
let reconnecting = false;

function createBot() {
  if (botInstance || reconnecting) return;

  reconnecting = false;

  const bot = mineflayer.createBot({
    host: 'puttur_smp.aternos.me',
    port: 48940,
    username: baseUsername,
    version: '1.16.5',
  });

  botInstance = bot;

  bot.on('spawn', () => {
    bot.chat('/register aagop04');
    setTimeout(() => bot.chat('/login aagop04'), 1000);
    setTimeout(() => bot.chat('/tp 0 64 0'), 2000);

    // ✅ Apply regeneration effect every time it joins
    setTimeout(() => {
      bot.chat(`/effect give puttursmp_official minecraft:regeneration 10800 1`);
      console.log("Applied regeneration effect for 3 hours.");
    }, 3000);

    startHumanLikeBehavior();
    scheduleRandomDisconnect();
  });

  function startHumanLikeBehavior() {
    const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak'];

    function moveRandomly() {
      const action = actions[Math.floor(Math.random() * actions.length)];
      bot.setControlState(action, true);
      setTimeout(() => {
        bot.setControlState(action, false);
        const delay = 1000 + Math.random() * 6000;
        setTimeout(moveRandomly, delay);
      }, 300 + Math.random() * 1000);
    }

    moveRandomly();
  }

  function scheduleRandomDisconnect() {
    const minutes = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
    console.log(`Next disconnect scheduled in ${minutes} minutes.`);
    setTimeout(() => {
      console.log("Random disconnecting...");
      bot.quit();
    }, minutes * 60 * 1000);
  }

  bot.on('end', () => {
    botInstance = null;
    if (!reconnecting) {
      const delay = Math.floor(Math.random() * 21 + 10) * 1000;
      console.log(`Bot disconnected. Reconnecting in ${delay / 1000} seconds...`);
      setTimeout(createBot, delay);
    }
  });

  bot.on('error', console.log);
}

createBot();
