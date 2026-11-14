var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_http = __toESM(require("http"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_ws = require("ws");
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-passcode");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
var DB_FILE = import_path.default.join(process.cwd(), "wetalks_db.json");
var IMAGE_RETENTION_DAYS = 10;
var IMAGE_RETENTION_MS = IMAGE_RETENTION_DAYS * 24 * 60 * 60 * 1e3;
var ADMIN_PASSCODES = /* @__PURE__ */ new Set(["0123", "mozunbu_1203", "1203", "admin"]);
function pruneExpiredWeTalksImages(db) {
  const now = Date.now();
  let pruned = 0;
  if (!Array.isArray(db.messages)) return 0;
  db.messages.forEach((m) => {
    if (m && m.image_base64) {
      const createdMs = Date.parse(m.created_at || "");
      if (!Number.isNaN(createdMs) && now - createdMs >= IMAGE_RETENTION_MS) {
        delete m.image_base64;
        m.image_expired = true;
        pruned++;
      }
    }
  });
  if (pruned > 0) {
    writeWeTalksDB(db);
  }
  return pruned;
}
function isAdminAuthorized(req) {
  const headerCode = req.headers["x-admin-passcode"];
  const queryCode = req.query.passcode;
  const bodyCode = req.body && req.body.passcode;
  const code = String(headerCode || queryCode || bodyCode || "").trim();
  return ADMIN_PASSCODES.has(code);
}
function readWeTalksDB() {
  const defaultRooms = [];
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      const data = import_fs.default.readFileSync(DB_FILE, "utf-8");
      const db = JSON.parse(data);
      if (!db.deleted_rooms) db.deleted_rooms = [];
      if (!Array.isArray(db.users)) db.users = [];
      if (!Array.isArray(db.messages)) db.messages = [];
      if (!db.rooms) {
        db.rooms = defaultRooms.filter((r) => !db.deleted_rooms.includes(r.id));
        writeWeTalksDB(db);
      } else {
        db.rooms = db.rooms.filter((r) => !db.deleted_rooms.includes(r.id));
      }
      pruneExpiredWeTalksImages(db);
      return db;
    }
  } catch (e) {
    console.error("Error reading wetalks db:", e);
  }
  const initialDB = { users: [], rooms: defaultRooms, messages: [], deleted_rooms: [] };
  writeWeTalksDB(initialDB);
  return initialDB;
}
function writeWeTalksDB(db) {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing wetalks db:", e);
  }
}
function hashPassword(password) {
  const salt = import_crypto.default.randomBytes(16).toString("hex");
  const derived = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}
function verifyPassword(password, user) {
  if (user.password_hash) {
    const [salt, storedHash] = user.password_hash.split(":");
    if (!salt || !storedHash) return false;
    const derived = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
    try {
      return import_crypto.default.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(storedHash, "hex"));
    } catch {
      return false;
    }
  }
  if (user.password_numeric) {
    return user.password_numeric === password;
  }
  return false;
}
function getRequestToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  if (req.body && req.body.token) {
    return String(req.body.token).trim();
  }
  return "";
}
function authenticateUser(req, db) {
  const token = getRequestToken(req);
  if (!token) return null;
  return db.users.find((u) => u.token && u.token === token) || null;
}
app.get("/api/wetalks/health", (req, res) => {
  res.json({ status: "ok", service: "WeTalks Express Server", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/wetalks/users", (req, res) => {
  const db = readWeTalksDB();
  res.json(
    db.users.map((u) => ({
      username: u.username,
      avatar_base64: u.avatar_base64 || ""
    }))
  );
});
function handleRegisterUser(req, res) {
  const { username, password, password_numeric, avatar_base64 } = req.body || {};
  const cleanUsername = String(username || "").trim();
  const rawPassword = String(password ?? password_numeric ?? "").trim();
  if (!cleanUsername || !rawPassword) {
    return res.status(400).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u3068\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  if (cleanUsername === "\u30B2\u30B9\u30C8") {
    return res.status(400).json({ error: "\u3053\u306E\u30E6\u30FC\u30B6\u30FC\u540D\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002" });
  }
  if (cleanUsername.length > 24) {
    return res.status(400).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u306F24\u6587\u5B57\u4EE5\u5185\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  if (rawPassword.length < 4) {
    return res.status(400).json({ error: "\u30D1\u30B9\u30EF\u30FC\u30C9\u306F4\u6587\u5B57\u4EE5\u4E0A\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  const db = readWeTalksDB();
  const lowerUser = cleanUsername.toLowerCase();
  if (db.users.some((u) => u.username.toLowerCase().trim() === lowerUser)) {
    return res.status(409).json({ error: "\u3053\u306E\u30E6\u30FC\u30B6\u30FC\u540D\u306F\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002" });
  }
  const token = import_crypto.default.randomBytes(24).toString("hex");
  const newUser = {
    id: "u-" + Date.now() + "-" + import_crypto.default.randomBytes(4).toString("hex"),
    username: cleanUsername,
    password_hash: hashPassword(rawPassword),
    token,
    avatar_base64: avatar_base64 || ""
  };
  db.users.push(newUser);
  writeWeTalksDB(db);
  res.json({
    success: true,
    token,
    user: {
      username: newUser.username,
      avatar_base64: newUser.avatar_base64
    }
  });
}
app.post("/api/wetalks/register", handleRegisterUser);
app.post("/api/wetalks/users", handleRegisterUser);
app.post("/api/wetalks/login", (req, res) => {
  const { username, password } = req.body || {};
  const cleanUsername = String(username || "").trim();
  const rawPassword = String(password || "").trim();
  if (!cleanUsername || !rawPassword) {
    return res.status(400).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u3068\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  const db = readWeTalksDB();
  const user = db.users.find((u) => u.username.toLowerCase().trim() === cleanUsername.toLowerCase());
  if (!user || !verifyPassword(rawPassword, user)) {
    return res.status(401).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u307E\u305F\u306F\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002" });
  }
  if (!user.token) {
    user.token = import_crypto.default.randomBytes(24).toString("hex");
    writeWeTalksDB(db);
  }
  res.json({
    success: true,
    token: user.token,
    user: {
      username: user.username,
      avatar_base64: user.avatar_base64 || ""
    }
  });
});
app.get("/api/wetalks/auth/me", (req, res) => {
  const db = readWeTalksDB();
  const user = authenticateUser(req, db);
  if (!user) {
    return res.status(401).json({ error: "\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  res.json({
    success: true,
    user: {
      username: user.username,
      avatar_base64: user.avatar_base64 || ""
    }
  });
});
app.post("/api/wetalks/auth/me", (req, res) => {
  const db = readWeTalksDB();
  const user = authenticateUser(req, db);
  if (!user) {
    return res.status(401).json({ error: "\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  res.json({
    success: true,
    user: {
      username: user.username,
      avatar_base64: user.avatar_base64 || ""
    }
  });
});
app.post("/api/wetalks/users/avatar", (req, res) => {
  const { avatar_base64 } = req.body || {};
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  authUser.avatar_base64 = avatar_base64 || "";
  writeWeTalksDB(db);
  return res.json({ success: true });
});
app.post("/api/wetalks/users/rename", (req, res) => {
  const { newUsername } = req.body || {};
  const newTrimmed = String(newUsername || "").trim();
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002\u518D\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  if (!newTrimmed) {
    return res.status(400).json({ error: "\u65B0\u3057\u3044\u30E6\u30FC\u30B6\u30FC\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  if (newTrimmed === "\u30B2\u30B9\u30C8") {
    return res.status(400).json({ error: "\u3053\u306E\u30E6\u30FC\u30B6\u30FC\u540D\u306F\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002" });
  }
  if (newTrimmed.length > 24) {
    return res.status(400).json({ error: "\u30E6\u30FC\u30B6\u30FC\u540D\u306F24\u6587\u5B57\u4EE5\u5185\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002" });
  }
  const oldName = authUser.username;
  if (newTrimmed === oldName) {
    return res.json({ success: true, username: newTrimmed });
  }
  const conflict = db.users.some(
    (u) => u !== authUser && u.username.toLowerCase().trim() === newTrimmed.toLowerCase()
  );
  if (conflict) {
    return res.status(409).json({ error: "\u3053\u306E\u30E6\u30FC\u30B6\u30FC\u540D\u306F\u65E2\u306B\u4F7F\u7528\u3055\u308C\u3066\u3044\u308B\u305F\u3081\u5909\u66F4\u3067\u304D\u307E\u305B\u3093\u3002" });
  }
  authUser.username = newTrimmed;
  db.messages.forEach((m) => {
    if (m.sender === oldName) {
      m.sender = newTrimmed;
    }
  });
  db.rooms.forEach((r) => {
    if (r.type === "direct" && r.name) {
      const parts = r.name.replace(/@/g, "").split(" & ");
      if (parts.length === 2 && (parts[0] === oldName || parts[1] === oldName)) {
        const updatedParts = parts.map((p) => p === oldName ? newTrimmed : p).sort();
        r.name = "@" + updatedParts[0] + " & @" + updatedParts[1];
      }
    }
  });
  writeWeTalksDB(db);
  res.json({ success: true, username: newTrimmed });
});
var wetalksPresence = /* @__PURE__ */ new Map();
app.post("/api/wetalks/presence", (req, res) => {
  const { clientId, username, roomId, offline } = req.body || {};
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  const resolvedName = authUser ? authUser.username : String(username || "").trim();
  const now = Date.now();
  if (offline && clientId) {
    wetalksPresence.delete(String(clientId));
  } else if (clientId && resolvedName && resolvedName !== "\u30B2\u30B9\u30C8") {
    wetalksPresence.set(String(clientId), {
      username: resolvedName,
      roomId: roomId ? String(roomId) : null,
      lastSeen: now
    });
  }
  for (const [key, val] of wetalksPresence.entries()) {
    if (now - val.lastSeen > 2e4) {
      wetalksPresence.delete(key);
    }
  }
  const activeClients = Array.from(wetalksPresence.values());
  const userMap = /* @__PURE__ */ new Map();
  activeClients.forEach((c) => {
    const uname = String(c.username || "").trim();
    if (uname && uname !== "\u30B2\u30B9\u30C8") {
      const k = uname.toLowerCase();
      if (!userMap.has(k)) userMap.set(k, uname);
    }
  });
  const onlineUsers = Array.from(userMap.values());
  const roomMembers = roomId ? Array.from(new Set(activeClients.filter((c) => c.roomId === roomId && c.username !== "\u30B2\u30B9\u30C8").map((c) => c.username))) : [];
  const fallbackSelf = !offline && resolvedName && resolvedName !== "\u30B2\u30B9\u30C8" ? 1 : 0;
  res.json({
    presenceSupported: true,
    onlineCount: onlineUsers.length > 0 ? onlineUsers.length : fallbackSelf,
    onlineUsers,
    roomMembers
  });
});
app.get("/api/wetalks/rooms", (req, res) => {
  const db = readWeTalksDB();
  res.json(db.rooms);
});
app.post("/api/wetalks/rooms", (req, res) => {
  const { id, name, type } = req.body || {};
  if (!id || !name || !type) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  if (!db.deleted_rooms) db.deleted_rooms = [];
  db.deleted_rooms = db.deleted_rooms.filter((delId) => delId !== id);
  if (db.rooms.some((r) => r.id === id)) {
    return res.json({ success: true, room: db.rooms.find((r) => r.id === id) });
  }
  const newRoom = { id, name, type };
  db.rooms.push(newRoom);
  writeWeTalksDB(db);
  res.json({ success: true, room: newRoom });
});
app.delete("/api/wetalks/rooms/:id", (req, res) => {
  const { id } = req.params;
  const db = readWeTalksDB();
  if (!db.deleted_rooms) db.deleted_rooms = [];
  if (!db.deleted_rooms.includes(id)) {
    db.deleted_rooms.push(id);
  }
  db.rooms = db.rooms.filter((r) => r.id !== id);
  db.messages = db.messages.filter((m) => m.room_id !== id);
  writeWeTalksDB(db);
  res.json({ success: true });
});
app.get("/api/wetalks/messages/:roomId", (req, res) => {
  const { roomId } = req.params;
  const db = readWeTalksDB();
  const msgs = db.messages.filter((m) => m.room_id === roomId);
  res.json(msgs);
});
app.post("/api/wetalks/messages", (req, res) => {
  const { id, room_id, text, image_base64, created_at } = req.body || {};
  const cleanText = String(text || "").trim();
  const cleanImage = typeof image_base64 === "string" ? image_base64.trim() : "";
  if (!room_id || !cleanText && !cleanImage) {
    return res.status(400).json({ error: "Missing fields" });
  }
  if (cleanImage) {
    if (!/^data:image\/(png|jpeg|jpg|gif|webp|bmp);base64,[A-Za-z0-9+/=]+$/i.test(cleanImage)) {
      return res.status(400).json({ error: "\u7121\u52B9\u306A\u753B\u50CF\u5F62\u5F0F\u3067\u3059\u3002" });
    }
    if (cleanImage.length > 5 * 1024 * 1024) {
      return res.status(413).json({ error: "\u753B\u50CF\u30B5\u30A4\u30BA\u304C\u5927\u304D\u3059\u304E\u307E\u3059\u3002" });
    }
  }
  const db = readWeTalksDB();
  const authUser = authenticateUser(req, db);
  if (!authUser) {
    return res.status(401).json({ error: "\u30ED\u30B0\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const msgId = id || "m-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
  const existing = db.messages.find((m) => m.id === msgId);
  if (existing) {
    return res.json({ success: true, message: existing });
  }
  const newMsg = {
    id: msgId,
    room_id,
    sender: authUser.username,
    text: cleanText,
    ...cleanImage ? { image_base64: cleanImage } : {},
    created_at: created_at || (/* @__PURE__ */ new Date()).toISOString()
  };
  db.messages.push(newMsg);
  writeWeTalksDB(db);
  res.json({ success: true, message: newMsg });
});
app.get("/api/wetalks/admin/overview", (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "\u7BA1\u7406\u8005\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const db = readWeTalksDB();
  const roomMap = new Map(db.rooms.map((r) => [r.id, r.name]));
  const imagesCount = db.messages.filter((m) => !!m.image_base64).length;
  const users = db.users.map((u) => ({
    username: u.username,
    has_password: !!(u.password_hash || u.password_numeric),
    password_storage: u.password_hash ? "scrypt\u6697\u53F7\u5316\u4FDD\u5B58\u6E08\u307F" : u.password_numeric ? "\u4FDD\u5B58\u6E08\u307F" : "\u672A\u8A2D\u5B9A",
    avatar_base64: u.avatar_base64 || ""
  }));
  const rooms2 = db.rooms.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    message_count: db.messages.filter((m) => m.room_id === r.id).length
  }));
  const recentMessages = db.messages.slice(-50).reverse().map((m) => {
    const createdMs = Date.parse(m.created_at || "");
    const expiresAt = m.image_base64 && !Number.isNaN(createdMs) ? new Date(createdMs + IMAGE_RETENTION_MS).toISOString() : null;
    return {
      id: m.id,
      room_id: m.room_id,
      room_name: roomMap.get(m.room_id) || m.room_id,
      sender: m.sender,
      text: m.text,
      has_image: !!m.image_base64,
      image_base64: m.image_base64 || "",
      image_expired: !!m.image_expired,
      created_at: m.created_at,
      image_expires_at: expiresAt
    };
  });
  return res.json({
    success: true,
    backend: "\u5185\u8535 Express \u30B5\u30FC\u30D0\u30FC (wetalks_db.json)",
    storage_verified: true,
    image_retention_days: IMAGE_RETENTION_DAYS,
    checked_at: (/* @__PURE__ */ new Date()).toISOString(),
    counts: {
      users: db.users.length,
      rooms: db.rooms.length,
      messages: db.messages.length,
      images: imagesCount
    },
    users,
    rooms: rooms2,
    recent_messages: recentMessages
  });
});
app.post("/api/wetalks/admin/prune-images", (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "\u7BA1\u7406\u8005\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const db = readWeTalksDB();
  const prunedCount = pruneExpiredWeTalksImages(db);
  const remainingImages = db.messages.filter((m) => !!m.image_base64).length;
  return res.json({ success: true, prunedCount, remainingImages });
});
app.delete("/api/wetalks/admin/messages/:id", (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "\u7BA1\u7406\u8005\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const { id } = req.params;
  const db = readWeTalksDB();
  const before = db.messages.length;
  db.messages = db.messages.filter((m) => m.id !== id);
  if (db.messages.length !== before) {
    writeWeTalksDB(db);
  }
  return res.json({ success: true });
});
app.delete("/api/wetalks/admin/users/:username", (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "\u7BA1\u7406\u8005\u8A8D\u8A3C\u304C\u5FC5\u8981\u3067\u3059\u3002" });
  }
  const target = String(req.params.username || "").trim().toLowerCase();
  const db = readWeTalksDB();
  const before = db.users.length;
  db.users = db.users.filter((u) => u.username.toLowerCase().trim() !== target);
  if (db.users.length !== before) {
    writeWeTalksDB(db);
  }
  return res.json({ success: true });
});
setInterval(() => {
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      readWeTalksDB();
    }
  } catch (e) {
  }
}, 60 * 60 * 1e3);
var tetrisQueue = [];
var tetrisRooms = {};
var server = import_http.default.createServer(app);
var PORT = 3e3;
var rooms = {};
var GRID_SIZE = 12;
var TILE_COLORS_COUNT = 5;
function createRandomGrid() {
  const grid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push(Math.floor(Math.random() * TILE_COLORS_COUNT));
    }
    grid.push(row);
  }
  return grid;
}
function getRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      roomId,
      players: {},
      grid: createRandomGrid(),
      flies: [],
      status: "waiting",
      timer: 90,
      seekerId: null,
      roundWinner: null
    };
    spawnFlies(rooms[roomId], 4);
  }
  return rooms[roomId];
}
function spawnFlies(room, count) {
  for (let i = 0; i < count; i++) {
    const gridX = Math.floor(Math.random() * GRID_SIZE);
    const gridY = Math.floor(Math.random() * GRID_SIZE);
    const flyId = Math.random().toString(36).substring(2, 9);
    room.flies.push({
      id: flyId,
      gridX,
      gridY,
      points: 10
    });
  }
}
function rotateGridColors(room) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (Math.random() < 0.15) {
        room.grid[r][c] = (room.grid[r][c] + Math.floor(Math.random() * (TILE_COLORS_COUNT - 1)) + 1) % TILE_COLORS_COUNT;
      }
    }
  }
}
function simulateBots(room) {
  const playerIds = Object.keys(room.players);
  const activeBots = playerIds.filter((id) => room.players[id].isBot);
  const realPlayers = playerIds.filter((id) => !room.players[id].isBot);
  if (realPlayers.length > 0 && activeBots.length < 3) {
    const botId = `bot_${Math.random().toString(36).substring(2, 6)}`;
    room.players[botId] = {
      id: botId,
      name: `ChameleBot ${Math.floor(Math.random() * 90) + 10}`,
      x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5,
      y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5,
      colorIndex: 0,
      targetColorIndex: 0,
      role: "hider",
      isAlive: true,
      score: 0,
      skinId: Math.floor(Math.random() * 4),
      isBot: true,
      heading: 0
    };
  }
  if (room.status === "playing") {
    Object.values(room.players).forEach((p) => {
      if (!p.isBot || !p.isAlive) return;
      if (p.role === "hider") {
        if (Math.random() < 0.08) {
          const dx = (Math.random() - 0.5) * 0.4;
          const dy = (Math.random() - 0.5) * 0.4;
          p.x = Math.max(0.1, Math.min(GRID_SIZE - 0.1, p.x + dx));
          p.y = Math.max(0.1, Math.min(GRID_SIZE - 0.1, p.y + dy));
          p.heading = Math.atan2(dy, dx) * (180 / Math.PI);
        }
        const gx = Math.floor(p.x);
        const gy = Math.floor(p.y);
        if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE) {
          p.targetColorIndex = room.grid[gy][gx];
        }
      } else if (p.role === "seeker") {
        if (Math.random() < 0.03) {
          const hiders = Object.values(room.players).filter((pl) => pl.role === "hider" && pl.isAlive);
          if (hiders.length > 0) {
            const target = hiders[Math.floor(Math.random() * hiders.length)];
            const err = 1;
            const targetX = target.x + (Math.random() - 0.5) * err;
            const targetY = target.y + (Math.random() - 0.5) * err;
            const angle = Math.atan2(targetY - p.y, targetX - p.x);
            p.x = Math.max(0.1, Math.min(GRID_SIZE - 0.1, p.x + Math.cos(angle) * 0.3));
            p.y = Math.max(0.1, Math.min(GRID_SIZE - 0.1, p.y + Math.sin(angle) * 0.3));
            p.heading = angle * (180 / Math.PI);
            if (Math.random() < 0.25) {
              const lickRange = 1.5;
              hiders.forEach((hid) => {
                const dist = Math.hypot(hid.x - p.x, hid.y - p.y);
                if (dist <= lickRange) {
                  hid.isAlive = false;
                  p.score += 50;
                }
              });
            }
          }
        }
      }
    });
  }
}
setInterval(() => {
  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];
    simulateBots(room);
    if (room.status === "playing") {
      room.timer--;
      if (room.timer % 6 === 0) {
        rotateGridColors(room);
      }
      room.flies.forEach((fly, index) => {
        Object.values(room.players).forEach((p) => {
          if (p.isAlive && p.role === "hider") {
            const dist = Math.hypot(p.x - (fly.gridX + 0.5), p.y - (fly.gridY + 0.5));
            if (dist < 0.6) {
              p.score += fly.points;
              room.flies.splice(index, 1);
              spawnFlies(room, 1);
            }
          }
        });
      });
      const seeker = Object.values(room.players).find((p) => p.role === "seeker");
      if (seeker) {
        Object.values(room.players).forEach((hider) => {
          if (hider.role === "hider" && hider.isAlive) {
            const dist = Math.hypot(hider.x - seeker.x, hider.y - seeker.y);
            if (dist < 0.5) {
              hider.isAlive = false;
              seeker.score += 50;
            }
          }
        });
      }
      const aliveHiders = Object.values(room.players).filter((p) => p.role === "hider" && p.isAlive);
      if (aliveHiders.length === 0) {
        room.status = "ended";
        room.roundWinner = "seeker";
      } else if (room.timer <= 0) {
        room.status = "ended";
        room.roundWinner = "hiders";
      }
    }
  });
}, 1e3);
var wss = new import_ws.WebSocketServer({ noServer: true });
server.on("upgrade", (request, socket, head) => {
  const protocol = request.headers["sec-websocket-protocol"];
  if (protocol === "vite-hmr" || protocol === "vite-ping") {
    return;
  }
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
wss.on("connection", (ws) => {
  let playerRoomId = "default";
  let playerId = Math.random().toString(36).substring(2, 9);
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const room = getRoom(playerRoomId);
      switch (data.type) {
        case "join": {
          playerRoomId = data.roomId || "default";
          const currentRoom = getRoom(playerRoomId);
          const hasSeeker = Object.values(currentRoom.players).some((p) => p.role === "seeker");
          const role = hasSeeker ? "hider" : "seeker";
          currentRoom.players[playerId] = {
            id: playerId,
            name: data.name || `Chameleon_${playerId}`,
            x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5,
            y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5,
            colorIndex: 0,
            targetColorIndex: 0,
            role,
            isAlive: true,
            score: 0,
            skinId: data.skinId || 0,
            isBot: false,
            heading: 0
          };
          if (role === "seeker") {
            currentRoom.seekerId = playerId;
          }
          ws.send(JSON.stringify({
            type: "init",
            playerId,
            roomId: playerRoomId,
            gameState: currentRoom
          }));
          break;
        }
        case "move": {
          const player = room.players[playerId];
          if (player && player.isAlive) {
            player.x = Math.max(0.1, Math.min(GRID_SIZE - 0.1, data.x));
            player.y = Math.max(0.1, Math.min(GRID_SIZE - 0.1, data.y));
            player.heading = data.heading || 0;
            const gx = Math.floor(player.x);
            const gy = Math.floor(player.y);
            if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE) {
              player.targetColorIndex = room.grid[gy][gx];
            }
          }
          break;
        }
        case "lick": {
          const player = room.players[playerId];
          if (player && player.role === "seeker") {
            const lickRange = 1.8;
            Object.values(room.players).forEach((hid) => {
              if (hid.role === "hider" && hid.isAlive) {
                const dist = Math.hypot(hid.x - player.x, hid.y - player.y);
                if (dist <= lickRange) {
                  hid.isAlive = false;
                  player.score += 50;
                }
              }
            });
            broadcastToRoom(playerRoomId, {
              type: "lick_effect",
              seekerId: playerId,
              x: player.x,
              y: player.y,
              heading: player.heading
            });
          }
          break;
        }
        case "skin_change": {
          const player = room.players[playerId];
          if (player) {
            player.skinId = data.skinId;
          }
          break;
        }
        case "start_game": {
          if (room.status !== "playing") {
            room.status = "playing";
            room.timer = 90;
            room.flies = [];
            room.roundWinner = null;
            spawnFlies(room, 4);
            const playerIds = Object.keys(room.players);
            if (playerIds.length > 0) {
              const seekerIndex = Math.floor(Math.random() * playerIds.length);
              playerIds.forEach((id, idx) => {
                room.players[id].role = idx === seekerIndex ? "seeker" : "hider";
                room.players[id].isAlive = true;
                room.players[id].x = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5;
                room.players[id].y = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1 + 0.5;
              });
              room.seekerId = playerIds[seekerIndex];
            }
            broadcastToRoom(playerRoomId, {
              type: "system",
              text: "The hunt has started! Chameleon hiders, camouflage into the tiles!"
            });
          }
          break;
        }
        case "chat": {
          broadcastToRoom(playerRoomId, {
            type: "chat",
            sender: room.players[playerId]?.name || "Chameleon",
            text: data.text
          });
          break;
        }
        case "tetris_join": {
          const clientName = data.name || "Anonymous Player";
          const newClient = {
            id: playerId,
            name: clientName,
            ws
          };
          const existingIdx = tetrisQueue.findIndex((c) => c.id === playerId);
          if (existingIdx !== -1) {
            tetrisQueue[existingIdx] = newClient;
          } else if (tetrisQueue.length > 0) {
            const opp = tetrisQueue.shift();
            if (opp.id === playerId) {
              tetrisQueue.push(newClient);
              ws.send(JSON.stringify({ type: "tetris_waiting" }));
            } else {
              const rId = "t_room_" + Math.random().toString(36).substr(2, 6);
              const room2 = {
                id: rId,
                player1: opp,
                player2: newClient
              };
              tetrisRooms[rId] = room2;
              opp.ws.send(JSON.stringify({
                type: "tetris_matched",
                roomId: rId,
                opponentName: newClient.name
              }));
              ws.send(JSON.stringify({
                type: "tetris_matched",
                roomId: rId,
                opponentName: opp.name
              }));
            }
          } else {
            tetrisQueue.push(newClient);
            ws.send(JSON.stringify({ type: "tetris_waiting" }));
          }
          break;
        }
        case "tetris_sync_grid": {
          const rId = data.roomId;
          const room2 = tetrisRooms[rId];
          if (room2) {
            const isP1 = room2.player1.id === playerId;
            const opp = isP1 ? room2.player2 : room2.player1;
            opp.ws.send(JSON.stringify({
              type: "tetris_sync_grid",
              grid: data.grid,
              score: data.score
            }));
          }
          break;
        }
        case "tetris_send_garbage": {
          const rId = data.roomId;
          const room2 = tetrisRooms[rId];
          if (room2) {
            const isP1 = room2.player1.id === playerId;
            const opp = isP1 ? room2.player2 : room2.player1;
            opp.ws.send(JSON.stringify({
              type: "tetris_opponent_garbage",
              lines: data.lines
            }));
          }
          break;
        }
        case "tetris_gameover": {
          const rId = data.roomId;
          const room2 = tetrisRooms[rId];
          if (room2) {
            const isP1 = room2.player1.id === playerId;
            const opp = isP1 ? room2.player2 : room2.player1;
            opp.ws.send(JSON.stringify({
              type: "tetris_opponent_gameover"
            }));
          }
          break;
        }
      }
    } catch (err) {
      console.error("Error handling WebSocket message:", err);
    }
  });
  ws.on("close", () => {
    const queueIdx = tetrisQueue.findIndex((c) => c.id === playerId);
    if (queueIdx !== -1) {
      tetrisQueue.splice(queueIdx, 1);
    }
    Object.keys(tetrisRooms).forEach((rId) => {
      const room = tetrisRooms[rId];
      if (room.player1.id === playerId || room.player2.id === playerId) {
        const opp = room.player1.id === playerId ? room.player2 : room.player1;
        try {
          opp.ws.send(JSON.stringify({ type: "tetris_opponent_disconnected" }));
        } catch (e) {
        }
        delete tetrisRooms[rId];
      }
    });
    Object.keys(rooms).forEach((rId) => {
      const room = rooms[rId];
      if (room.players[playerId]) {
        delete room.players[playerId];
        if (room.seekerId === playerId) {
          const remainingIds = Object.keys(room.players);
          if (remainingIds.length > 0) {
            const nextSeeker = remainingIds[0];
            room.players[nextSeeker].role = "seeker";
            room.seekerId = nextSeeker;
          } else {
            room.seekerId = null;
          }
        }
      }
    });
  });
});
function broadcastToRoom(roomId, message) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === import_ws.WebSocket.OPEN) {
      client.send(payload);
    }
  });
}
setInterval(() => {
  Object.keys(rooms).forEach((roomId) => {
    const room = rooms[roomId];
    broadcastToRoom(roomId, {
      type: "state_update",
      gameState: room
    });
  });
}, 40);
var BROADCASTS_FILE = import_path.default.join(process.cwd(), "broadcasts_db.json");
function readBroadcasts() {
  try {
    if (import_fs.default.existsSync(BROADCASTS_FILE)) {
      const data = import_fs.default.readFileSync(BROADCASTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading broadcasts db:", e);
  }
  return [];
}
function writeBroadcasts(broadcasts) {
  try {
    import_fs.default.writeFileSync(BROADCASTS_FILE, JSON.stringify(broadcasts, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing broadcasts db:", e);
  }
}
app.get("/api/admin/broadcasts", (req, res) => {
  const broadcasts = readBroadcasts();
  res.json(broadcasts);
});
app.post("/api/admin/broadcasts", (req, res) => {
  const { sender, title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: "Title and text are required" });
  }
  const broadcasts = readBroadcasts();
  const newBroadcast = {
    id: "bc-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
    sender: sender || "\u7BA1\u7406\u8005 (Admin)",
    title,
    text,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  broadcasts.push(newBroadcast);
  writeBroadcasts(broadcasts);
  broadcastToRoom("default", {
    type: "admin_broadcast",
    broadcast: newBroadcast
  });
  res.json({ success: true, broadcast: newBroadcast });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", playersCount: wss.clients.size });
});
var isProduction = process.env.NODE_ENV === "production";
async function startServer() {
  if (!isProduction) {
    const isHmrDisabled = process.env.DISABLE_HMR === "true";
    const vite = await (0, import_vite.createServer)({
      server: {
        middlewareMode: true,
        ...isHmrDisabled ? { hmr: false, ws: false } : { hmr: { server } }
      },
      appType: "spa"
    });
    if (isHmrDisabled) {
      app.use(async (req, res, next) => {
        if (req.path === "/@vite/client" || req.path.endsWith("/@vite/client")) {
          try {
            const result = await vite.transformRequest("/@vite/client");
            if (result) {
              const patchedCode = result.code.replace(
                "transport.connect(createHMRHandler(handleMessage));",
                "/* HMR disabled via DISABLE_HMR=true */"
              );
              res.setHeader("Content-Type", "application/javascript");
              return res.send(patchedCode);
            }
          } catch {
          }
        }
        next();
      });
    }
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use("/noon-os", import_express.default.static(distPath));
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
