const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const Vec3 = require('vec3');

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Uptime Robot is pinging...'));

function startBot() {
  const bot = mineflayer.createBot({
    host: 'for_fun4343.aternos.me',
    port: 22915,
    username: 'roze',
    auth: 'offline'
  });

  bot.on('login', () => console.log('✅ Bot Logged In'));

  bot.on('spawn', () => {
    console.log('🤖 Bot Spawned');

    const phrases = [
      'انا بقلب في المزرعة 🌾',
      'يلا ننام 🛌',
      'فين الناس؟',
      'حد عنده خبز؟ 🍞',
      'لسه صاحي 😴',
    ];

    // تحرك عشوائي
    setInterval(() => {
      const directions = ['forward', 'back', 'left', 'right'];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      bot.setControlState(dir, true);
      setTimeout(() => bot.setControlState(dir, false), 1000 + Math.random() * 1000);
    }, 7000);

    // Sneak عشوائي
    setInterval(() => {
      bot.setControlState('sneak', true);
      setTimeout(() => bot.setControlState('sneak', false), 1500);
    }, 15000);

    // حركة رأس عشوائية
    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch, true);
    }, 8000);

    // يكتب كلام عشوائي
    setInterval(() => {
      const msg = phrases[Math.floor(Math.random() * phrases.length)];
      bot.chat(msg);
    }, 60000);

    // ياكل لو جاع
    setInterval(() => {
      if (bot.food < 18) {
        const foodItem = bot.inventory.items().find(item =>
          item.name.includes('bread') || item.name.includes('apple')
        );
        if (foodItem) {
          bot.equip(foodItem, 'hand', (err) => {
            if (!err) bot.consume();
          });
        }
      }
    }, 10000);

    // ينام لو ليل
    setInterval(() => {
      const time = bot.time.timeOfDay;
      if (time > 13000 && time < 24000) {
        const bed = bot.findBlock({
          matching: block => bot.isABed(block),
          maxDistance: 10
        });

        if (bed) {
          const dx = bed.position.x - bot.entity.position.x;
          const dz = bed.position.z - bot.entity.position.z;
          const angle = Math.atan2(-dx, -dz);
          bot.look(angle, 0, true);

          bot.setControlState('forward', true);

          setTimeout(() => {
            bot.setControlState('forward', false);

            bot.sleep(bed, (err) => {
              if (err) console.log('❌ Failed to sleep:', err.message);
              else console.log('💤 Bot is sleeping...');
            });
          }, 3000); // وقت كافي يقرب من السرير
        }
      }
    }, 60000);
  });

  bot.on('end', () => {
    console.log('⛔ Bot disconnected. Reconnecting in 5s...');
    setTimeout(startBot, 5000);
  });

  bot.on('error', err => {
    console.log('❌ Error:', err);
  });
}

startBot();
