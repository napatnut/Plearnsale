/* ============================================================
 *  config.js — ตั้งค่าเชื่อมต่อ backend (แก้ค่าตรงนี้ที่เดียว)
 * ============================================================ */

// ⬇️ วาง Web app URL ที่ได้จาก Apps Script (Deploy > Web app) ตรงนี้
const API_URL = "https://script.google.com/macros/s/AKfycbyMbSo5vljW_HDXI0P5FezgVVhURKxlgE8mhGWrv-6162sxBxX5-xy2dan2qa-B_L1ZwA/exec";

/* ------------------------------------------------------------
 *  ตัวช่วยเรียก API (CORS-safe: ส่งเป็น text/plain เลี่ยง preflight)
 * ------------------------------------------------------------ */

// อ่านรหัสเข้าถึงจาก URL parameter เช่น ?code=PS-STAFF-2026
function getAccessCode() {
  const params = new URLSearchParams(window.location.search);
  return (params.get('code') || '').trim();
}

// เรียก API — คืน Promise ของ JSON ที่ backend ส่งกลับ
async function apiCall(action, params = {}) {
  if (API_URL.indexOf("PASTE_YOUR") !== -1) {
    throw new Error("ยังไม่ได้ตั้งค่า API_URL ในไฟล์ js/config.js");
  }
  const body = Object.assign({ action, code: getAccessCode() }, params);
  const res = await fetch(API_URL, {
    method: "POST",
    // ใช้ text/plain เพื่อให้เป็น "simple request" ไม่เกิด CORS preflight
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
    redirect: "follow"
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  return data;
}

// เช็คว่ามีรหัสไหม ถ้าไม่มีให้แสดงหน้า "ไม่มีสิทธิ์"
function requireAccessCode() {
  const code = getAccessCode();
  if (!code) {
    document.body.innerHTML =
      '<div style="font-family:-apple-system,sans-serif;text-align:center;padding:60px 20px;color:#8E8E93;">' +
      '<h2 style="color:#5F142D;">ไม่มีสิทธิ์เข้าถึงหน้านี้</h2>' +
      '<p>กรุณาเปิดลิงก์ที่มีรหัสเข้าถึง เช่น ...?code=รหัสของคุณ<br>หรือติดต่อผู้ดูแลระบบ</p></div>';
    return false;
  }
  return true;
}
