// mockFirebase.js — شبیه‌ساز Firebase با LocalStorage

const LS_USERS = 'mock_users';                 // آرایه کاربران
const LS_SESSION = 'mock_session_uid';         // uid کاربر لاگین
const LS_TODOS = (uid) => `mock_todos_${uid}`; // تسک‌های هر کاربر

function read(key, def) {
  try { return JSON.parse(localStorage.getItem(key)) ?? def; }
  catch { return def; }
}
function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function makeUid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const auth = { currentUser: null };

// 📌 شبیه onAuthStateChanged
export function onAuthStateChanged(_auth, cb) {
  const uid = localStorage.getItem(LS_SESSION);
  if (uid) {
    const users = read(LS_USERS, []);
    const u = users.find(x => x.uid === uid);
    auth.currentUser = u ? { uid: u.uid, email: u.email, displayName: u.displayName } : null;
  } else {
    auth.currentUser = null;
  }
  setTimeout(() => cb(auth.currentUser), 0);
  return () => {};
}

// 📌 ثبت‌نام
export async function createUserWithEmailAndPassword(_auth, email, password) {
  const users = read(LS_USERS, []);
  if (users.some(u => u.email === email)) {
    throw new Error('ایمیل تکراری است (mock)');
  }
  const u = {
    uid: makeUid(),
    email,
    password,
    displayName: null,
    plan: "free"
  };
  users.push(u);
  write(LS_USERS, users);
  localStorage.setItem(LS_SESSION, u.uid);
  auth.currentUser = u;
  return { user: u };
}

// 📌 ورود
export async function signInWithEmailAndPassword(_auth, email, password) {
  const users = read(LS_USERS, []);
  const u = users.find(x => u.email === email && u.password === password);
  if (!u) throw new Error("ایمیل یا رمز نادرست است (mock)");
  localStorage.setItem(LS_SESSION, u.uid);
  auth.currentUser = u;
  return { user: u };
}

// 📌 خروج
export async function signOut(_auth) {
  localStorage.removeItem(LS_SESSION);
  auth.currentUser = null;
}

// 📌 پروفایل
export async function updateProfile(user, { displayName }) {
  const users = read(LS_USERS, []);
  const idx = users.findIndex(x => x.uid === user.uid);
  if (idx >= 0) {
    users[idx].displayName = displayName;
    write(LS_USERS, users);
    auth.currentUser.displayName = displayName;
  }
}

// 📌 شبیه Firestore: setDoc / getDoc / addDoc / updateDoc
export async function setDoc(ref, data) {
  localStorage.setItem(ref.key, JSON.stringify(data));
}
export async function getDoc(ref) {
  const d = read(ref.key, null);
  return { exists: () => d !== null, data: () => d };
}
export async function updateDoc(ref, data) {
  const cur = read(ref.key, {});
  write(ref.key, { ...cur, ...data });
}
export async function addDoc(ref, data) {
  const todos = read(ref.key, []);
  const id = makeUid();
  todos.push({ id, ...data });
  write(ref.key, todos);
  return { id };
}
export async function getDocs(ref) {
  const todos = read(ref.key, []);
  return todos.map(d => ({ id: d.id, data: () => d }));
}

// 📌 شبیه Firestore: doc / collection
export function doc(_db, path, id) {
  return { key: `${path}_${id}` };
}
export function collection(_db, path, id, sub) {
  return { key: sub ? `${path}_${id}_${sub}` : `${path}_${id}` };
}

// برای سازگاری
export const db = {};