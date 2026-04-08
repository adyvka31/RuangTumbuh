require("dotenv").config();
const prisma = require("./src/config/db");

async function main() {
  const communities = [
    "Komunitas Frontend",
    "Komunitas Backend",
    "Komunitas UI/UX Design",
    "Komunitas Data Science",
    "Komunitas Mobile Dev",
  ];

  console.log("⏳ Memulai pembuatan komunitas...\n");

  // Looping untuk membuat setiap komunitas di database
  for (const name of communities) {
    try {
      const room = await prisma.chatRoom.create({
        data: {
          name: name,
          isGroup: true,
        },
      });
      console.log(`✅ ${name}`);
      console.log(`   👉 ID: ${room.id}\n`);
    } catch (error) {
      console.error(`❌ Gagal membuat ${name}:`, error.message);
    }
  }

  console.log("🎉 Semua komunitas berhasil dibuat!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
