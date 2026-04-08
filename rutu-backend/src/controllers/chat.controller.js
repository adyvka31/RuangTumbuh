const prisma = require("../config/db");
const catchAsync = require("../utils/catchAsync");

// Ambil semua daftar obrolan (Pribadi/Grup) milik user
exports.getChatRooms = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const rooms = await prisma.chatRoom.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: {
        include: {
          user: { select: { id: true, name: true, profilePicture: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // Hanya ambil 1 pesan terakhir untuk preview
      },
    },
  });

  res.status(200).json({ success: true, data: rooms });
});

// Ambil riwayat chat lengkap dalam satu room
exports.getMessages = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const currentUserId = req.user.id;

  // Ambil detail room beserta pesertanya
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!room) {
    return res
      .status(404)
      .json({ success: false, message: "Room tidak ditemukan" });
  }

  // Jika ini chat personal, cari siapa lawan bicaranya
  let chatPartner = null;
  if (!room.isGroup) {
    const partnerData = room.participants.find(
      (p) => p.userId !== currentUserId,
    );
    chatPartner = partnerData ? partnerData.user : null;
  }

  // Ambil riwayat pesan
  const messages = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, profilePicture: true } },
    },
  });

  res.status(200).json({
    success: true,
    data: {
      room,
      messages,
      chatPartner,
    },
  });
});

exports.getOrCreatePrivateRoom = catchAsync(async (req, res) => {
  const currentUserId = req.user.id;
  const { otherUserId } = req.body;

  // 1. Cek apakah room private antara dua orang ini sudah ada
  const existingRooms = await prisma.chatRoom.findMany({
    where: {
      isGroup: false,
      participants: { some: { userId: currentUserId } },
    },
    include: { participants: true },
  });

  let room = existingRooms.find((r) =>
    r.participants.some((p) => p.userId === otherUserId),
  );

  // 2. Jika belum pernah chat, BUAT room private baru
  if (!room) {
    room = await prisma.chatRoom.create({
      data: {
        isGroup: false,
        participants: {
          create: [{ userId: currentUserId }, { userId: otherUserId }],
        },
      },
    });
  }

  res.status(200).json({ success: true, data: room });
});

exports.searchGroups = catchAsync(async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(200).json({ success: true, data: [] });

  const groups = await prisma.chatRoom.findMany({
    where: {
      isGroup: true,
      name: {
        contains: q,
        mode: "insensitive", // Tidak peduli huruf besar/kecil
      },
    },
    take: 10,
  });

  res.status(200).json({ success: true, data: groups });
});
