/**
 * browserConstants.ts
 * Holds the rich HTML, CSS, and JS code for Virtual Browser v2 sub-apps.
 * These are loaded inside iframes using srcDoc.
 */

// We talks LINE風チャットのHTMLソース
export const CHAT_APP_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    :root {
      --line-green: #06C755;
      --chat-bg: #8cabd9;
      --text-color: #1e1e1e;
      --light-gray: #f4f4f4;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
      display: flex; flex-direction: column; background: #fff; color: var(--text-color); overflow: hidden;
    }
    .header {
      background: var(--line-green); color: white; padding: 12px 16px;
      display: flex; align-items: center; justify-content: space-between; font-weight: bold; flex-shrink: 0;
    }
    .header-btn {
      background: none; border: none; color: white; font-size: 16px; cursor: pointer; outline: none;
    }
    #view-lobby { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
    .lobby-title { padding: 12px 16px; font-size: 14px; color: #666; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; }
    #lobby-username-tag {
      font-size: 13px; color: var(--line-green); font-weight: bold; cursor: pointer;
      text-decoration: underline; text-decoration-style: dashed; transition: opacity 0.1s;
    }
    #lobby-username-tag:hover { opacity: 0.8; }
    .room-list { flex: 1; overflow-y: auto; list-style: none; }
    .room-item {
      display: flex; align-items: center; gap: 12px; padding: 14px 16px;
      border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.1s;
    }
    .room-item:hover { background: #fafafa; }
    .room-avatar {
      width: 44px; height: 44px; background: #ddd; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-size: 20px; color: white;
    }
    .room-info { flex: 1; display: flex; align-items: center; justify-content: space-between; width: 100%; }
    .room-name-wrapper { display: flex; flex-direction: column; gap: 4px; }
    .room-name { font-weight: bold; font-size: 15px; }
    .room-type { font-size: 11px; background: #eee; padding: 2px 6px; border-radius: 10px; color: #555; align-self: flex-start; }
    .room-unread-badge {
      background: #ff3b30; color: white; border-radius: 50%; padding: 2px 6px;
      font-size: 10px; font-weight: bold; min-width: 18px; height: 18px;
      display: flex; align-items: center; justify-content: center; margin-left: auto;
    }
    .btn-create {
      margin: 16px; padding: 12px; background: var(--line-green); color: white;
      border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 14px; text-align: center;
    }
    #view-chat { display: none; flex-direction: column; flex: 1; overflow: hidden; background: var(--chat-bg); }
    .message-area { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .msg { display: flex; flex-direction: column; max-width: 80%; }
    .msg-sender { font-size: 11px; color: rgba(255,255,255,0.9); margin-bottom: 3px; font-weight: bold; }
    .msg-row { display: flex; align-items: flex-end; gap: 6px; }
    .msg-bubble { padding: 8px 12px; border-radius: 14px; font-size: 14px; line-height: 1.4; word-break: break-all; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .msg-meta { font-size: 9px; color: rgba(255,255,255,0.85); flex-shrink: 0; display: flex; flex-direction: column; gap: 1px; }
    .msg-read-status { color: #fdf156; font-weight: bold; text-align: right; }
    .msg.me { align-self: flex-end; align-items: flex-end; }
    .msg.me .msg-sender { align-self: flex-end; }
    .msg.me .msg-row { flex-direction: row-reverse; }
    .msg.me .msg-bubble { background: #95ec69; color: #191919; border-top-right-radius: 2px; }
    .msg.other { align-self: flex-start; align-items: flex-start; }
    .msg.other .msg-sender { align-self: flex-start; }
    .msg.other .msg-row { flex-direction: row; }
    .msg.other .msg-bubble { background: #ffffff; color: #191919; border-top-left-radius: 2px; }
    .msg-bubble.has-image { padding: 6px; }
    .msg-image {
      display: block; max-width: 220px; max-height: 240px; width: auto; height: auto;
      border-radius: 10px; object-fit: cover; cursor: pointer; background: rgba(0,0,0,0.06);
    }
    .msg-text-with-image { margin-top: 6px; padding: 0 4px 2px; }
    .image-preview-bar {
      display: none; align-items: center; gap: 10px; padding: 8px 12px;
      background: #f8fafc; border-top: 1px solid #e2e8f0; flex-shrink: 0;
    }
    .image-preview-bar.active { display: flex; }
    .image-preview-thumb {
      width: 48px; height: 48px; border-radius: 6px; object-fit: cover;
      border: 1px solid #cbd5e1; background: #fff; flex-shrink: 0;
    }
    .image-preview-info { flex: 1; min-width: 0; font-size: 12px; color: #334155; }
    .image-preview-name { font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .image-preview-hint { font-size: 10px; color: #64748b; }
    .btn-clear-image {
      background: #e2e8f0; color: #334155; border: none; border-radius: 50%;
      width: 26px; height: 26px; font-size: 13px; font-weight: bold; cursor: pointer; flex-shrink: 0;
    }
    .input-form {
      display: flex; align-items: center; padding: 8px; background: white; border-top: 1px solid #ddd; gap: 8px; flex-shrink: 0;
    }
    .input-form input[type="text"] {
      flex: 1; border: 1px solid #ccc; border-radius: 20px; padding: 10px 16px; font-size: 14px; outline: none;
    }
    .input-form input[type="text"]:focus { border-color: var(--line-green); }
    .btn-image-attach {
      background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 50%;
      width: 38px; height: 38px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0;
    }
    .btn-image-attach:hover { background: #e2e8f0; }
    .input-form button#btn-send {
      background: var(--line-green); color: white; border: none; border-radius: 50%;
      width: 40px; height: 40px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
    }
    #view-settings { display: none; flex-direction: column; flex: 1; overflow-y: auto; padding: 16px; gap: 20px; }
    .setting-item { display: flex; flex-direction: column; gap: 6px; }
    .setting-item input, .setting-item textarea {
      padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; outline: none; width: 100%;
    }
    .setting-item input:focus { border-color: var(--line-green); }
    .btn-save { padding: 12px; background: var(--line-green); color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; width: 100%; font-size: 14px; }
    .modal {
      display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      align-items: center; justify-content: center; padding: 16px; z-index: 1000;
    }
    .modal.active { display: flex; }
    .modal-content { background: white; border-radius: 8px; width: 100%; max-width: 320px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
    .modal-title { font-weight: bold; font-size: 16px; }
    .modal-btns { display: flex; gap: 8px; justify-content: flex-end; }
    .modal-btn { padding: 8px 16px; border-radius: 4px; border: none; font-size: 13px; cursor: pointer; font-weight: bold; }
    .modal-btn.cancel { background: #eee; color: #333; }
    .modal-btn.confirm { background: var(--line-green); color: white; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <div class="header">
    <button class="header-btn" id="btn-back" style="visibility: hidden;">&#10094; 戻る</button>
    <span id="title-text">We talks</span>
    <button class="header-btn" id="btn-to-settings">&#9881;</button>
  </div>

  <div id="view-auth" style="display: none; flex-direction: column; flex: 1; overflow-y: auto; padding: 24px; justify-content: center; align-items: stretch; gap: 16px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 48px; margin-bottom: 8px;">💬</div>
      <h2 style="font-size: 24px; font-weight: bold; color: var(--line-green);">We talks</h2>
      <p style="font-size: 13px; color: #666; margin-top: 4px;">ログインまたは新規登録してください</p>
    </div>

    <div style="display: flex; background: #eee; border-radius: 8px; padding: 4px; margin-bottom: 8px;">
      <button id="auth-tab-login" style="flex: 1; padding: 8px; border: none; background: white; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 13px;">ログイン</button>
      <button id="auth-tab-signup" style="flex: 1; padding: 8px; border: none; background: transparent; font-weight: bold; border-radius: 6px; cursor: pointer; color: #555; font-size: 13px;">新規登録</button>
    </div>

    <div class="setting-item">
      <label style="font-size: 12px; font-weight: bold; color: #555;">ユーザー名</label>
      <input type="text" id="auth-username" placeholder="ユーザー名を入力" autocomplete="off" />
    </div>

    <div class="setting-item">
      <label style="font-size: 12px; font-weight: bold; color: #555; margin-top: 8px;">パスワード (4文字以上)</label>
      <input type="password" id="auth-password" placeholder="パスワードを入力" autocomplete="off" />
    </div>

    <div id="auth-error" style="color: #ff3b30; font-size: 12px; font-weight: bold; text-align: center; display: none; margin-top: 8px;"></div>

    <button class="btn-save" id="btn-auth-submit" style="margin-top: 16px;">ログイン</button>
  </div>

  <div id="view-lobby">
    <div class="lobby-title">
      <span id="lobby-online-count-tag">● オンライン: 1人</span>
      <span style="display: inline-flex; align-items: center; gap: 4px;">
        <span id="lobby-username-tag">ゲスト</span>
        <span id="lobby-username-edit-btn" style="font-size: 11px; color: #06C755; cursor: pointer;" title="ユーザー名・プロフィールを編集">✏️</span>
      </span>
    </div>
    <ul class="room-list" id="room-list-container"></ul>
    <button class="btn-create" id="btn-open-create-modal">＋ 新しいトークルームを作成</button>
  </div>

  <div id="view-chat">
    <div class="message-area" id="message-container"></div>
    <div class="image-preview-bar" id="msg-image-preview-bar">
      <img id="msg-image-preview-thumb" class="image-preview-thumb" src="" alt="送信プレビュー" />
      <div class="image-preview-info">
        <div id="msg-image-preview-name" class="image-preview-name">画像を選択中</div>
        <div class="image-preview-hint">送信ボタンを押すと画像を送信します</div>
      </div>
      <button type="button" id="btn-clear-msg-image" class="btn-clear-image" title="画像をキャンセル">✕</button>
    </div>
    <div class="input-form">
      <input type="file" id="msg-image-file" accept="image/*" style="display: none;" />
      <button type="button" id="btn-image-attach" class="btn-image-attach" title="画像を送信">🖼️</button>
      <input type="text" id="msg-input" placeholder="メッセージを入力" autocomplete="off" />
      <button id="btn-send">&#10148;</button>
    </div>
  </div>

  <div id="view-settings" style="overflow-y: auto; max-height: calc(100vh - 120px); padding-bottom: 24px;">
    <div id="settings-active-backend-banner" style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; font-size: 11px; color: #1e293b; line-height: 1.5;">
      現在の保存先: <strong id="settings-active-backend-label">確認中...</strong>
    </div>

    <div style="padding-top: 4px;">
      <h3 style="font-size:14px; font-weight:bold; color:#333; margin-bottom:8px;">バックエンド接続プロバイダー</h3>
      
      <!-- Provider Tabs -->
      <div style="display: flex; gap: 6px; background: #eee; padding: 4px; border-radius: 8px; margin-bottom: 14px;">
        <button id="tab-provider-internal" type="button" style="flex: 1; padding: 6px 10px; border: none; background: white; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 11px; color: #333;">🖥️ 内蔵サーバー</button>
        <button id="tab-provider-cf" type="button" style="flex: 1; padding: 6px 10px; border: none; background: transparent; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 11px; color: #666;">☁️ Cloudflare Worker</button>
        <button id="tab-provider-supabase" type="button" style="flex: 1; padding: 6px 10px; border: none; background: transparent; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 11px; color: #666;">⚡ Supabase</button>
      </div>

      <!-- Cloudflare Worker Section -->
      <div id="section-cf-settings" style="display: none; flex-direction: column; gap: 10px; background: #fffaf5; border: 1px solid #ffd8b2; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="font-size:12px; font-weight: bold; color:#d96500; margin:0;">Cloudflare Worker & D1 設定</h4>
        </div>
        <p style="font-size:11px; color:#775533; margin:0; line-height: 1.4;">
          Cloudflare Workers 上で動くバックエンド API の URL を入力し、下の「保存して適用」を押すと、ユーザー名・パスワード・ルーム・履歴・画像が Cloudflare 側に保存されます。
        </p>

        <div class="setting-item">
          <label style="font-size: 11px; font-weight: bold; color: #555;">Cloudflare Worker URL</label>
          <div style="display: flex; gap: 6px; margin-top: 4px;">
            <input type="text" id="input-cf-url" placeholder="https://wetalks-backend.mozunbu0123.workers.dev" style="flex: 1; font-size: 11px;" />
            <button id="btn-cf-test" type="button" style="padding: 6px 12px; font-size: 11px; font-weight: bold; background: #f48120; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap;">接続テスト</button>
          </div>
          <div id="cf-test-result" style="font-size: 11px; font-weight: bold; margin-top: 4px; display: none;"></div>
        </div>

        <!-- Setup Guide Toggle -->
        <details style="background: white; border: 1px dashed #f48120; border-radius: 6px; padding: 8px; font-size: 11px; color: #444;">
          <summary style="cursor: pointer; font-weight: bold; color: #d96500;">📖 Cloudflare 側の設定手順・SQLコード</summary>
          <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px; line-height: 1.4;">
            <p style="margin: 0;"><b>1. D1 データベース作成</b>: Cloudflare Dash → Workers & Pages → D1 → 「wetalks-db」を作成</p>
            <p style="margin: 0;"><b>2. テーブル作成</b>: D1 コンソールで以下の SQL を実行：</p>
            <textarea id="cf-schema-sql" readonly style="width: 100%; height: 85px; font-family: monospace; font-size: 10px; background: #f8f9fa; border: 1px solid #ddd; padding: 4px; border-radius: 4px;">CREATE TABLE IF NOT EXISTS wetalks_users (username TEXT PRIMARY KEY, password_numeric TEXT NOT NULL DEFAULT '', password_hash TEXT DEFAULT '', token TEXT DEFAULT '', avatar_base64 TEXT DEFAULT '');
CREATE TABLE IF NOT EXISTS wetalks_rooms (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS wetalks_messages (id TEXT PRIMARY KEY, room_id TEXT NOT NULL, sender TEXT NOT NULL, text TEXT NOT NULL, image_base64 TEXT DEFAULT '', created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS wetalks_deleted_rooms (id TEXT PRIMARY KEY);</textarea>
            <button type="button" id="btn-copy-sql" style="align-self: flex-start; padding: 4px 8px; font-size: 10px; background: #eee; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">📋 SQL をコピー</button>
            <p style="margin: 0;"><b>3. Worker 更新</b>: プロジェクト内の <code>cloudflare/worker.js</code> を貼り付けてデプロイ</p>
            <p style="margin: 0;"><b>4. D1 バインド</b>: Worker 設定 → Variables → D1 Binding に Variable name <code>DB</code> として wetalks-db を設定</p>
          </div>
        </details>
      </div>

      <!-- Supabase Section -->
      <div id="section-supabase-settings" style="display: none; flex-direction: column; gap: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
        <h4 style="font-size:12px; font-weight: bold; color:#334155; margin:0;">Supabase 設定</h4>
        <p style="font-size:11px; color:#64748b; margin:0;">取得した「URL」と「anon key」を入力してください。</p>
        <div class="setting-item">
          <label style="font-size: 11px; font-weight: bold; color: #555;">Supabase URL</label>
          <input type="text" id="input-supabase-url" placeholder="https://xxxxxxxxxxxxxx.supabase.co" style="font-size: 11px;" />
        </div>
        <div class="setting-item" style="margin-top:4px;">
          <label style="font-size: 11px; font-weight: bold; color: #555;">Supabase anon key</label>
          <textarea id="input-supabase-key" rows="3" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." style="font-size: 10px; font-family: monospace;"></textarea>
        </div>
      </div>

      <!-- Internal Server Section -->
      <div id="section-internal-settings" style="display: none; flex-direction: column; gap: 8px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
        <h4 style="font-size:12px; font-weight: bold; color:#1e293b; margin:0;">内蔵 Express サーバー</h4>
        <p style="font-size:11px; color:#64748b; margin:0; line-height: 1.4;">
          本 WebOS 内蔵のバックエンド API (<code>/api/wetalks/*</code>) を使用します。Cloudflare に保存したい場合は上の「☁️ Cloudflare Worker」タブを選んで「保存して適用」を押してください。
        </p>
      </div>
    </div>

    <button class="btn-save" id="btn-save-settings" style="margin-top:4px;">保存して適用</button>

    <!-- Admin Storage Inspection & Management Dashboard -->
    <div style="border-top: 1px solid #ddd; padding-top: 14px; margin-top: 8px; display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
        <h4 style="font-size:13px; color:#0f172a; margin:0;">🛡️ 保存データ確認・管理 (管理者用)</h4>
        <span style="font-size:10px; color:#0369a1; background:#e0f2fe; padding:2px 8px; border-radius:4px; font-weight:bold;">画像10日自動削除</span>
      </div>

      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <button type="button" id="btn-admin-inspect-active" style="flex: 1; min-width: 110px; padding: 7px 10px; font-size: 11px; font-weight: bold; background: #0f172a; color: white; border: none; border-radius: 6px; cursor: pointer;">🔄 現在の保存先を確認</button>
        <button type="button" id="btn-admin-inspect-cf" style="flex: 1; min-width: 120px; padding: 7px 10px; font-size: 11px; font-weight: bold; background: #f48120; color: white; border: none; border-radius: 6px; cursor: pointer;">☁️ Cloudflare を直接確認</button>
        <button type="button" id="btn-admin-prune-images" style="width: 100%; padding: 7px 10px; font-size: 11px; font-weight: bold; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer;">🧹 10日経過した画像を今すぐチェック・削除</button>
      </div>

      <div id="admin-storage-status" style="font-size: 11px; padding: 8px 10px; border-radius: 6px; background: #f8fafc; border: 1px solid #cbd5e1; color: #334155; line-height: 1.5;">
        データを確認中...
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; text-align: center;">
          <div style="font-size: 10px; color: #64748b;">ユーザー</div>
          <div id="admin-stat-users" style="font-size: 15px; font-weight: bold; color: #0f172a;">-</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; text-align: center;">
          <div style="font-size: 10px; color: #64748b;">ルーム</div>
          <div id="admin-stat-rooms" style="font-size: 15px; font-weight: bold; color: #0f172a;">-</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; text-align: center;">
          <div style="font-size: 10px; color: #64748b;">履歴数</div>
          <div id="admin-stat-messages" style="font-size: 15px; font-weight: bold; color: #0f172a;">-</div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; text-align: center;">
          <div style="font-size: 10px; color: #64748b;">保存画像</div>
          <div id="admin-stat-images" style="font-size: 15px; font-weight: bold; color: #0284c7;">-</div>
        </div>
      </div>

      <div style="display: flex; gap: 4px; background: #e2e8f0; padding: 3px; border-radius: 6px;">
        <button type="button" id="tab-admin-users" style="flex: 1; padding: 6px; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; background: white; color: #0f172a; cursor: pointer;">👤 ユーザー・PW</button>
        <button type="button" id="tab-admin-rooms" style="flex: 1; padding: 6px; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; background: transparent; color: #475569; cursor: pointer;">💬 ルーム</button>
        <button type="button" id="tab-admin-messages" style="flex: 1; padding: 6px; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; background: transparent; color: #475569; cursor: pointer;">🖼️ 履歴・画像</button>
      </div>

      <div id="admin-panel-users" style="display: flex; flex-direction: column; gap: 6px;">
        <ul id="admin-user-list" style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px;"></ul>
      </div>

      <div id="admin-panel-rooms" style="display: none; flex-direction: column; gap: 6px;">
        <ul id="settings-room-list" style="list-style:none; padding:0; display:flex; flex-direction:column; gap:8px;"></ul>
      </div>

      <div id="admin-panel-messages" style="display: none; flex-direction: column; gap: 6px;">
        <ul id="admin-message-list" style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px;"></ul>
      </div>
    </div>
  </div>

  <div class="modal" id="modal-create-room">
    <div class="modal-content">
      <div class="modal-title">新しいトークルームを作成</div>
      <div class="setting-item" id="container-room-name" style="display: flex;">
        <label>トークルーム名</label>
        <input type="text" id="input-new-room-name" placeholder="例: 雑談ルーム" autocomplete="off" />
      </div>
      <div class="setting-item" id="container-direct-target" style="display: none;">
        <label>話す相手を選択</label>
        <select id="select-direct-target" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;"></select>
      </div>
      <div class="setting-item">
        <label>タイプ</label>
        <select id="select-new-room-type" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
          <option value="group" selected>グループ</option>
          <option value="direct">1対1</option>
        </select>
      </div>
      <div id="create-room-error" style="color: #ff3b30; font-size: 12px; font-weight: bold; display: none;"></div>
      <div class="modal-btns">
        <button class="modal-btn cancel" id="btn-create-cancel">キャンセル</button>
        <button class="modal-btn confirm" id="btn-create-confirm">作成</button>
      </div>
    </div>
  </div>

  <div class="modal" id="modal-passcode">
    <div class="modal-content">
      <div class="modal-title">管理者認証</div>
      <div class="setting-item">
        <label>設定を開くには管理者パスキーを入力してください</label>
        <input type="password" id="input-passcode" placeholder="パスキーを入力" style="margin-top: 8px;" />
        <div id="passcode-error" style="color: #ff3333; font-size: 12px; margin-top: 6px; display: none; font-weight: bold;">パスキーが一致しません。</div>
      </div>
      <div class="modal-btns">
        <button class="modal-btn cancel" id="btn-passcode-cancel">キャンセル</button>
        <button class="modal-btn confirm" id="btn-passcode-confirm">確認</button>
      </div>
    </div>
  </div>

  <div class="modal" id="modal-change-username">
    <div class="modal-content">
      <div class="modal-title">プロフィールの編集</div>
      <div class="setting-item">
        <label>ユーザー名</label>
        <input type="text" id="input-new-username" placeholder="新しいユーザー名を入力" style="margin-top: 8px;" autocomplete="off" />
        <span style="font-size: 11px; color: #64748b;">※ 他のユーザーが登録済みの名前には変更できません</span>
      </div>
      <div id="username-change-error" style="color: #ff3b30; font-size: 12px; font-weight: bold; display: none;"></div>
      <div class="setting-item" style="margin-top: 4px;">
        <label>プロフィール画像</label>
        <div style="display: flex; align-items: center; gap: 12px; margin-top: 6px;">
          <img id="profile-avatar-preview" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; background: #ddd; border: 1px solid #ccc;" src="" />
          <input type="file" id="profile-avatar-file" accept="image/*" style="font-size: 11px;" />
        </div>
      </div>
      <div class="modal-btns" style="margin-top: 12px;">
        <button class="modal-btn cancel" id="btn-username-cancel">キャンセル</button>
        <button class="modal-btn confirm" id="btn-username-confirm">保存</button>
      </div>
      <div style="border-top: 1px solid #eee; margin-top: 14px; padding-top: 14px;">
        <button class="modal-btn" id="btn-logout" style="background: #ff3b30; color: white; width: 100%; padding: 10px; border-radius: 4px; border: none; font-weight: bold; cursor: pointer;">ログアウト</button>
      </div>
    </div>
  </div>

  <div class="modal" id="modal-image-viewer" style="background: rgba(0,0,0,0.85); z-index: 1200;">
    <div style="position: relative; max-width: 92%; max-height: 90%; display: flex; flex-direction: column; align-items: center; gap: 10px;">
      <img id="image-viewer-img" src="" alt="拡大画像" style="max-width: 100%; max-height: 78vh; border-radius: 8px; object-fit: contain; background: #111;" />
      <button type="button" id="btn-close-image-viewer" style="background: white; color: #111; border: none; padding: 8px 18px; border-radius: 20px; font-size: 12px; font-weight: bold; cursor: pointer;">閉じる</button>
    </div>
  </div>

  <div class="modal" id="modal-confirm-action" style="z-index: 1250;">
    <div class="modal-content" style="max-width: 320px;">
      <div class="modal-title" id="confirm-action-title">削除の確認</div>
      <div id="confirm-action-message" style="font-size: 13px; color: #334155; line-height: 1.5; white-space: pre-wrap;"></div>
      <div class="modal-btns" style="margin-top: 8px;">
        <button type="button" class="modal-btn cancel" id="btn-confirm-action-cancel">キャンセル</button>
        <button type="button" class="modal-btn" id="btn-confirm-action-ok" style="background: #ef4444; color: white;">削除する</button>
      </div>
    </div>
  </div>

  <script>
    (function() {
      'use strict';

      let localStorage;
      try {
        let storageCandidate = null;
        try {
          if (window.parent && window.parent !== window && window.parent.localStorage) {
            window.parent.localStorage.setItem('__wetalks_test__', '1');
            window.parent.localStorage.removeItem('__wetalks_test__');
            storageCandidate = window.parent.localStorage;
            // Migrate any existing iframe-scoped wetalks_* keys into parent localStorage once
            try {
              if (window.localStorage) {
                for (let i = 0; i < window.localStorage.length; i++) {
                  const k = window.localStorage.key(i);
                  if (k && k.startsWith('wetalks_') && storageCandidate.getItem(k) === null) {
                    const v = window.localStorage.getItem(k);
                    if (v !== null) storageCandidate.setItem(k, v);
                  }
                }
              }
            } catch (migErr) {}
          }
        } catch (parentErr) {}
        if (!storageCandidate) {
          window.localStorage.getItem('test');
          storageCandidate = window.localStorage;
        }
        localStorage = storageCandidate;
      } catch (e) {
        localStorage = {
          _data: {},
          getItem: function(k) { return this._data[k] !== undefined ? this._data[k] : null; },
          setItem: function(k, v) { this._data[k] = String(v); },
          removeItem: function(k) { delete this._data[k]; },
          clear: function() { this._data = {}; }
        };
      }

      let sessionStorage;
      try {
        window.sessionStorage.getItem('test');
        sessionStorage = window.sessionStorage;
      } catch (e) {
        sessionStorage = {
          _data: {},
          getItem: function(k) { return this._data[k] !== undefined ? this._data[k] : null; },
          setItem: function(k, v) { this._data[k] = String(v); },
          removeItem: function(k) { delete this._data[k]; },
          clear: function() { this._data = {}; }
        };
      }

      const DB_KEY = 'wetalks_local_db_v3';
      const DELETED_ROOMS_KEY = 'wetalks_deleted_rooms_v1';
      const LEGACY_DEFAULT_ROOM_IDS = ['room-general', 'room-random', 'room-announcements'];
      const defaultRoomsList = [];

      // One-time cleanup of legacy initial rooms
      try {
        if (!localStorage.getItem('wetalks_migrated_no_default_rooms_v1')) {
          const rawDb = localStorage.getItem(DB_KEY);
          if (rawDb) {
            const parsedDb = JSON.parse(rawDb);
            if (parsedDb && Array.isArray(parsedDb.rooms)) {
              parsedDb.rooms = parsedDb.rooms.filter(r => r && r.id && !LEGACY_DEFAULT_ROOM_IDS.includes(r.id));
              localStorage.setItem(DB_KEY, JSON.stringify(parsedDb));
            }
          }
          localStorage.setItem('wetalks_migrated_no_default_rooms_v1', 'true');
        }
      } catch(e) {}

      function getDeletedRoomIds() {
        try {
          const raw = localStorage.getItem(DELETED_ROOMS_KEY);
          if (raw) return JSON.parse(raw);
        } catch(e) {}
        return [];
      }

      function addDeletedRoomId(id) {
        try {
          const list = getDeletedRoomIds();
          if (!list.includes(id)) {
            list.push(id);
            localStorage.setItem(DELETED_ROOMS_KEY, JSON.stringify(list));
          }
        } catch(e) {}
      }

      function removeDeletedRoomId(id) {
        try {
          let list = getDeletedRoomIds();
          list = list.filter(item => item !== id);
          localStorage.setItem(DELETED_ROOMS_KEY, JSON.stringify(list));
        } catch(e) {}
      }

      const IMAGE_RETENTION_DAYS = 10;
      const IMAGE_RETENTION_MS = IMAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000;

      function pruneExpiredMessagesArray(msgs) {
        if (!Array.isArray(msgs)) return false;
        const now = Date.now();
        let changed = false;
        msgs.forEach(m => {
          if (m && m.image_base64) {
            const createdMs = Date.parse(m.created_at || '');
            if (!isNaN(createdMs) && now - createdMs >= IMAGE_RETENTION_MS) {
              delete m.image_base64;
              m.image_expired = true;
              changed = true;
            }
          }
        });
        return changed;
      }

      function getLocalDB() {
        const raw = localStorage.getItem(DB_KEY);
        const deletedIds = getDeletedRoomIds();
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            let changed = false;
            if (!parsed.rooms || !Array.isArray(parsed.rooms)) {
              parsed.rooms = [];
              changed = true;
            } else {
              parsed.rooms = parsed.rooms.filter(r => r && r.id && !deletedIds.includes(r.id));
            }
            if (!parsed.messages) parsed.messages = {};
            Object.keys(parsed.messages).forEach(rId => {
              if (pruneExpiredMessagesArray(parsed.messages[rId])) {
                changed = true;
              }
            });
            if (changed) {
              localStorage.setItem(DB_KEY, JSON.stringify(parsed));
            }
            return parsed;
          } catch(e) {}
        }
        const defaultDB = { rooms: [], messages: {} };
        localStorage.setItem(DB_KEY, JSON.stringify(defaultDB));
        return defaultDB;
      }

      const seenMessageIds = new Set();
      try {
        const db = getLocalDB();
        if (db && db.messages) {
          Object.keys(db.messages).forEach(roomId => {
            db.messages[roomId].forEach(m => {
              if (m && m.id) seenMessageIds.add(m.id);
            });
          });
        }
      } catch (e) {}

      function checkAndNotifyNewMessage(msg) {
        if (!msg || !msg.id) return;
        if (seenMessageIds.has(msg.id)) return;
        seenMessageIds.add(msg.id);
        if (msg.sender !== getSessionUser()) {
          window.parent.postMessage({
            type: 'WETALKS_NEW_MESSAGE',
            payload: { sender: msg.sender, text: msg.text || (msg.image_base64 ? '📷 画像を送信しました' : '') }
          }, '*');
        }
      }

      function saveLocalDB(db) {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
      }

      const SESSION_USER_KEY = 'wetalks_session_user';
      let currentIp = "unknown_ip";
      let authMode = 'login'; // 'login' or 'signup'
      let selectedAvatarBase64 = null;
      let cachedUsers = [];
      let hasSupabaseUsersTableError = false;
      let hasSupabaseRoomsTableError = false;
      let hasSupabaseMessagesTableError = false;

      function withTimeout(promise, ms = 1500) {
        return Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), ms))
        ]);
      }

      function getBackendType() {
        const saved = localStorage.getItem('wetalks_backend_type_v2') || localStorage.getItem('wetalks_backend_type');
        if (saved) return saved;
        return 'cloudflare';
      }

      function getClientId() {
        let cid = sessionStorage.getItem('wetalks_client_id');
        if (!cid) {
          cid = 'c-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
          sessionStorage.setItem('wetalks_client_id', cid);
        }
        return cid;
      }

      const AUTH_TOKEN_KEY = 'wetalks_auth_token';

      function getAuthToken() {
        return sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY) || '';
      }

      function setAuthSession(username, token) {
        if (username) {
          localStorage.setItem('wetalks_logged_in_user', username);
          sessionStorage.setItem(SESSION_USER_KEY, username);
        }
        if (token) {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          sessionStorage.setItem(AUTH_TOKEN_KEY, token);
        }
      }

      function clearAuthSession() {
        sessionStorage.removeItem(SESSION_USER_KEY);
        localStorage.removeItem('wetalks_logged_in_user');
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }

      let serverOnlineCount = 1;
      let supabaseOnlineCount = 1;
      let serverRoomMembers = [];

      function getCloudflareUrl() {
        let url = (localStorage.getItem('wetalks_cloudflare_url') || 'https://wetalks-backend.mozunbu0123.workers.dev').trim();
        if (url.endsWith('/')) url = url.slice(0, -1);
        return url;
      }

      function buildApiUrl(endpoint) {
        const backend = getBackendType();
        const cfUrl = getCloudflareUrl();
        if (backend === 'cloudflare' && cfUrl) {
          return cfUrl + endpoint;
        }
        if (endpoint.startsWith('/')) {
          let baseOrigin = '';
          try {
            if (window.parent && window.parent.location && window.parent.location.origin && window.parent.location.origin !== 'null') {
              baseOrigin = window.parent.location.origin;
            }
          } catch(e) {}
          if (!baseOrigin) {
            try {
              if (localStorage.getItem('webos_app_origin')) {
                baseOrigin = localStorage.getItem('webos_app_origin');
              }
            } catch(e) {}
          }
          if (!baseOrigin) {
            try {
              if (window.location && window.location.origin && window.location.origin !== 'null') {
                baseOrigin = window.location.origin;
              }
            } catch(e) {}
          }
          if (!baseOrigin) {
            try {
              if (document.referrer && document.referrer.startsWith('http')) {
                baseOrigin = new URL(document.referrer).origin;
              }
            } catch(e) {}
          }
          return baseOrigin ? (baseOrigin + endpoint) : endpoint;
        }
        return endpoint;
      }

      async function callServerAPIWithStatus(endpoint, method = 'GET', body = null) {
        try {
          const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
          const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;
          const headers = {
            'Content-Type': 'application/json'
          };
          const token = getAuthToken();
          if (token) {
            headers['Authorization'] = 'Bearer ' + token;
          }
          const options = {
            method: method,
            signal: controller ? controller.signal : undefined,
            headers: headers
          };
          if (body) {
            options.body = JSON.stringify(body);
          }
          const res = await fetch(buildApiUrl(endpoint), options);
          if (timeoutId) clearTimeout(timeoutId);
          let data = null;
          try {
            data = await res.json();
          } catch(e) {}
          return { ok: res.ok, status: res.status, data: data };
        } catch (e) {
          return { ok: false, status: 0, data: null };
        }
      }

      async function callServerAPI(endpoint, method = 'GET', body = null) {
        const result = await callServerAPIWithStatus(endpoint, method, body);
        if (!result.ok) {
          return null;
        }
        return result.data;
      }

      async function loadCachedUsers() {
        // Load from local storage immediately first
        try {
          const localStored = JSON.parse(localStorage.getItem('wetalks_registered_users') || localStorage.getItem('wetalks_accounts_db') || '[]');
          if (localStored && localStored.length > 0) {
            cachedUsers = localStored;
          }
        } catch(e) {}

        const backend = getBackendType();
        if (backend !== 'supabase' || !supabaseClient || hasSupabaseUsersTableError) {
          try {
            const apiUsers = await callServerAPI('/api/wetalks/users');
            const userList = Array.isArray(apiUsers) ? apiUsers : (apiUsers && Array.isArray(apiUsers.users) ? apiUsers.users : []);
            if (userList.length > 0) {
              cachedUsers = userList.map(u => ({
                username: u.username,
                password: u.password_numeric ?? u.password,
                avatar: u.avatar_base64 || u.avatar
              }));
            }
          } catch(e) {}
          return;
        }
        try {
          const res = await withTimeout(supabaseClient.from('wetalks_users').select('*'), 1500);
          const data = res.data;
          const error = res.error;
          if (data && !error && data.length > 0) {
            cachedUsers = data.map(u => ({
              username: u.username,
              password: u.password_numeric ?? u.password,
              avatar: u.avatar_base64
            }));
          } else {
            if (error && (error.message && (error.message.includes("Could not find the table") || error.code === '42P01' || error.message.includes("schema cache")))) {
              hasSupabaseUsersTableError = true;
            }
            const apiUsers = await callServerAPI('/api/wetalks/users');
            const userList = Array.isArray(apiUsers) ? apiUsers : (apiUsers && Array.isArray(apiUsers.users) ? apiUsers.users : []);
            if (userList.length > 0) {
              cachedUsers = userList.map(u => ({
                username: u.username,
                password: u.password_numeric ?? u.password,
                avatar: u.avatar_base64 || u.avatar
              }));
            }
          }
        } catch(e) {
          hasSupabaseUsersTableError = true;
          try {
            const apiUsers = await callServerAPI('/api/wetalks/users');
            const userList = Array.isArray(apiUsers) ? apiUsers : (apiUsers && Array.isArray(apiUsers.users) ? apiUsers.users : []);
            if (userList.length > 0) {
              cachedUsers = userList.map(u => ({
                username: u.username,
                password: u.password_numeric ?? u.password,
                avatar: u.avatar_base64 || u.avatar
              }));
            }
          } catch(err) {}
        }
      }

      async function fetchUserIpAndInitName() {
        const token = getAuthToken();
        const loggedIn = localStorage.getItem('wetalks_logged_in_user');
        const backend = getBackendType();

        // Fetch IP in background
        fetch("https://api.ipify.org?format=json")
          .then(res => res.json())
          .then(data => { if (data && data.ip) currentIp = data.ip; })
          .catch(e => {});

        if (backend === 'internal' || backend === 'cloudflare') {
          if (!token && (!loggedIn || loggedIn === 'ゲスト')) {
            clearAuthSession();
            switchView('auth');
            return;
          }
          const meRes = token
            ? await callServerAPIWithStatus('/api/wetalks/auth/me', 'GET')
            : { ok: false, status: 401, data: null };
          if (meRes.ok && meRes.data && meRes.data.user && meRes.data.user.username) {
            setAuthSession(meRes.data.user.username, token);
            switchView('lobby');
            loadCachedUsers().then(() => syncServerPresence()).catch(() => {});
          } else if (meRes.status === 401) {
            clearAuthSession();
            switchView('auth');
            if (loggedIn && loggedIn !== 'ゲスト' && DOM.authError) {
              DOM.authError.textContent = 'サーバー更新またはセッション期限切れのため、再度ログインしてください。';
              DOM.authError.style.display = 'block';
            }
          } else if ((meRes.status === 404 || meRes.status === 0) && loggedIn && loggedIn !== 'ゲスト') {
            sessionStorage.setItem(SESSION_USER_KEY, loggedIn);
            switchView('lobby');
            loadCachedUsers().then(() => syncServerPresence()).catch(() => {});
          } else {
            clearAuthSession();
            switchView('auth');
          }
          return;
        }

        if (!loggedIn || loggedIn === 'ゲスト') {
          clearAuthSession();
          switchView('auth');
          return;
        }

        sessionStorage.setItem(SESSION_USER_KEY, loggedIn);
        switchView('lobby');
        loadCachedUsers().catch(() => {});
      }

      function getSessionUser() {
        return sessionStorage.getItem(SESSION_USER_KEY) || "ゲスト";
      }

      function getUserAvatar(username) {
        try {
          const found = cachedUsers.find(u => u.username === username);
          if (found && found.avatar) return found.avatar;
        } catch(e) {}
        return '';
      }

      let currentView = 'lobby';
      let activeRoomId = null;
      let supabaseClient = null;
      let msgChannel = null;
      let presenceChannel = null;
      let roomPresenceMembers = [];

      const ACTIVE_USERS_KEY = 'wetalks_active_users_in_rooms_v1';
      const READ_MAP_KEY = 'wetalks_read_messages_map_v1';
      let localPresenceInterval = null;

      function markMessageAsReadLocal(msgId, count) {
        let map = {};
        try {
          const raw = localStorage.getItem(READ_MAP_KEY);
          if (raw) map = JSON.parse(raw);
        } catch(e) {}
        if (!map[msgId] || map[msgId] < count) {
          map[msgId] = count;
          localStorage.setItem(READ_MAP_KEY, JSON.stringify(map));
          return true;
        }
        return false;
      }

      function getMessageReadCountLocal(msgId) {
        let map = {};
        try {
          const raw = localStorage.getItem(READ_MAP_KEY);
          if (raw) map = JSON.parse(raw);
        } catch(e) {}
        return map[msgId] || 0;
      }

      function startLocalPresence() {
        if (localPresenceInterval) clearInterval(localPresenceInterval);
        localPresenceInterval = setInterval(() => {
          if (!activeRoomId) return;
          let data = {};
          try {
            const raw = localStorage.getItem(ACTIVE_USERS_KEY);
            if (raw) data = JSON.parse(raw);
          } catch(e) {}
          if (!data[activeRoomId]) data[activeRoomId] = {};
          data[activeRoomId][getSessionUser()] = Date.now();
          localStorage.setItem(ACTIVE_USERS_KEY, JSON.stringify(data));
          updateReadReceipts();
        }, 1000);
      }

      function stopLocalPresence() {
        if (localPresenceInterval) {
          clearInterval(localPresenceInterval);
          localPresenceInterval = null;
        }
        if (!activeRoomId) return;
        let data = {};
        try {
          const raw = localStorage.getItem(ACTIVE_USERS_KEY);
          if (raw) data = JSON.parse(raw);
        } catch(e) {}
        if (data[activeRoomId]) {
          delete data[activeRoomId][getSessionUser()];
          localStorage.setItem(ACTIVE_USERS_KEY, JSON.stringify(data));
        }
      }

      function updateReadReceipts() {
        const myName = getSessionUser();
        let otherActiveCount = 0;

        if (supabaseClient) {
          otherActiveCount = roomPresenceMembers.filter(member => member !== myName).length;
        } else if (serverRoomMembers && serverRoomMembers.length > 0) {
          otherActiveCount = serverRoomMembers.filter(member => member !== myName).length;
        } else {
          let data = {};
          try {
            const raw = localStorage.getItem(ACTIVE_USERS_KEY);
            if (raw) data = JSON.parse(raw);
          } catch(e) {}
          const membersInRoom = data[activeRoomId] || {};
          const now = Date.now();
          const activeMembers = Object.keys(membersInRoom).filter(user => {
            return user !== myName && (now - membersInRoom[user]) < 5000;
          });
          otherActiveCount = activeMembers.length;
        }

        if (otherActiveCount > 0) {
          const db = getLocalDB();
          const msgs = db.messages[activeRoomId] || [];
          let changed = false;
          msgs.forEach(m => {
            if (m.sender === getSessionUser()) {
              if (markMessageAsReadLocal(m.id, otherActiveCount)) {
                changed = true;
              }
            }
          });
          if (changed && !supabaseClient) {
            saveLocalDB(db);
          }
        }

        document.querySelectorAll('.msg.me').forEach(el => {
          const msgId = el.getAttribute('data-msgid');
          let count = getMessageReadCountLocal(msgId);
          count = Math.max(count, otherActiveCount);
          const readStatusEl = el.querySelector('.msg-read-status');
          if (readStatusEl) {
            readStatusEl.textContent = count > 0 ? (count > 1 ? "既読 " + count : "既読") : "";
          }
        });
      }

      let unreadCounts = {};

      const DOM = {
        viewAuth: document.getElementById('view-auth'),
        authTabLogin: document.getElementById('auth-tab-login'),
        authTabSignup: document.getElementById('auth-tab-signup'),
        authUsername: document.getElementById('auth-username'),
        authPassword: document.getElementById('auth-password'),
        authError: document.getElementById('auth-error'),
        btnAuthSubmit: document.getElementById('btn-auth-submit'),
        profileAvatarPreview: document.getElementById('profile-avatar-preview'),
        profileAvatarFile: document.getElementById('profile-avatar-file'),
        btnLogout: document.getElementById('btn-logout'),
        viewLobby: document.getElementById('view-lobby'),
        viewChat: document.getElementById('view-chat'),
        viewSettings: document.getElementById('view-settings'),
        btnBack: document.getElementById('btn-back'),
        btnToSettings: document.getElementById('btn-to-settings'),
        titleText: document.getElementById('title-text'),
        roomList: document.getElementById('room-list-container'),
        messageContainer: document.getElementById('message-container'),
        msgInput: document.getElementById('msg-input'),
        btnSend: document.getElementById('btn-send'),
        msgImageFile: document.getElementById('msg-image-file'),
        btnImageAttach: document.getElementById('btn-image-attach'),
        msgImagePreviewBar: document.getElementById('msg-image-preview-bar'),
        msgImagePreviewThumb: document.getElementById('msg-image-preview-thumb'),
        msgImagePreviewName: document.getElementById('msg-image-preview-name'),
        btnClearMsgImage: document.getElementById('btn-clear-msg-image'),
        modalImageViewer: document.getElementById('modal-image-viewer'),
        imageViewerImg: document.getElementById('image-viewer-img'),
        btnCloseImageViewer: document.getElementById('btn-close-image-viewer'),
        modalConfirmAction: document.getElementById('modal-confirm-action'),
        confirmActionTitle: document.getElementById('confirm-action-title'),
        confirmActionMessage: document.getElementById('confirm-action-message'),
        btnConfirmActionCancel: document.getElementById('btn-confirm-action-cancel'),
        btnConfirmActionOk: document.getElementById('btn-confirm-action-ok'),
        lobbyUsernameTag: document.getElementById('lobby-username-tag'),
        lobbyUsernameEditBtn: document.getElementById('lobby-username-edit-btn'),
        lobbyOnlineCountTag: document.getElementById('lobby-online-count-tag'),
        btnSaveSettings: document.getElementById('btn-save-settings'),
        tabProviderCf: document.getElementById('tab-provider-cf'),
        tabProviderSupabase: document.getElementById('tab-provider-supabase'),
        tabProviderInternal: document.getElementById('tab-provider-internal'),
        sectionCfSettings: document.getElementById('section-cf-settings'),
        sectionSupabaseSettings: document.getElementById('section-supabase-settings'),
        sectionInternalSettings: document.getElementById('section-internal-settings'),
        inputCfUrl: document.getElementById('input-cf-url'),
        btnCfTest: document.getElementById('btn-cf-test'),
        cfTestResult: document.getElementById('cf-test-result'),
        btnCopySql: document.getElementById('btn-copy-sql'),
        cfSchemaSql: document.getElementById('cf-schema-sql'),
        inputSupabaseUrl: document.getElementById('input-supabase-url'),
        inputSupabaseKey: document.getElementById('input-supabase-key'),
        settingsActiveBackendBanner: document.getElementById('settings-active-backend-banner'),
        settingsActiveBackendLabel: document.getElementById('settings-active-backend-label'),
        btnAdminInspectActive: document.getElementById('btn-admin-inspect-active'),
        btnAdminInspectCf: document.getElementById('btn-admin-inspect-cf'),
        btnAdminPruneImages: document.getElementById('btn-admin-prune-images'),
        adminStorageStatus: document.getElementById('admin-storage-status'),
        adminStatUsers: document.getElementById('admin-stat-users'),
        adminStatRooms: document.getElementById('admin-stat-rooms'),
        adminStatMessages: document.getElementById('admin-stat-messages'),
        adminStatImages: document.getElementById('admin-stat-images'),
        tabAdminUsers: document.getElementById('tab-admin-users'),
        tabAdminRooms: document.getElementById('tab-admin-rooms'),
        tabAdminMessages: document.getElementById('tab-admin-messages'),
        adminPanelUsers: document.getElementById('admin-panel-users'),
        adminPanelRooms: document.getElementById('admin-panel-rooms'),
        adminPanelMessages: document.getElementById('admin-panel-messages'),
        adminUserList: document.getElementById('admin-user-list'),
        adminMessageList: document.getElementById('admin-message-list'),
        modalCreate: document.getElementById('modal-create-room'),
        btnOpenCreate: document.getElementById('btn-open-create-modal'),
        btnCreateCancel: document.getElementById('btn-create-cancel'),
        btnCreateConfirm: document.getElementById('btn-create-confirm'),
        inputNewRoomName: document.getElementById('input-new-room-name'),
        selectNewRoomType: document.getElementById('select-new-room-type'),
        containerRoomName: document.getElementById('container-room-name'),
        containerDirectTarget: document.getElementById('container-direct-target'),
        selectDirectTarget: document.getElementById('select-direct-target'),
        createRoomError: document.getElementById('create-room-error'),
        modalPasscode: document.getElementById('modal-passcode'),
        inputPasscode: document.getElementById('input-passcode'),
        btnPasscodeCancel: document.getElementById('btn-passcode-cancel'),
        btnPasscodeConfirm: document.getElementById('btn-passcode-confirm'),
        passcodeError: document.getElementById('passcode-error'),
        modalUsername: document.getElementById('modal-change-username'),
        inputNewUsername: document.getElementById('input-new-username'),
        usernameChangeError: document.getElementById('username-change-error'),
        btnUsernameCancel: document.getElementById('btn-username-cancel'),
        btnUsernameConfirm: document.getElementById('btn-username-confirm')
      };

      let syncIntervalTimer = null;

      async function initSupabase() {
        const backend = getBackendType();

        if (syncIntervalTimer) {
          clearInterval(syncIntervalTimer);
          syncIntervalTimer = null;
        }

        if (backend === 'cloudflare' || backend === 'internal') {
          // Cloudflare or Internal Server polling sync
          await loadCachedUsers();
          initGlobalPresence();

          if (currentView === 'lobby') {
            renderLobby();
          }
          return;
        }

        // Supabase mode
        let url = localStorage.getItem('wetalks_supabase_url');
        let key = localStorage.getItem('wetalks_supabase_key');
        if (!url || !key) {
          url = 'https://nsyvlftqcciyetsbhymg.supabase.co';
          key = 'sb_publishable_lkhrFuMlNyEmUX4RTFApKw_AhD1sAkV';
          localStorage.setItem('wetalks_supabase_url', url);
          localStorage.setItem('wetalks_supabase_key', key);
        }

        if (typeof supabase === 'undefined' && window.supabase === undefined) {
          for (let i = 0; i < 30; i++) {
            if (typeof supabase !== 'undefined' || window.supabase !== undefined) break;
            await new Promise(r => setTimeout(r, 100));
          }
        }

        const supabaseLib = (typeof supabase !== 'undefined') ? supabase : (window.supabase || null);

        if (url && key && supabaseLib) {
          try {
            supabaseClient = supabaseLib.createClient(url, key);
            initGlobalPresence();
            initGlobalMessageListener();
            await loadCachedUsers();
          } catch(e) {
            console.error("Failed to initialize Supabase:", e);
            supabaseClient = null;
            initGlobalPresence();
            await loadCachedUsers();
          }
        } else {
          supabaseClient = null;
          initGlobalPresence();
          await loadCachedUsers();
        }

        if (currentView === 'lobby') {
          renderLobby();
        }
      }

      function sendOfflinePresence() {
        const backend = getBackendType();
        if (backend !== 'internal' && backend !== 'cloudflare') return;
        try {
          const headers = { 'Content-Type': 'application/json' };
          const token = getAuthToken();
          if (token) headers['Authorization'] = 'Bearer ' + token;
          fetch(buildApiUrl('/api/wetalks/presence'), {
            method: 'POST',
            headers,
            keepalive: true,
            body: JSON.stringify({ clientId: getClientId(), offline: true })
          }).catch(() => {});
        } catch(e) {}
      }

      async function syncServerPresence() {
        const backend = getBackendType();
        if (backend !== 'internal' && backend !== 'cloudflare') return;
        const uname = getSessionUser();
        if (!uname || uname === 'ゲスト') return;
        try {
          const res = await callServerAPI('/api/wetalks/presence', 'POST', {
            clientId: getClientId(),
            username: uname,
            roomId: currentView === 'chat' ? activeRoomId : null
          });
          if (res && typeof res.onlineCount === 'number') {
            if (res.presenceSupported) {
              serverOnlineCount = Math.max(1, res.onlineCount);
            } else {
              // Fallback if deployed Cloudflare Worker returns registered user count without active presence tracking
              serverOnlineCount = Math.max(1, Array.isArray(res.onlineUsers) ? res.onlineUsers.length : 1);
            }
            serverRoomMembers = Array.isArray(res.roomMembers) ? res.roomMembers : [];
            if (DOM.lobbyOnlineCountTag && !supabaseClient) {
              DOM.lobbyOnlineCountTag.textContent = "● オンライン: " + serverOnlineCount + "人";
            }
            if (currentView === 'chat') {
              updateReadReceipts();
            }
          }
        } catch(e) {}
      }

      async function pollActiveRoomMessages() {
        const targetRoomId = activeRoomId;
        if (!targetRoomId) return;
        try {
          syncServerPresence();
          const rawApiMsgs = await callServerAPI('/api/wetalks/messages/' + encodeURIComponent(targetRoomId));
          if (targetRoomId !== activeRoomId) return;
          const apiMsgs = Array.isArray(rawApiMsgs)
            ? rawApiMsgs
            : (rawApiMsgs && Array.isArray(rawApiMsgs.messages) ? rawApiMsgs.messages : null);
          if (apiMsgs) {
            const db = getLocalDB();
            if (!db.messages) db.messages = {};
            const serverIds = new Set(apiMsgs.filter(m => m && m.id).map(m => String(m.id)));
            const existingMap = new Map();
            (db.messages[targetRoomId] || []).forEach(m => {
              if (m && m.id && m._pendingSync && !serverIds.has(String(m.id))) {
                existingMap.set(m.id, m);
              }
            });
            apiMsgs.forEach(m => { if (m && m.id) existingMap.set(m.id, m); });
            const merged = Array.from(existingMap.values()).sort((a, b) =>
              String(a.created_at || '').localeCompare(String(b.created_at || ''))
            );
            db.messages[targetRoomId] = merged;
            saveLocalDB(db);

            let hasNew = false;
            apiMsgs.forEach(msg => {
              if (msg && msg.id) {
                checkAndNotifyNewMessage(msg);
                const alreadyInDom = DOM.messageContainer && Array.from(DOM.messageContainer.children).some(el => el.getAttribute('data-msgid') === String(msg.id));
                if (!alreadyInDom) {
                  appendMessageBubble(msg);
                  hasNew = true;
                }
              }
            });
            if (hasNew && DOM.messageContainer) {
              DOM.messageContainer.scrollTop = DOM.messageContainer.scrollHeight;
            }
          }
        } catch(e) {}
      }

      async function pollLobbyUpdates() {
        try {
          await Promise.allSettled([loadCachedUsers(), syncServerPresence()]);
          const count = supabaseClient
            ? Math.max(supabaseOnlineCount || 1, 1)
            : Math.max(serverOnlineCount || 1, 1);
          if (DOM.lobbyOnlineCountTag) {
            DOM.lobbyOnlineCountTag.textContent = "● オンライン: " + count + "人";
          }
          await renderLobby();
        } catch(e) {}
      }

      function initGlobalPresence() {
        if (!supabaseClient) {
          const count = Math.max(serverOnlineCount || 1, 1);
          if (DOM.lobbyOnlineCountTag) {
            DOM.lobbyOnlineCountTag.textContent = "● オンライン: " + count + "人";
          }
          return;
        }
        try {
          presenceChannel = supabaseClient.channel('global-online-presence');
          presenceChannel
            .on('presence', { event: 'sync' }, () => {
              const state = presenceChannel.presenceState();
              const uniqueUsers = new Set();
              Object.values(state).forEach(presences => {
                (presences || []).forEach(p => {
                  if (p && p.user && p.user !== 'ゲスト') uniqueUsers.add(String(p.user).toLowerCase());
                });
              });
              supabaseOnlineCount = Math.max(1, uniqueUsers.size || Object.keys(state).length);
              if (DOM.lobbyOnlineCountTag) {
                DOM.lobbyOnlineCountTag.textContent = "● オンライン: " + supabaseOnlineCount + "人";
              }
            })
            .subscribe(async (status) => {
              if (status === 'SUBSCRIBED') {
                try {
                  await presenceChannel.track({ user: getSessionUser(), onlineAt: new Date().toISOString() });
                } catch(e) {}
              } else {
                if (DOM.lobbyOnlineCountTag) {
                  DOM.lobbyOnlineCountTag.textContent = "● オンライン: " + Math.max(supabaseOnlineCount || 1, 1) + "人";
                }
              }
            });
        } catch(e) {
          if (DOM.lobbyOnlineCountTag) {
            DOM.lobbyOnlineCountTag.textContent = "● オンライン: " + Math.max(supabaseOnlineCount || 1, 1) + "人";
          }
        }
      }

      function initGlobalMessageListener() {
        if (!supabaseClient) return;
        supabaseClient
          .channel('global-messages-unread')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
            const msg = payload.new;
            checkAndNotifyNewMessage(msg);
            if (msg.room_id !== activeRoomId && msg.sender !== getSessionUser()) {
              unreadCounts[msg.room_id] = (unreadCounts[msg.room_id] || 0) + 1;
              if (currentView === 'lobby') renderLobby();
            }
          })
          .subscribe();
      }

      let selectedBackendSettingTab = getBackendType();

      function updateSettingsTabsUI(selected) {
        selectedBackendSettingTab = selected;
        if (DOM.tabProviderCf) {
          DOM.tabProviderCf.style.background = selected === 'cloudflare' ? 'white' : 'transparent';
          DOM.tabProviderCf.style.color = selected === 'cloudflare' ? '#f48120' : '#666';
        }
        if (DOM.tabProviderSupabase) {
          DOM.tabProviderSupabase.style.background = selected === 'supabase' ? 'white' : 'transparent';
          DOM.tabProviderSupabase.style.color = selected === 'supabase' ? '#3ecf8e' : '#666';
        }
        if (DOM.tabProviderInternal) {
          DOM.tabProviderInternal.style.background = selected === 'internal' ? 'white' : 'transparent';
          DOM.tabProviderInternal.style.color = selected === 'internal' ? '#333' : '#666';
        }

        if (DOM.sectionCfSettings) DOM.sectionCfSettings.style.display = selected === 'cloudflare' ? 'flex' : 'none';
        if (DOM.sectionSupabaseSettings) DOM.sectionSupabaseSettings.style.display = selected === 'supabase' ? 'flex' : 'none';
        if (DOM.sectionInternalSettings) DOM.sectionInternalSettings.style.display = selected === 'internal' ? 'flex' : 'none';
      }

      let verifiedAdminPasscode = '';
      let adminInspectMode = 'active'; // 'active' or 'cloudflare'
      let selectedAdminTab = 'users';

      function updateActiveBackendBanner() {
        if (!DOM.settingsActiveBackendLabel) return;
        const active = getBackendType();
        if (active === 'cloudflare') {
          DOM.settingsActiveBackendLabel.textContent = '☁️ Cloudflare Worker (' + getCloudflareUrl() + ')';
          if (DOM.settingsActiveBackendBanner) {
            DOM.settingsActiveBackendBanner.style.background = '#fff7ed';
            DOM.settingsActiveBackendBanner.style.borderColor = '#fdba74';
          }
        } else if (active === 'supabase') {
          DOM.settingsActiveBackendLabel.textContent = '⚡ Supabase';
          if (DOM.settingsActiveBackendBanner) {
            DOM.settingsActiveBackendBanner.style.background = '#ecfdf5';
            DOM.settingsActiveBackendBanner.style.borderColor = '#6ee7b7';
          }
        } else {
          DOM.settingsActiveBackendLabel.textContent = '🖥️ 内蔵 Express サーバー (Cloudflare未切替)';
          if (DOM.settingsActiveBackendBanner) {
            DOM.settingsActiveBackendBanner.style.background = '#f8fafc';
            DOM.settingsActiveBackendBanner.style.borderColor = '#cbd5e1';
          }
        }
      }

      function switchAdminDashboardTab(tab) {
        selectedAdminTab = tab;
        const tabs = [
          { id: 'users', btn: DOM.tabAdminUsers, panel: DOM.adminPanelUsers },
          { id: 'rooms', btn: DOM.tabAdminRooms, panel: DOM.adminPanelRooms },
          { id: 'messages', btn: DOM.tabAdminMessages, panel: DOM.adminPanelMessages }
        ];
        tabs.forEach(t => {
          const isSelected = t.id === tab;
          if (t.btn) {
            t.btn.style.background = isSelected ? 'white' : 'transparent';
            t.btn.style.color = isSelected ? '#0f172a' : '#475569';
          }
          if (t.panel) {
            t.panel.style.display = isSelected ? 'flex' : 'none';
          }
        });
      }

      function buildAdminTargetUrl(endpoint, forceCf) {
        if (forceCf) {
          let cfUrl = ((DOM.inputCfUrl && DOM.inputCfUrl.value) || getCloudflareUrl()).trim();
          if (cfUrl.endsWith('/')) cfUrl = cfUrl.slice(0, -1);
          return cfUrl + endpoint;
        }
        return buildApiUrl(endpoint);
      }

      function showConfirmDialog(title, message) {
        return new Promise((resolve) => {
          if (!DOM.modalConfirmAction || !DOM.btnConfirmActionOk || !DOM.btnConfirmActionCancel) {
            try {
              resolve(confirm(message));
            } catch (e) {
              resolve(true);
            }
            return;
          }
          if (DOM.confirmActionTitle) DOM.confirmActionTitle.textContent = title || '確認';
          if (DOM.confirmActionMessage) DOM.confirmActionMessage.textContent = message || '';
          DOM.modalConfirmAction.classList.add('active');

          const cleanup = (result) => {
            DOM.modalConfirmAction.classList.remove('active');
            DOM.btnConfirmActionOk.removeEventListener('click', onOk);
            DOM.btnConfirmActionCancel.removeEventListener('click', onCancel);
            DOM.modalConfirmAction.removeEventListener('click', onBackdrop);
            resolve(result);
          };
          const onOk = (e) => { if (e) { e.preventDefault(); e.stopPropagation(); } cleanup(true); };
          const onCancel = (e) => { if (e) { e.preventDefault(); e.stopPropagation(); } cleanup(false); };
          const onBackdrop = (e) => { if (e && e.target === DOM.modalConfirmAction) cleanup(false); };

          DOM.btnConfirmActionOk.addEventListener('click', onOk);
          DOM.btnConfirmActionCancel.addEventListener('click', onCancel);
          DOM.modalConfirmAction.addEventListener('click', onBackdrop);
        });
      }

      async function callAdminApi(endpoint, method = 'GET', forceCf = false) {
        const sep = endpoint.includes('?') ? '&' : '?';
        const fullUrl = buildAdminTargetUrl(endpoint + sep + 'passcode=' + encodeURIComponent(verifiedAdminPasscode || ''), forceCf);
        const opts = { method: method };
        if (method !== 'GET' && method !== 'HEAD') {
          opts.headers = { 'Content-Type': 'application/json' };
        }
        const res = await fetch(fullUrl, opts);
        let data = null;
        try { data = await res.json(); } catch(e) {}
        return { ok: res.ok, status: res.status, data: data };
      }

      async function loadAdminOverview(mode) {
        adminInspectMode = mode || adminInspectMode || 'active';
        const forceCf = adminInspectMode === 'cloudflare';
        const targetBackend = forceCf ? 'cloudflare' : getBackendType();

        if (DOM.adminStorageStatus) {
          DOM.adminStorageStatus.style.background = '#fffbeb';
          DOM.adminStorageStatus.style.borderColor = '#fcd34d';
          DOM.adminStorageStatus.style.color = '#92400e';
          DOM.adminStorageStatus.textContent = (forceCf ? '☁️ Cloudflare Worker ' : '🔄 現在の保存先 ') + 'から保存データを取得中...';
        }

        if (targetBackend === 'supabase' && !forceCf) {
          if (DOM.adminStorageStatus) {
            DOM.adminStorageStatus.textContent = '⚡ Supabase モードが選択されています。Cloudflare のデータを確認するには「☁️ Cloudflare を直接確認」を押してください。';
          }
          renderSettingsRoomList();
          return;
        }

        try {
          let res = await callAdminApi('/api/wetalks/admin/overview', 'GET', forceCf);
          let isLegacyWorker = false;

          // Fallback for older deployed Cloudflare Worker without /api/wetalks/admin/overview
          if (res.status === 404) {
            isLegacyWorker = true;
            const [healthRes, usersRes, roomsRes] = await Promise.all([
              fetch(buildAdminTargetUrl('/api/wetalks/health', forceCf)).then(r => r.ok ? r.json() : null).catch(() => null),
              fetch(buildAdminTargetUrl('/api/wetalks/users', forceCf)).then(r => r.ok ? r.json() : []).catch(() => []),
              fetch(buildAdminTargetUrl('/api/wetalks/rooms', forceCf)).then(r => r.ok ? r.json() : []).catch(() => [])
            ]);
            const legacyUsers = Array.isArray(usersRes) ? usersRes : (usersRes && Array.isArray(usersRes.users) ? usersRes.users : []);
            const legacyRoomsRaw = Array.isArray(roomsRes) ? roomsRes : (roomsRes && Array.isArray(roomsRes.rooms) ? roomsRes.rooms : []);
            const deletedRoomIds = getDeletedRoomIds();
            const legacyRooms = legacyRoomsRaw.filter(r => r && r.id && !deletedRoomIds.includes(r.id));
            let allLegacyMsgs = [];
            const roomCounts = {};
            for (const rm of legacyRooms.slice(0, 15)) {
              try {
                const rms = await fetch(buildAdminTargetUrl('/api/wetalks/messages/' + encodeURIComponent(rm.id), forceCf)).then(r => r.ok ? r.json() : []).catch(() => []);
                if (Array.isArray(rms)) {
                  roomCounts[rm.id] = rms.length;
                  rms.forEach(m => allLegacyMsgs.push({ ...m, room_name: rm.name }));
                }
              } catch(e) {}
            }
            allLegacyMsgs.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
            res = {
              ok: true,
              status: 200,
              data: {
                success: true,
                backend: (healthRes && healthRes.hasD1) ? 'Cloudflare D1 (旧Worker)' : 'Cloudflare KV/旧Worker',
                storage_verified: !!(healthRes && (healthRes.hasD1 || healthRes.hasKV)),
                image_retention_days: 10,
                counts: {
                  users: legacyUsers.length,
                  rooms: legacyRooms.length,
                  messages: allLegacyMsgs.length,
                  images: allLegacyMsgs.filter(m => !!m.image_base64).length
                },
                users: legacyUsers.map(u => ({
                  username: u.username,
                  has_password: !!(u.password_numeric || u.password || u.password_hash),
                  password_storage: (u.password_numeric || u.password) ? '旧Worker保存 (平文)' : '確認不可',
                  avatar_base64: u.avatar_base64 || ''
                })),
                rooms: legacyRooms.map(r => ({ ...r, message_count: roomCounts[r.id] || 0 })),
                recent_messages: allLegacyMsgs.slice(0, 50).map(m => ({
                  ...m,
                  has_image: !!m.image_base64
                }))
              }
            };
          }

          if (!res.ok || !res.data || !res.data.success) {
            if (DOM.adminStorageStatus) {
              DOM.adminStorageStatus.style.background = '#fef2f2';
              DOM.adminStorageStatus.style.borderColor = '#fca5a5';
              DOM.adminStorageStatus.style.color = '#991b1b';
              DOM.adminStorageStatus.textContent = '❌ 取得失敗: ' + ((res.data && res.data.error) || ('HTTP ' + res.status + ' — Worker のデプロイまたは接続先 URL を確認してください。'));
            }
            return;
          }

          const ov = res.data;
          if (DOM.adminStorageStatus) {
            if (isLegacyWorker) {
              DOM.adminStorageStatus.style.background = '#fffbeb';
              DOM.adminStorageStatus.style.borderColor = '#fcd34d';
              DOM.adminStorageStatus.style.color = '#92400e';
              DOM.adminStorageStatus.textContent = '⚠️ 旧バージョンの Cloudflare Worker が稼働中です (' + ov.backend + ')。パスワード暗号化や10日画像自動削除を有効にするには、最新の cloudflare/worker.js を Cloudflare に再デプロイしてください。';
            } else if (ov.storage_verified) {
              DOM.adminStorageStatus.style.background = '#f0fdf4';
              DOM.adminStorageStatus.style.borderColor = '#86efac';
              DOM.adminStorageStatus.style.color = '#166534';
              DOM.adminStorageStatus.textContent = '✅ 保存確認OK: ' + (ov.backend || 'Server') + ' に接続・保存されています（画像保持: ' + (ov.image_retention_days || 10) + '日間）';
            } else {
              DOM.adminStorageStatus.style.background = '#fef2f2';
              DOM.adminStorageStatus.style.borderColor = '#fca5a5';
              DOM.adminStorageStatus.style.color = '#991b1b';
              DOM.adminStorageStatus.textContent = '⚠️ 注意: ' + (ov.backend || 'ストレージ未設定') + ' — D1 または KV がバインドされていないためデータは保存されません。';
            }
          }

          if (DOM.adminStatUsers) DOM.adminStatUsers.textContent = String((ov.counts && ov.counts.users) || 0);
          if (DOM.adminStatRooms) DOM.adminStatRooms.textContent = String((ov.counts && ov.counts.rooms) || 0);
          if (DOM.adminStatMessages) DOM.adminStatMessages.textContent = String((ov.counts && ov.counts.messages) || 0);
          if (DOM.adminStatImages) DOM.adminStatImages.textContent = String((ov.counts && ov.counts.images) || 0);

          // Render users list
          if (DOM.adminUserList) {
            DOM.adminUserList.innerHTML = '';
            const users = ov.users || [];
            if (users.length === 0) {
              DOM.adminUserList.innerHTML = '<li style="font-size:11px; color:#64748b; text-align:center; padding:10px; background:#f8fafc; border-radius:6px;">登録ユーザーはまだありません。</li>';
            } else {
              users.forEach(u => {
                const li = document.createElement('li');
                li.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px; gap:8px;';
                const infoDiv = document.createElement('div');
                infoDiv.style.cssText = 'min-width:0; flex:1;';
                const nameEl = document.createElement('div');
                nameEl.style.cssText = 'font-size:12px; font-weight:bold; color:#0f172a;';
                nameEl.textContent = u.username;
                const pwEl = document.createElement('div');
                pwEl.style.cssText = 'font-size:10px; color:' + (u.has_password ? '#16a34a' : '#dc2626') + ';';
                pwEl.textContent = 'パスワード: ' + (u.has_password ? ('✅ ' + (u.password_storage || '保存済み')) : '❌ 未保存');
                infoDiv.appendChild(nameEl);
                infoDiv.appendChild(pwEl);

                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.textContent = '削除';
                delBtn.style.cssText = 'background:#ef4444; color:#fff; border:none; border-radius:4px; padding:4px 10px; font-size:10px; font-weight:bold; cursor:pointer; flex-shrink:0;';
                delBtn.addEventListener('click', async () => {
                  const confirmed = await showConfirmDialog('ユーザーの削除', 'ユーザー「' + u.username + '」をサーバーから削除しますか？');
                  if (!confirmed) return;
                  delBtn.disabled = true;
                  try {
                    await callAdminApi('/api/wetalks/admin/users/' + encodeURIComponent(u.username), 'DELETE', forceCf);
                    await loadAdminOverview(adminInspectMode);
                  } finally {
                    delBtn.disabled = false;
                  }
                });
                li.appendChild(infoDiv);
                li.appendChild(delBtn);
                DOM.adminUserList.appendChild(li);
              });
            }
          }

          // Render messages & images list
          if (DOM.adminMessageList) {
            DOM.adminMessageList.innerHTML = '';
            const msgs = ov.recent_messages || [];
            if (msgs.length === 0) {
              DOM.adminMessageList.innerHTML = '<li style="font-size:11px; color:#64748b; text-align:center; padding:10px; background:#f8fafc; border-radius:6px;">チャット履歴はまだありません。</li>';
            } else {
              msgs.forEach(m => {
                const li = document.createElement('li');
                li.style.cssText = 'display:flex; justify-content:space-between; align-items:flex-start; background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px; gap:8px;';
                const left = document.createElement('div');
                left.style.cssText = 'min-width:0; flex:1; display:flex; flex-direction:column; gap:3px;';
                const head = document.createElement('div');
                head.style.cssText = 'font-size:10px; color:#64748b;';
                const dt = m.created_at ? new Date(m.created_at).toLocaleString('ja-JP') : '';
                head.textContent = (m.sender || '') + ' • [' + (m.room_name || m.room_id) + '] • ' + dt;
                left.appendChild(head);

                if (m.text) {
                  const txt = document.createElement('div');
                  txt.style.cssText = 'font-size:12px; color:#0f172a; word-break:break-word;';
                  txt.textContent = m.text;
                  left.appendChild(txt);
                }

                if (m.has_image && m.image_base64 && m.image_base64.startsWith('data:image/')) {
                  const imgWrap = document.createElement('div');
                  imgWrap.style.cssText = 'display:flex; align-items:center; gap:8px; margin-top:2px;';
                  const thumb = document.createElement('img');
                  thumb.src = m.image_base64;
                  thumb.style.cssText = 'width:44px; height:44px; object-fit:cover; border-radius:4px; border:1px solid #cbd5e1; cursor:pointer;';
                  thumb.addEventListener('click', () => {
                    if (DOM.imageViewerImg && DOM.modalImageViewer) {
                      DOM.imageViewerImg.src = m.image_base64;
                      DOM.modalImageViewer.classList.add('active');
                    }
                  });
                  const expText = document.createElement('span');
                  expText.style.cssText = 'font-size:10px; color:#0284c7; font-weight:bold;';
                  let remText = '🖼️ 10日自動削除対象';
                  if (m.image_expires_at) {
                    const remDays = Math.max(0, Math.ceil((Date.parse(m.image_expires_at) - Date.now()) / (24 * 60 * 60 * 1000)));
                    remText = '🖼️ 残り約' + remDays + '日で自動削除';
                  }
                  expText.textContent = remText;
                  imgWrap.appendChild(thumb);
                  imgWrap.appendChild(expText);
                  left.appendChild(imgWrap);
                } else if (m.image_expired) {
                  const expNote = document.createElement('div');
                  expNote.style.cssText = 'font-size:10px; color:#64748b;';
                  expNote.textContent = '🖼️ 画像は10日経過により自動削除済み';
                  left.appendChild(expNote);
                }

                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.textContent = '削除';
                delBtn.style.cssText = 'background:#ef4444; color:#fff; border:none; border-radius:4px; padding:4px 8px; font-size:10px; font-weight:bold; cursor:pointer; flex-shrink:0;';
                delBtn.addEventListener('click', async () => {
                  const confirmed = await showConfirmDialog('履歴の削除', 'この履歴を削除しますか？');
                  if (!confirmed) return;
                  delBtn.disabled = true;
                  try {
                    await callAdminApi('/api/wetalks/admin/messages/' + encodeURIComponent(m.id), 'DELETE', forceCf);
                    await loadAdminOverview(adminInspectMode);
                  } finally {
                    delBtn.disabled = false;
                  }
                });

                li.appendChild(left);
                li.appendChild(delBtn);
                DOM.adminMessageList.appendChild(li);
              });
            }
          }
          await renderSettingsRoomList(ov.rooms || [], forceCf);
          return;
        } catch (err) {
          if (DOM.adminStorageStatus) {
            DOM.adminStorageStatus.style.background = '#fef2f2';
            DOM.adminStorageStatus.style.borderColor = '#fca5a5';
            DOM.adminStorageStatus.style.color = '#991b1b';
            DOM.adminStorageStatus.textContent = '❌ 接続エラー: ' + ((err && err.message) || 'バックエンドに接続できませんでした。');
          }
        }
        renderSettingsRoomList(null, forceCf);
      }

      function switchView(view) {
        currentView = view;
        DOM.viewAuth.style.display = (view === 'auth') ? 'flex' : 'none';
        DOM.viewLobby.style.display = (view === 'lobby') ? 'flex' : 'none';
        DOM.viewChat.style.display = (view === 'chat') ? 'flex' : 'none';
        DOM.viewSettings.style.display = (view === 'settings') ? 'flex' : 'none';

        if (view === 'auth') {
          stopLocalPresence();
          clearPendingChatImage();
          DOM.btnBack.style.visibility = 'hidden';
          DOM.btnToSettings.style.visibility = 'visible';
          DOM.titleText.textContent = 'We talks';
        } else if (view === 'lobby') {
          stopLocalPresence();
          clearPendingChatImage();
          DOM.btnBack.style.visibility = 'hidden';
          DOM.btnToSettings.style.visibility = 'visible';
          DOM.titleText.textContent = 'We talks';
          activeRoomId = null;
          renderLobby();
          syncServerPresence();
        } else if (view === 'chat') {
          startLocalPresence();
          DOM.btnBack.style.visibility = 'visible';
          DOM.btnToSettings.style.visibility = 'hidden';
          unreadCounts[activeRoomId] = 0;
          loadRoomTitleAndRender();
          syncServerPresence();
        } else if (view === 'settings') {
          stopLocalPresence();
          DOM.btnBack.style.visibility = 'visible';
          DOM.btnToSettings.style.visibility = 'hidden';
          DOM.titleText.textContent = '管理者・接続設定';
          if (DOM.inputCfUrl) DOM.inputCfUrl.value = localStorage.getItem('wetalks_cloudflare_url') || 'https://wetalks-backend.mozunbu0123.workers.dev';
          if (DOM.inputSupabaseUrl) DOM.inputSupabaseUrl.value = localStorage.getItem('wetalks_supabase_url') || '';
          if (DOM.inputSupabaseKey) DOM.inputSupabaseKey.value = localStorage.getItem('wetalks_supabase_key') || '';
          if (DOM.cfTestResult) DOM.cfTestResult.style.display = 'none';
          updateActiveBackendBanner();
          updateSettingsTabsUI(getBackendType());
          switchAdminDashboardTab(selectedAdminTab || 'users');
          loadAdminOverview('active');
        }
      }

      const pendingCreatedRooms = new Map();

      async function fetchAllRooms() {
        const roomMap = new Map();
        const deletedIds = getDeletedRoomIds();

        // 1. Local DB rooms (immediate fallback)
        try {
          const localRooms = (getLocalDB() && getLocalDB().rooms) ? getLocalDB().rooms : [];
          localRooms.forEach(r => {
            if (r && r.id && !deletedIds.includes(r.id)) roomMap.set(r.id, r);
          });
        } catch(e) {}

        // 2. Fetch remote
        let remoteRoomsFetched = false;
        const serverRoomMap = new Map();
        const promises = [];

        // Server API / Cloudflare
        promises.push((async () => {
          try {
            const apiRooms = await callServerAPI('/api/wetalks/rooms');
            const roomArr = Array.isArray(apiRooms) ? apiRooms : (apiRooms && Array.isArray(apiRooms.rooms) ? apiRooms.rooms : null);
            if (roomArr) {
              remoteRoomsFetched = true;
              roomArr.forEach(r => {
                if (r && r.id && !deletedIds.includes(r.id)) {
                  serverRoomMap.set(r.id, r);
                  roomMap.set(r.id, r);
                }
              });
            }
          } catch(e) {}
        })());

        // Supabase
        if (supabaseClient) {
          promises.push((async () => {
            try {
              const res = await withTimeout(supabaseClient.from('rooms').select('*'), 1500);
              if (res && res.data && Array.isArray(res.data)) {
                res.data.forEach(r => {
                  if (r && r.id && !deletedIds.includes(r.id)) {
                    serverRoomMap.set(r.id, r);
                    roomMap.set(r.id, r);
                  }
                });
              }
            } catch(e) {}
          })());
        }

        await Promise.allSettled(promises);

        // If authoritative server API responded, sync local DB rooms with server state
        if (remoteRoomsFetched) {
          pendingCreatedRooms.forEach((r, id) => {
            if (!deletedIds.includes(id) && !serverRoomMap.has(id)) {
              serverRoomMap.set(id, r);
            }
          });
          const syncedRooms = Array.from(serverRoomMap.values()).filter(r => r && r.id && !deletedIds.includes(r.id));
          try {
            const db = getLocalDB();
            db.rooms = syncedRooms;
            saveLocalDB(db);
          } catch(e) {}
          return syncedRooms;
        }

        return Array.from(roomMap.values()).filter(r => r && r.id && !deletedIds.includes(r.id));
      }

      async function renderSettingsRoomList(roomsOverride = null, forceCf = false) {
        const container = document.getElementById('settings-room-list');
        if (!container) return;
        container.innerHTML = '<li style="font-size:12px; color:#888; text-align:center; padding:10px;">読み込み中...</li>';
        const rooms = Array.isArray(roomsOverride) ? roomsOverride : await fetchAllRooms();
        container.innerHTML = '';
        if (rooms.length === 0) {
          container.innerHTML = '<li style="font-size:12px; color:#888; background:rgba(0,0,0,0.03); padding:12px; border-radius:6px; text-align:center;">作成されたトークルームはありません。</li>';
          return;
        }
        rooms.forEach(room => {
          const li = document.createElement('li');
          li.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:#ffffff; border:1px solid #e2e8f0; padding:10px 12px; border-radius:6px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); gap: 10px;';
          
          const leftWrapper = document.createElement('div');
          leftWrapper.style.cssText = 'display:flex; align-items:center; gap:10px; min-width:0; flex:1;';

          const icon = document.createElement('span');
          icon.style.cssText = 'font-size:16px; flex-shrink:0;';
          icon.textContent = room.type === 'group' ? '👥' : '👤';

          const textCol = document.createElement('div');
          textCol.style.cssText = 'min-width:0; flex:1; overflow:hidden;';

          let displayName = room.name;
          if (room.type === 'direct') {
            const myName = getSessionUser();
            const parts = room.name.replace(/@/g, '').split(' & ');
            if (parts.length === 2) {
              displayName = (parts[0] === myName ? parts[1] : parts[0]) + ' との1対1';
            }
          }

          const nameSpan = document.createElement('div');
          nameSpan.style.cssText = 'font-size:13px; font-weight:bold; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;';
          nameSpan.textContent = displayName;

          const metaSpan = document.createElement('div');
          metaSpan.style.cssText = 'font-size:10px; color:#64748b;';
          const countPart = typeof room.message_count === 'number' ? (' • 履歴: ' + room.message_count + '件') : '';
          metaSpan.textContent = (room.type === 'group' ? 'グループ' : '1対1') + countPart + ' • ID: ' + room.id;

          textCol.appendChild(nameSpan);
          textCol.appendChild(metaSpan);
          leftWrapper.appendChild(icon);
          leftWrapper.appendChild(textCol);

          const delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.style.cssText = 'background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; font-size:11px; cursor:pointer; font-weight:bold; flex-shrink:0; transition:background 0.15s;';
          delBtn.textContent = '🗑️ 削除';
          delBtn.addEventListener('mouseover', () => { delBtn.style.background = '#dc2626'; });
          delBtn.addEventListener('mouseout', () => { delBtn.style.background = '#ef4444'; });
          
          delBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const confirmed = await showConfirmDialog(
              'トークルームの削除',
              '本当に「' + displayName + '」トークルームと、その中のチャット履歴をすべて削除しますか？\\n（この操作は取り消せません）'
            );
            if (!confirmed) return;

            delBtn.disabled = true;
            delBtn.textContent = '削除中...';
            try {
              await deleteRoomAndMessages(room.id, forceCf);
              if (li.parentNode) li.parentNode.removeChild(li);
              await loadAdminOverview(adminInspectMode);
              await renderLobby();
            } catch (err) {
              console.error('Room delete error:', err);
              if (DOM.adminStorageStatus) {
                DOM.adminStorageStatus.style.background = '#fef2f2';
                DOM.adminStorageStatus.style.borderColor = '#fca5a5';
                DOM.adminStorageStatus.style.color = '#991b1b';
                DOM.adminStorageStatus.textContent = '❌ ルーム削除中にエラーが発生しました: ' + ((err && err.message) || 'Unknown error');
              }
            } finally {
              delBtn.disabled = false;
              delBtn.textContent = '🗑️ 削除';
            }
          });

          li.appendChild(leftWrapper);
          li.appendChild(delBtn);
          container.appendChild(li);
        });
      }

      async function deleteRoomAndMessages(roomId, forceCf = false) {
        if (!roomId) return { ok: false };

        pendingCreatedRooms.delete(roomId);
        renderedRoomIdsHash = '';

        // 1. Record deleted room ID in permanent blocklist so it never gets resurrected by API/defaults
        addDeletedRoomId(roomId);

        // 2. Delete locally first
        try {
          const raw = localStorage.getItem(DB_KEY);
          if (raw) {
            const db = JSON.parse(raw);
            if (db.rooms) db.rooms = db.rooms.filter(r => r && r.id !== roomId);
            if (db.messages && db.messages[roomId]) delete db.messages[roomId];
            localStorage.setItem(DB_KEY, JSON.stringify(db));
          }
        } catch(e) {
          console.error("Local delete error:", e);
        }

        // 3. Delete from Supabase if connected
        if (supabaseClient && !forceCf) {
          try {
            await Promise.allSettled([
              withTimeout(supabaseClient.from('messages').delete().eq('room_id', roomId), 2500),
              withTimeout(supabaseClient.from('rooms').delete().eq('id', roomId), 2500)
            ]);
            const ch = supabaseClient.channel('global-lobby');
            ch.subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                ch.send({ type: 'broadcast', event: 'room_deleted', payload: { roomId } }).then(() => {
                  supabaseClient.removeChannel(ch);
                });
              }
            });
          } catch(e) {
            console.warn("Supabase delete room warning:", e);
          }
        }

        // 4. Delete on shared server API / Cloudflare Worker (no custom x-admin-passcode header so CORS never blocks)
        let remoteOk = true;
        try {
          const endpoint = '/api/wetalks/rooms/' + encodeURIComponent(roomId);
          const targetUrl = forceCf ? buildAdminTargetUrl(endpoint, true) : buildApiUrl(endpoint);
          const headers = { 'Content-Type': 'application/json' };
          const token = getAuthToken();
          if (token) headers['Authorization'] = 'Bearer ' + token;
          const res = await fetch(targetUrl, { method: 'DELETE', headers });
          remoteOk = res.ok;
          if (!res.ok) {
            console.warn("API delete room status:", res.status);
          }
        } catch(e) {
          remoteOk = false;
          console.warn("API delete room warning:", e);
        }

        // 5. If currently inside the deleted room, return to lobby
        if (activeRoomId === roomId) {
          activeRoomId = null;
          switchView('lobby');
        }
        return { ok: remoteOk };
      }

      async function loadRoomTitleAndRender() {
        let rawName = "トークルーム";
        let type = "group";
        
        // Check local DB first for instantaneous response
        const localRooms = (getLocalDB() && getLocalDB().rooms) ? getLocalDB().rooms : [];
        const localRoom = localRooms.find(r => r.id === activeRoomId);
        if (localRoom) {
          rawName = localRoom.name;
          type = localRoom.type;
        }

        const myName = getSessionUser();
        let displayName = rawName;
        if (type === 'direct' && rawName) {
          const parts = rawName.replace(/@/g, '').split(' & ');
          if (parts.length === 2) {
            displayName = parts[0] === myName ? parts[1] : parts[0];
          }
        }
        if (DOM.titleText) DOM.titleText.textContent = displayName;

        // Render messages immediately without waiting
        renderMessages();

        // Background check for remote room details if name was not found locally
        if (!localRoom) {
          fetchAllRooms().then(allRooms => {
            const r = allRooms.find(item => item.id === activeRoomId);
            if (r) {
              let dName = r.name;
              if (r.type === 'direct' && r.name) {
                const p = r.name.replace(/@/g, '').split(' & ');
                if (p.length === 2) dName = p[0] === myName ? p[1] : p[0];
              }
              if (DOM.titleText && activeRoomId === r.id) DOM.titleText.textContent = dName;
            }
          }).catch(() => {});
        }
      }

      let renderedRoomIdsHash = '';
      function renderLobbyRoomsDOM(roomsList) {
        if (!DOM.roomList) return;
        DOM.roomList.innerHTML = '';
        roomsList.forEach(room => appendRoomItem(room));
        if (DOM.roomList.children.length === 0) {
          const emptyLi = document.createElement('li');
          emptyLi.className = 'room-empty-state';
          emptyLi.style.cssText = 'padding: 32px 16px; text-align: center; color: #64748b; font-size: 13px; line-height: 1.6;';
          emptyLi.textContent = 'トークルームがまだありません。「＋ 新しいトークルームを作成」から自由に作成できます。';
          DOM.roomList.appendChild(emptyLi);
        }
      }

      async function renderLobby() {
        const myName = getSessionUser();
        if (DOM.lobbyUsernameTag) {
          DOM.lobbyUsernameTag.textContent = myName;
        }

        const onlineCount = supabaseClient
          ? Math.max(supabaseOnlineCount || 1, 1)
          : Math.max(serverOnlineCount || 1, 1);
        if (DOM.lobbyOnlineCountTag) {
          DOM.lobbyOnlineCountTag.textContent = "● オンライン: " + onlineCount + "人";
        }

        const deletedIds = getDeletedRoomIds();

        // 1. Render immediately from local DB if room list is empty
        const localRooms = ((getLocalDB() && getLocalDB().rooms) || []).filter(r => r && r.id && !deletedIds.includes(r.id));
        if (DOM.roomList && DOM.roomList.children.length === 0) {
          renderLobbyRoomsDOM(localRooms);
          renderedRoomIdsHash = myName + '::' + localRooms.map(r => r.id + ':' + r.name + ':' + (unreadCounts[r.id] || 0)).join('|');
        }

        // 2. Fetch all merged rooms and update ONLY if changed to prevent destroying click events
        try {
          const rooms = await fetchAllRooms();
          const activeRooms = rooms.filter(r => r && r.id && !deletedIds.includes(r.id));
          const currentHash = myName + '::' + activeRooms.map(r => r.id + ':' + r.name + ':' + (unreadCounts[r.id] || 0)).join('|');
          if (currentHash !== renderedRoomIdsHash || DOM.roomList.children.length === 0) {
            renderedRoomIdsHash = currentHash;
            renderLobbyRoomsDOM(activeRooms);
          }
        } catch(e) {}
      }

      function appendRoomItem(room) {
        let displayName = room.name;
        if (room.type === 'direct') {
          const myName = getSessionUser();
          const parts = room.name.replace(/@/g, '').split(' & ');
          if (parts.length === 2) {
            if (parts[0] !== myName && parts[1] !== myName) {
              // Direct message is not with current user, so hide it!
              return;
            }
            displayName = parts[0] === myName ? parts[1] : parts[0];
          } else {
            // Fallback for legacy formats
            if (!room.name.includes(myName)) {
              return;
            }
          }
        }

        const li = document.createElement('li');
        li.className = 'room-item';
        li.addEventListener('click', () => {
          activeRoomId = room.id;
          switchView('chat');
        });
        const avatar = document.createElement('div');
        avatar.className = 'room-avatar';
        avatar.textContent = room.type === 'group' ? '👥' : '👤';
        if (room.type === 'group') avatar.style.background = '#4ec5f1';

        const info = document.createElement('div');
        info.className = 'room-info';
        const wrapper = document.createElement('div');
        wrapper.className = 'room-name-wrapper';
        const name = document.createElement('div');
        name.className = 'room-name';
        name.textContent = displayName;
        const type = document.createElement('span');
        type.className = 'room-type';
        type.textContent = room.type === 'group' ? 'グループトーク' : '1対1トーク';
        wrapper.appendChild(name);
        wrapper.appendChild(type);
        info.appendChild(wrapper);

        const unread = unreadCounts[room.id] || 0;
        if (unread > 0) {
          const badge = document.createElement('span');
          badge.className = 'room-unread-badge';
          badge.textContent = unread;
          info.appendChild(badge);
        }

        li.appendChild(avatar);
        li.appendChild(info);
        DOM.roomList.appendChild(li);
      }

      function formatTime(createdAt) {
        const date = createdAt ? new Date(createdAt) : new Date();
        const hrs = String(date.getHours()).padStart(2, '0');
        const mins = String(date.getMinutes()).padStart(2, '0');
        return hrs + ':' + mins;
      }

      async function renderMessages() {
        if (!activeRoomId) return;

        // 1. Instant local render
        const localMsgs = (getLocalDB().messages && getLocalDB().messages[activeRoomId]) || [];
        if (DOM.messageContainer && DOM.messageContainer.children.length === 0 && localMsgs.length > 0) {
          DOM.messageContainer.innerHTML = '';
          localMsgs.forEach(msg => appendMessageBubble(msg));
          DOM.messageContainer.scrollTop = DOM.messageContainer.scrollHeight;
        }

        // 2. Fetch remote and sync
        let msgs = localMsgs;
        let fromSupabase = false;
        try {
          if (supabaseClient && !hasSupabaseMessagesTableError) {
            const res = await withTimeout(supabaseClient.from('messages').select('*').eq('room_id', activeRoomId).order('id', { ascending: true }), 1500);
            const data = res.data;
            const error = res.error;
            if (error) {
              if (error.message && (error.message.includes("Could not find the table") || error.code === '42P01' || error.message.includes("schema cache"))) {
                hasSupabaseMessagesTableError = true;
              }
              const apiMsgs = await callServerAPI('/api/wetalks/messages/' + encodeURIComponent(activeRoomId));
              msgs = apiMsgs || localMsgs;
            } else if (data) {
              msgs = data;
              fromSupabase = true;
            }
            if (msgChannel && !hasSupabaseMessagesTableError) {
              try { supabaseClient.removeChannel(msgChannel); } catch(e){}
              msgChannel = null;
            }
            if (!hasSupabaseMessagesTableError) {
              try {
                msgChannel = supabaseClient.channel('room-' + activeRoomId);
                msgChannel
                  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'room_id=eq.' + activeRoomId }, payload => {
                    const msg = payload.new;
                    checkAndNotifyNewMessage(msg);
                    appendMessageBubble(msg);
                    DOM.messageContainer.scrollTop = DOM.messageContainer.scrollHeight;
                  })
                  .on('presence', { event: 'sync' }, () => {
                    const state = msgChannel.presenceState();
                    roomPresenceMembers = Object.values(state).flatMap(presences => presences.map(p => p.user));
                    updateReadReceipts();
                  })
                  .subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                      try { await msgChannel.track({ user: getSessionUser() }); } catch(e){}
                    }
                  });
              } catch(e) {}
            }
          } else {
            const targetRoomId = activeRoomId;
            const rawApiMsgs = await callServerAPI('/api/wetalks/messages/' + encodeURIComponent(targetRoomId));
            if (targetRoomId !== activeRoomId) return;
            const apiMsgs = Array.isArray(rawApiMsgs)
              ? rawApiMsgs
              : (rawApiMsgs && Array.isArray(rawApiMsgs.messages) ? rawApiMsgs.messages : null);
            if (apiMsgs) {
              const serverIds = new Set(apiMsgs.filter(m => m && m.id).map(m => String(m.id)));
              const pendingLocal = localMsgs.filter(m => m && m.id && m._pendingSync && !serverIds.has(String(m.id)));
              msgs = [...apiMsgs, ...pendingLocal].sort((a, b) =>
                String(a.created_at || '').localeCompare(String(b.created_at || ''))
              );
              const db = getLocalDB();
              if (!db.messages) db.messages = {};
              db.messages[targetRoomId] = msgs;
              saveLocalDB(db);
            } else {
              msgs = localMsgs;
            }
          }
        } catch (err) {
          hasSupabaseMessagesTableError = true;
          try {
            const rawApiMsgs = await callServerAPI('/api/wetalks/messages/' + encodeURIComponent(activeRoomId));
            const apiMsgs = Array.isArray(rawApiMsgs)
              ? rawApiMsgs
              : (rawApiMsgs && Array.isArray(rawApiMsgs.messages) ? rawApiMsgs.messages : null);
            msgs = apiMsgs || localMsgs;
          } catch(e) {
            msgs = localMsgs;
          }
        }

        DOM.messageContainer.innerHTML = '';
        msgs.forEach(msg => {
          if (fromSupabase) {
            if (msg && msg.id) seenMessageIds.add(msg.id);
            appendMessageBubble(msg);
          } else {
            checkAndNotifyNewMessage(msg);
            appendMessageBubble(msg);
          }
        });
        DOM.messageContainer.scrollTop = DOM.messageContainer.scrollHeight;
      }

      let pendingChatImageBase64 = '';

      function clearPendingChatImage() {
        pendingChatImageBase64 = '';
        if (DOM.msgImageFile) DOM.msgImageFile.value = '';
        if (DOM.msgImagePreviewThumb) DOM.msgImagePreviewThumb.src = '';
        if (DOM.msgImagePreviewBar) DOM.msgImagePreviewBar.classList.remove('active');
      }

      function setPendingChatImage(dataUrl, fileName) {
        pendingChatImageBase64 = dataUrl || '';
        if (DOM.msgImagePreviewThumb) DOM.msgImagePreviewThumb.src = pendingChatImageBase64;
        if (DOM.msgImagePreviewName) DOM.msgImagePreviewName.textContent = fileName || '画像を選択中';
        if (DOM.msgImagePreviewBar) {
          if (pendingChatImageBase64) DOM.msgImagePreviewBar.classList.add('active');
          else DOM.msgImagePreviewBar.classList.remove('active');
        }
      }

      function compressChatImage(file) {
        return new Promise((resolve, reject) => {
          if (!file || !file.type || !file.type.startsWith('image/')) {
            reject(new Error('画像ファイルを選択してください。'));
            return;
          }
          const reader = new FileReader();
          reader.onerror = () => reject(new Error('画像の読み込みに失敗しました。'));
          reader.onload = (ev) => {
            const rawDataUrl = ev.target.result;
            if (file.type === 'image/gif' && file.size <= 1500 * 1024) {
              resolve(rawDataUrl);
              return;
            }
            const img = new Image();
            img.onerror = () => reject(new Error('画像を読み込めませんでした。'));
            img.onload = () => {
              const maxDim = 1024;
              let w = img.width;
              let h = img.height;
              if (w > maxDim || h > maxDim) {
                if (w >= h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(rawDataUrl);
                return;
              }
              ctx.drawImage(img, 0, 0, w, h);
              const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
              let outUrl = canvas.toDataURL(outputType, 0.82);
              if (outUrl.length > 1800 * 1024) {
                outUrl = canvas.toDataURL('image/jpeg', 0.72);
              }
              resolve(outUrl);
            };
            img.src = rawDataUrl;
          };
          reader.readAsDataURL(file);
        });
      }

      function appendMessageBubble(msg) {
        if (!msg || !DOM.messageContainer) return;
        if (msg.id && Array.from(DOM.messageContainer.children).some(el => el.getAttribute('data-msgid') === String(msg.id))) {
          return;
        }
        const isMe = msg.sender === getSessionUser();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg ' + (isMe ? 'me' : 'other');
        msgDiv.setAttribute('data-msgid', msg.id);

        if (!isMe) {
          const senderName = document.createElement('div');
          senderName.className = 'msg-sender';
          senderName.textContent = msg.sender;
          msgDiv.appendChild(senderName);
        }

        const msgRow = document.createElement('div');
        msgRow.className = 'msg-row';

        // Prepend custom profile avatar next to message bubbles
        const avatarImg = document.createElement('img');
        avatarImg.style.cssText = 'width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.25); flex-shrink: 0;';
        const av = getUserAvatar(msg.sender);
        if (av) {
          avatarImg.src = av;
        } else {
          avatarImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="%23e2e8f0"/><text x="14" y="18" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23475569" text-anchor="middle">' + encodeURIComponent(msg.sender.charAt(0).toUpperCase()) + '</text></svg>';
        }
        msgRow.appendChild(avatarImg);

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        const hasValidImage = typeof msg.image_base64 === 'string' && msg.image_base64.startsWith('data:image/');
        if (hasValidImage) {
          bubble.classList.add('has-image');
          const imgEl = document.createElement('img');
          imgEl.className = 'msg-image';
          imgEl.src = msg.image_base64;
          imgEl.alt = '送信画像';
          imgEl.addEventListener('click', () => {
            if (DOM.imageViewerImg && DOM.modalImageViewer) {
              DOM.imageViewerImg.src = msg.image_base64;
              DOM.modalImageViewer.classList.add('active');
            }
          });
          bubble.appendChild(imgEl);
        }
        if (msg.text) {
          const textDiv = document.createElement('div');
          if (hasValidImage) textDiv.className = 'msg-text-with-image';
          textDiv.textContent = msg.text;
          bubble.appendChild(textDiv);
        } else if (msg.image_expired || !hasValidImage) {
          const expiredDiv = document.createElement('div');
          expiredDiv.style.cssText = 'font-size: 11px; color: #64748b; font-style: italic;';
          expiredDiv.textContent = '🖼️ 送信から10日経過したため画像は自動削除されました';
          bubble.appendChild(expiredDiv);
        }

        const meta = document.createElement('div');
        meta.className = 'msg-meta';
        const readStatus = document.createElement('div');
        readStatus.className = 'msg-read-status';

        if (isMe) {
          let count = getMessageReadCountLocal(msg.id);
          if (supabaseClient) {
            count = Math.max(count, roomPresenceMembers.filter(member => member !== getSessionUser()).length);
          } else {
            let data = {};
            try {
              const raw = localStorage.getItem(ACTIVE_USERS_KEY);
              if (raw) data = JSON.parse(raw);
            } catch(e) {}
            const membersInRoom = data[activeRoomId] || {};
            const now = Date.now();
            const localCount = Object.keys(membersInRoom).filter(u => u !== getSessionUser() && (now - membersInRoom[u]) < 5000).length;
            count = Math.max(count, localCount);
          }
          if (count > 0) readStatus.textContent = count > 1 ? "既読 " + count : "既読";
        }

        const time = document.createElement('div');
        time.className = 'msg-time';
        time.textContent = formatTime(msg.created_at);
        meta.appendChild(readStatus);
        meta.appendChild(time);
        if (msg._syncError) {
          const errNote = document.createElement('div');
          errNote.className = 'msg-sync-error';
          errNote.style.cssText = 'font-size: 9px; color: #ef4444; font-weight: bold;';
          errNote.textContent = '⚠️ 未保存';
          meta.appendChild(errNote);
        }
        msgRow.appendChild(bubble);
        msgRow.appendChild(meta);
        msgDiv.appendChild(msgRow);
        DOM.messageContainer.appendChild(msgDiv);
      }

      async function postMessageToServer(remotePayload) {
        let res = await callServerAPIWithStatus('/api/wetalks/messages', 'POST', remotePayload);
        // Fallback for older deployed Cloudflare Worker using POST /api/wetalks/messages/:roomId
        if (res.status === 404 && remotePayload && remotePayload.room_id) {
          res = await callServerAPIWithStatus(
            '/api/wetalks/messages/' + encodeURIComponent(remotePayload.room_id),
            'POST',
            remotePayload
          );
          if (res.status === 400 && !remotePayload.text && remotePayload.image_base64) {
            res = await callServerAPIWithStatus(
              '/api/wetalks/messages/' + encodeURIComponent(remotePayload.room_id),
              'POST',
              { ...remotePayload, text: '📷 画像' }
            );
          }
        }
        return res;
      }

      function sendMessage() {
        const text = DOM.msgInput.value.trim();
        const imageBase64 = pendingChatImageBase64;
        if ((!text && !imageBase64) || !activeRoomId) return;
        DOM.msgInput.value = '';
        clearPendingChatImage();

        const targetRoomId = activeRoomId;
        const sender = getSessionUser();
        const msgId = 'm-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        const newMsg = {
          id: msgId,
          room_id: targetRoomId,
          sender: sender,
          text: text,
          ...(imageBase64 ? { image_base64: imageBase64 } : {}),
          created_at: new Date().toISOString(),
          _pendingSync: true
        };

        // 1. Instant local persistence & UI append
        const db = getLocalDB();
        if (!db.messages) db.messages = {};
        if (!db.messages[targetRoomId]) db.messages[targetRoomId] = [];
        db.messages[targetRoomId].push(newMsg);
        saveLocalDB(db);

        checkAndNotifyNewMessage(newMsg);
        appendMessageBubble(newMsg);
        if (DOM.messageContainer) DOM.messageContainer.scrollTop = DOM.messageContainer.scrollHeight;

        // 2. Background sync to remote (preserving id and created_at so polling never duplicates)
        (async () => {
          const remotePayload = {
            id: msgId,
            room_id: targetRoomId,
            sender: sender,
            text: text || '',
            image_base64: imageBase64 || '',
            created_at: newMsg.created_at
          };
          let serverResult = null;
          if (supabaseClient && !hasSupabaseMessagesTableError) {
            try {
              const supaRow = { room_id: targetRoomId, sender: sender, text: text };
              if (imageBase64) supaRow.image_base64 = imageBase64;
              const { error } = await supabaseClient.from('messages').insert([supaRow]);
              if (error && (error.message.includes("Could not find the table") || error.code === '42P01' || error.message.includes("schema cache"))) {
                hasSupabaseMessagesTableError = true;
              }
              serverResult = await postMessageToServer(remotePayload);
            } catch(e) {
              serverResult = await postMessageToServer(remotePayload);
            }
          } else {
            serverResult = await postMessageToServer(remotePayload);
          }

          try {
            const latestDb = getLocalDB();
            const list = (latestDb.messages && latestDb.messages[targetRoomId]) || [];
            const idx = list.findIndex(m => m && m.id === msgId);
            if (serverResult && serverResult.ok) {
              if (idx >= 0) {
                delete list[idx]._pendingSync;
                delete list[idx]._syncError;
                saveLocalDB(latestDb);
              }
            } else {
              if (idx >= 0) {
                list[idx]._syncError = (serverResult && serverResult.data && serverResult.data.error) || ('HTTP ' + ((serverResult && serverResult.status) || 0));
                saveLocalDB(latestDb);
              }
              const domEl = DOM.messageContainer && Array.from(DOM.messageContainer.children).find(el => el.getAttribute('data-msgid') === String(msgId));
              if (domEl) {
                const metaEl = domEl.querySelector('.msg-meta');
                if (metaEl && !metaEl.querySelector('.msg-sync-error')) {
                  const errNote = document.createElement('div');
                  errNote.className = 'msg-sync-error';
                  errNote.style.cssText = 'font-size: 9px; color: #ef4444; font-weight: bold;';
                  errNote.textContent = (serverResult && serverResult.status === 401) ? '⚠️ 要再ログイン' : '⚠️ 未保存';
                  metaEl.appendChild(errNote);
                }
              }
            }
          } catch(e) {}
        })();
      }

      function showCreateRoomError(msg) {
        if (DOM.createRoomError) {
          DOM.createRoomError.textContent = msg;
          DOM.createRoomError.style.display = 'block';
        }
      }

      function createRoom() {
        if (DOM.createRoomError) DOM.createRoomError.style.display = 'none';
        const type = DOM.selectNewRoomType.value;
        let roomName = "";
        
        if (type === 'direct') {
          const targetUser = DOM.selectDirectTarget.value;
          if (!targetUser) {
            showCreateRoomError("話す相手のユーザーを選択してください。");
            return;
          }
          const sorted = [getSessionUser(), targetUser].sort();
          roomName = "@" + sorted[0] + " & @" + sorted[1];
          
          // Check if direct room already exists locally
          const localRooms = (getLocalDB() && getLocalDB().rooms) || [];
          const existing = localRooms.find(r => r.name === roomName && r.type === 'direct');
          if (existing) {
            DOM.modalCreate.classList.remove('active');
            activeRoomId = existing.id;
            switchView('chat');
            return;
          }
        } else {
          roomName = DOM.inputNewRoomName.value.trim();
          if (!roomName) {
            showCreateRoomError("トークルーム名を入力してください。");
            return;
          }
        }
        
        const roomId = 'room-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        removeDeletedRoomId(roomId);

        const roomObj = { id: roomId, name: roomName, type };
        pendingCreatedRooms.set(roomId, roomObj);

        // Always save locally immediately
        const db = getLocalDB();
        if (!db.rooms) db.rooms = [];
        if (!db.rooms.some(r => r.id === roomId)) {
          db.rooms.push(roomObj);
          if (!db.messages) db.messages = {};
          db.messages[roomId] = [];
          saveLocalDB(db);
        }

        DOM.inputNewRoomName.value = '';
        DOM.modalCreate.classList.remove('active');
        activeRoomId = roomId;
        switchView('chat');

        // Background server / Supabase save without blocking UI
        (async () => {
          try {
            const roomRes = await callServerAPIWithStatus('/api/wetalks/rooms', 'POST', roomObj);
            if (roomRes && roomRes.status === 401) {
              clearAuthSession();
              switchView('auth');
              if (DOM.authError) {
                DOM.authError.textContent = 'ルームをサーバーに保存するには再度ログインしてください。';
                DOM.authError.style.display = 'block';
              }
            }
          } catch(e) {}
          if (supabaseClient) {
            try {
              await supabaseClient.from('rooms').insert([roomObj]);
            } catch(e) {}
          }
          pendingCreatedRooms.delete(roomId);
        })();
      }

      DOM.btnBack.addEventListener('click', () => {
        if (currentView === 'chat') {
          if (msgChannel && supabaseClient) {
            supabaseClient.removeChannel(msgChannel);
            msgChannel = null;
          }
          switchView('lobby');
        } else if (currentView === 'settings') {
          const user = getSessionUser();
          if (!user || user === 'ゲスト') {
            switchView('auth');
          } else {
            switchView('lobby');
          }
        }
      });

      DOM.btnToSettings.addEventListener('click', () => {
        DOM.inputPasscode.value = '';
        DOM.passcodeError.style.display = 'none';
        DOM.modalPasscode.classList.add('active');
        DOM.inputPasscode.focus();
      });

      DOM.btnPasscodeCancel.addEventListener('click', () => DOM.modalPasscode.classList.remove('active'));
      const verifyAndEnterSettings = () => {
        const pass = (DOM.inputPasscode.value || '').trim();
        if (pass === '0123' || pass === 'mozunbu_1203' || pass === '1203' || pass === 'admin') {
          verifiedAdminPasscode = pass;
          DOM.modalPasscode.classList.remove('active');
          switchView('settings');
        } else {
          DOM.passcodeError.style.display = 'block';
        }
      };
      DOM.btnPasscodeConfirm.addEventListener('click', verifyAndEnterSettings);
      DOM.inputPasscode.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verifyAndEnterSettings();
      });

      // Auth screen tab switches
      DOM.authTabLogin.addEventListener('click', () => {
        authMode = 'login';
        DOM.authTabLogin.style.background = 'white';
        DOM.authTabLogin.style.color = 'black';
        DOM.authTabSignup.style.background = 'transparent';
        DOM.authTabSignup.style.color = '#555';
        DOM.btnAuthSubmit.textContent = 'ログイン';
        DOM.authError.style.display = 'none';
      });

      DOM.authTabSignup.addEventListener('click', () => {
        authMode = 'signup';
        DOM.authTabSignup.style.background = 'white';
        DOM.authTabSignup.style.color = 'black';
        DOM.authTabLogin.style.background = 'transparent';
        DOM.authTabLogin.style.color = '#555';
        DOM.btnAuthSubmit.textContent = '新規作成してログイン';
        DOM.authError.style.display = 'none';
      });

      // Auth form submission handler
      async function handleAuthSubmit() {
        const username = DOM.authUsername.value.trim();
        const password = DOM.authPassword.value.trim();
        DOM.authError.style.display = 'none';

        if (!username) {
          showAuthError("ユーザー名を入力してください。");
          return;
        }
        if (username === 'ゲスト') {
          showAuthError("「ゲスト」というユーザー名は使用できません。");
          return;
        }
        if (username.length > 24) {
          showAuthError("ユーザー名は24文字以内で入力してください。");
          return;
        }
        if (!password) {
          showAuthError("パスワードを入力してください。");
          return;
        }

        const backend = getBackendType();
        DOM.btnAuthSubmit.disabled = true;

        try {
          if (backend === 'internal' || backend === 'cloudflare') {
            if (authMode === 'signup') {
              if (password.length < 4) {
                showAuthError("パスワードは4文字以上で入力してください。");
                return;
              }
              const res = await callServerAPIWithStatus('/api/wetalks/register', 'POST', {
                username: username,
                password: password,
                avatar_base64: ''
              });
              if (res.ok && res.data && res.data.token) {
                setAuthSession(res.data.user.username, res.data.token);
              } else if (res.status === 404 && backend === 'cloudflare') {
                // Fallback for older deployed Cloudflare Worker without /api/wetalks/register
                const existingRes = await callServerAPIWithStatus('/api/wetalks/users', 'GET');
                const existingList = (existingRes.ok && Array.isArray(existingRes.data))
                  ? existingRes.data
                  : (existingRes.ok && existingRes.data && Array.isArray(existingRes.data.users) ? existingRes.data.users : []);
                if (existingList.some(u => String(u.username || '').toLowerCase().trim() === username.toLowerCase())) {
                  showAuthError("このユーザー名は既に登録されています。");
                  return;
                }
                const legacyRes = await callServerAPIWithStatus('/api/wetalks/users', 'POST', {
                  username: username,
                  password: password,
                  password_numeric: password,
                  avatar_base64: ''
                });
                if (!legacyRes.ok || !legacyRes.data || legacyRes.data.error || legacyRes.data.success === false) {
                  showAuthError((legacyRes.data && legacyRes.data.error) || "新規登録に失敗しました。");
                  return;
                }
                setAuthSession(username, 'legacy-cf');
              } else {
                const errMsg = res.status === 0
                  ? "サーバーに接続できませんでした。接続設定をご確認ください。"
                  : ((res.data && res.data.error) || "新規登録に失敗しました。");
                showAuthError(errMsg);
                return;
              }
            } else {
              const res = await callServerAPIWithStatus('/api/wetalks/login', 'POST', {
                username: username,
                password: password
              });
              if (res.ok && res.data && res.data.token) {
                setAuthSession(res.data.user.username, res.data.token);
              } else if (res.status === 404 && backend === 'cloudflare') {
                // Fallback for older deployed Cloudflare Worker without /api/wetalks/login
                const usersRes = await callServerAPIWithStatus('/api/wetalks/users', 'GET');
                const usersList = (usersRes.ok && Array.isArray(usersRes.data))
                  ? usersRes.data
                  : (usersRes.ok && usersRes.data && Array.isArray(usersRes.data.users) ? usersRes.data.users : []);
                const found = usersList.find(
                  u => String(u.username || '').toLowerCase().trim() === username.toLowerCase() &&
                       String((u.password_numeric ?? u.password) || '').trim() === password
                );
                if (!found) {
                  showAuthError("ユーザー名またはパスワードが正しくありません。");
                  return;
                }
                setAuthSession(found.username, 'legacy-cf');
              } else {
                const errMsg = res.status === 0
                  ? "サーバーに接続できませんでした。接続設定をご確認ください。"
                  : ((res.data && res.data.error) || "ユーザー名またはパスワードが正しくありません。");
                showAuthError(errMsg);
                return;
              }
            }

            await loadCachedUsers();
            DOM.authUsername.value = '';
            DOM.authPassword.value = '';
            DOM.authError.style.display = 'none';
            renderedRoomIdsHash = '';
            switchView('lobby');
            syncServerPresence();
            return;
          }

          // Cloudflare / Supabase fallback mode
          await loadCachedUsers();

          if (authMode === 'signup') {
            const userExists = cachedUsers.some(u => String(u.username).toLowerCase().trim() === username.toLowerCase());
            if (userExists) {
              showAuthError("このユーザー名は既に登録されています");
              return;
            }
            if (password.length < 4) {
              showAuthError("パスワードは4文字以上で入力してください");
              return;
            }

            let registeredSuccessfully = false;
            if (supabaseClient && !hasSupabaseUsersTableError) {
              try {
                const { error: insertErr } = await supabaseClient
                  .from('wetalks_users')
                  .insert([{
                    username: username,
                    password_numeric: password,
                    avatar_base64: ''
                  }]);
                if (insertErr) {
                  hasSupabaseUsersTableError = true;
                } else {
                  registeredSuccessfully = true;
                  await callServerAPI('/api/wetalks/users', 'POST', {
                    username: username,
                    password: password,
                    password_numeric: password,
                    avatar_base64: ''
                  });
                }
              } catch (err) {
                hasSupabaseUsersTableError = true;
              }
            }

            if (!registeredSuccessfully || hasSupabaseUsersTableError) {
              const apiRes = await callServerAPI('/api/wetalks/users', 'POST', {
                username: username,
                password: password,
                password_numeric: password,
                avatar_base64: ''
              });
              if (!apiRes || !apiRes.success) {
                showAuthError("登録に失敗しました。別のユーザー名をお試しください。");
                return;
              }
            }

            await loadCachedUsers();
            setAuthSession(username, '');
            DOM.authUsername.value = '';
            DOM.authPassword.value = '';
            DOM.authError.style.display = 'none';
            switchView('lobby');

            if (presenceChannel) {
              try { presenceChannel.unsubscribe(); } catch(e){}
              initGlobalPresence();
            }
          } else {
            const found = cachedUsers.find(u => String(u.username).toLowerCase().trim() === username.toLowerCase() && String(u.password || '').trim() === password);
            if (!found) {
              showAuthError("ユーザー名またはパスワードが正しくありません。");
              return;
            }

            setAuthSession(found.username, '');
            DOM.authUsername.value = '';
            DOM.authPassword.value = '';
            DOM.authError.style.display = 'none';
            switchView('lobby');

            if (presenceChannel) {
              try { presenceChannel.unsubscribe(); } catch(e){}
              initGlobalPresence();
            }
          }
        } finally {
          DOM.btnAuthSubmit.disabled = false;
        }
      }

      DOM.btnAuthSubmit.addEventListener('click', handleAuthSubmit);
      DOM.authUsername.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAuthSubmit(); });
      DOM.authPassword.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAuthSubmit(); });

      function showAuthError(msg) {
        DOM.authError.textContent = msg;
        DOM.authError.style.display = 'block';
      }

      // Profile avatar change handler
      DOM.profileAvatarFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          selectedAvatarBase64 = event.target.result;
          DOM.profileAvatarPreview.src = selectedAvatarBase64;
        };
        reader.readAsDataURL(file);
      });

      function openProfileEditModal() {
        const username = getSessionUser();
        DOM.inputNewUsername.value = username;
        if (DOM.usernameChangeError) DOM.usernameChangeError.style.display = 'none';

        const currentAvatar = getUserAvatar(username);
        DOM.profileAvatarPreview.src = currentAvatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="25" fill="%23ddd"/><text x="25" y="32" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23555" text-anchor="middle">' + encodeURIComponent(username.charAt(0).toUpperCase()) + '</text></svg>';
        
        DOM.profileAvatarFile.value = '';
        selectedAvatarBase64 = null;
        DOM.modalUsername.classList.add('active');
        setTimeout(() => DOM.inputNewUsername.focus(), 50);
      }

      DOM.lobbyUsernameTag.addEventListener('click', openProfileEditModal);
      if (DOM.lobbyUsernameEditBtn) {
        DOM.lobbyUsernameEditBtn.addEventListener('click', openProfileEditModal);
      }

      DOM.btnUsernameCancel.addEventListener('click', () => {
        selectedAvatarBase64 = null;
        if (DOM.usernameChangeError) DOM.usernameChangeError.style.display = 'none';
        DOM.modalUsername.classList.remove('active');
      });

      async function saveProfileChanges() {
        const oldUsername = getSessionUser();
        const newUsername = (DOM.inputNewUsername.value || '').trim();
        if (DOM.usernameChangeError) DOM.usernameChangeError.style.display = 'none';

        if (!newUsername) {
          if (DOM.usernameChangeError) {
            DOM.usernameChangeError.textContent = 'ユーザー名を入力してください。';
            DOM.usernameChangeError.style.display = 'block';
          }
          return;
        }
        if (newUsername === 'ゲスト') {
          if (DOM.usernameChangeError) {
            DOM.usernameChangeError.textContent = 'このユーザー名は使用できません。';
            DOM.usernameChangeError.style.display = 'block';
          }
          return;
        }
        if (newUsername.length > 24) {
          if (DOM.usernameChangeError) {
            DOM.usernameChangeError.textContent = 'ユーザー名は24文字以内で入力してください。';
            DOM.usernameChangeError.style.display = 'block';
          }
          return;
        }

        let activeUsername = oldUsername;

        if (newUsername !== oldUsername) {
          if (getBackendType() === 'internal' || getBackendType() === 'cloudflare') {
            const renameRes = await callServerAPIWithStatus('/api/wetalks/users/rename', 'POST', {
              newUsername: newUsername
            });
            if (!renameRes.ok) {
              if (renameRes.status === 401) {
                clearAuthSession();
                DOM.modalUsername.classList.remove('active');
                switchView('auth');
                return;
              }
              if (DOM.usernameChangeError) {
                if (renameRes.status === 404 && getBackendType() === 'cloudflare') {
                  DOM.usernameChangeError.textContent = '旧Cloudflare Workerではユーザー名変更に未対応です（最新のworker.jsをデプロイしてください）。';
                } else {
                  DOM.usernameChangeError.textContent = (renameRes.data && renameRes.data.error) || 'このユーザー名は既に使用されているため変更できません。';
                }
                DOM.usernameChangeError.style.display = 'block';
              }
              return;
            }
          } else {
            await loadCachedUsers();
            const conflict = cachedUsers.some(
              u => String(u.username).toLowerCase().trim() === newUsername.toLowerCase() &&
                   String(u.username).toLowerCase().trim() !== oldUsername.toLowerCase()
            );
            if (conflict) {
              if (DOM.usernameChangeError) {
                DOM.usernameChangeError.textContent = 'このユーザー名は既に使用されています。';
                DOM.usernameChangeError.style.display = 'block';
              }
              return;
            }

            if (supabaseClient && !hasSupabaseUsersTableError) {
              try {
                await supabaseClient
                  .from('wetalks_users')
                  .update({ username: newUsername })
                  .eq('username', oldUsername);
              } catch(e) {}
            }

            const renameRes = await callServerAPIWithStatus('/api/wetalks/users/rename', 'POST', {
              oldUsername: oldUsername,
              newUsername: newUsername
            });
            if (!renameRes.ok) {
              if (DOM.usernameChangeError) {
                DOM.usernameChangeError.textContent = (renameRes.data && renameRes.data.error) || 'このユーザー名は既に使用されています。';
                DOM.usernameChangeError.style.display = 'block';
              }
              return;
            }
          }

          // Update local DB messages & direct rooms for this authenticated user
          try {
            const db = getLocalDB();
            if (db && db.messages) {
              Object.keys(db.messages).forEach(rId => {
                (db.messages[rId] || []).forEach(m => {
                  if (m && m.sender === oldUsername) m.sender = newUsername;
                });
              });
            }
            if (db && Array.isArray(db.rooms)) {
              db.rooms.forEach(r => {
                if (r && r.type === 'direct' && r.name) {
                  const parts = r.name.replace(/@/g, '').split(' & ');
                  if (parts.length === 2 && (parts[0] === oldUsername || parts[1] === oldUsername)) {
                    const updatedParts = parts.map(p => (p === oldUsername ? newUsername : p)).sort();
                    r.name = '@' + updatedParts[0] + ' & @' + updatedParts[1];
                  }
                }
              });
            }
            saveLocalDB(db);
          } catch(e) {}

          setAuthSession(newUsername, getAuthToken());
          activeUsername = newUsername;
          await loadCachedUsers();
          syncServerPresence();
        }

        if (selectedAvatarBase64) {
          try {
            if (supabaseClient && !hasSupabaseUsersTableError) {
              const { error } = await supabaseClient
                .from('wetalks_users')
                .update({ avatar_base64: selectedAvatarBase64 })
                .eq('username', activeUsername);
              if (error) {
                await callServerAPI('/api/wetalks/users/avatar', 'POST', { username: activeUsername, avatar_base64: selectedAvatarBase64 });
              }
            } else {
              await callServerAPI('/api/wetalks/users/avatar', 'POST', { username: activeUsername, avatar_base64: selectedAvatarBase64 });
            }
            await loadCachedUsers();
          } catch(e) {
            console.error(e);
          }
          selectedAvatarBase64 = null;
        }
        DOM.modalUsername.classList.remove('active');
        renderedRoomIdsHash = '';
        renderLobby();
      }

      DOM.btnUsernameConfirm.addEventListener('click', saveProfileChanges);
      DOM.inputNewUsername.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveProfileChanges();
      });

      // Logout handler
      DOM.btnLogout.addEventListener('click', () => {
        sendOfflinePresence();
        clearAuthSession();
        DOM.modalUsername.classList.remove('active');
        selectedAvatarBase64 = null;
        stopLocalPresence();
        switchView('auth');
      });

      window.addEventListener('pagehide', () => {
        if (getSessionUser() !== 'ゲスト') {
          sendOfflinePresence();
        }
      });

      // Provider tab switches
      if (DOM.tabProviderCf) {
        DOM.tabProviderCf.addEventListener('click', () => updateSettingsTabsUI('cloudflare'));
      }
      if (DOM.tabProviderSupabase) {
        DOM.tabProviderSupabase.addEventListener('click', () => updateSettingsTabsUI('supabase'));
      }
      if (DOM.tabProviderInternal) {
        DOM.tabProviderInternal.addEventListener('click', () => updateSettingsTabsUI('internal'));
      }

      // Cloudflare Connection Test Button
      if (DOM.btnCfTest) {
        DOM.btnCfTest.addEventListener('click', async () => {
          let testUrl = (DOM.inputCfUrl.value || '').trim();
          if (!testUrl) {
            if (DOM.cfTestResult) {
              DOM.cfTestResult.style.display = 'block';
              DOM.cfTestResult.style.color = '#e11d48';
              DOM.cfTestResult.textContent = '❌ Cloudflare Worker の URL を入力してください';
            }
            return;
          }
          if (testUrl.endsWith('/')) testUrl = testUrl.slice(0, -1);
          if (DOM.cfTestResult) {
            DOM.cfTestResult.style.display = 'block';
            DOM.cfTestResult.style.color = '#d97706';
            DOM.cfTestResult.textContent = '⏳ 接続テスト中...';
          }
          try {
            const res = await fetch(testUrl + '/api/wetalks/health', { method: 'GET' });
            if (!res.ok) throw new Error('HTTP Status: ' + res.status);
            const data = await res.json();
            if (DOM.cfTestResult) {
              DOM.cfTestResult.style.display = 'block';
              DOM.cfTestResult.style.color = '#16a34a';
              const d1Status = data.hasD1 ? ' (D1 データベース接続OK)' : ' (※D1未バインド/KVモード)';
              DOM.cfTestResult.textContent = '✅ 接続成功: ' + (data.service || 'Worker OK') + d1Status;
            }
          } catch(e) {
            if (DOM.cfTestResult) {
              DOM.cfTestResult.style.display = 'block';
              DOM.cfTestResult.style.color = '#e11d48';
              DOM.cfTestResult.textContent = '❌ 接続失敗: ' + (e.message || 'Worker にアクセスできませんでした。URLとデプロイ状態を確認してください。');
            }
          }
        });
      }

      // Copy SQL button
      if (DOM.btnCopySql && DOM.cfSchemaSql) {
        DOM.btnCopySql.addEventListener('click', () => {
          DOM.cfSchemaSql.select();
          navigator.clipboard.writeText(DOM.cfSchemaSql.value).then(() => {
            DOM.btnCopySql.textContent = '✅ コピーしました！';
            setTimeout(() => { DOM.btnCopySql.textContent = '📋 SQL をコピー'; }, 2000);
          }).catch(() => {
            DOM.btnCopySql.textContent = '全選択しました (Ctrl+C)';
          });
        });
      }

      // Admin dashboard tabs & inspection handlers
      if (DOM.tabAdminUsers) DOM.tabAdminUsers.addEventListener('click', () => switchAdminDashboardTab('users'));
      if (DOM.tabAdminRooms) DOM.tabAdminRooms.addEventListener('click', () => switchAdminDashboardTab('rooms'));
      if (DOM.tabAdminMessages) DOM.tabAdminMessages.addEventListener('click', () => switchAdminDashboardTab('messages'));
      if (DOM.btnAdminInspectActive) {
        DOM.btnAdminInspectActive.addEventListener('click', () => loadAdminOverview('active'));
      }
      if (DOM.btnAdminInspectCf) {
        DOM.btnAdminInspectCf.addEventListener('click', () => loadAdminOverview('cloudflare'));
      }
      if (DOM.btnAdminPruneImages) {
        DOM.btnAdminPruneImages.addEventListener('click', async () => {
          const forceCf = adminInspectMode === 'cloudflare';
          DOM.btnAdminPruneImages.disabled = true;
          DOM.btnAdminPruneImages.textContent = '🧹 削除チェック中...';
          try {
            const res = await callAdminApi('/api/wetalks/admin/prune-images', 'POST', forceCf);
            const count = (res && res.data && typeof res.data.prunedCount === 'number') ? res.data.prunedCount : 0;
            if (DOM.adminStorageStatus) {
              DOM.adminStorageStatus.style.background = '#e0f2fe';
              DOM.adminStorageStatus.style.borderColor = '#7dd3fc';
              DOM.adminStorageStatus.style.color = '#0369a1';
              DOM.adminStorageStatus.textContent = '🧹 10日経過画像のクリーンアップ完了: ' + count + '件の古い画像を削除しました。';
            }
            await loadAdminOverview(adminInspectMode);
          } finally {
            DOM.btnAdminPruneImages.disabled = false;
            DOM.btnAdminPruneImages.textContent = '🧹 10日経過した画像を今すぐチェック・削除';
          }
        });
      }

      // Save Settings
      DOM.btnSaveSettings.addEventListener('click', async () => {
        const prevBackend = getBackendType();
        const backend = selectedBackendSettingTab || getBackendType() || 'cloudflare';
        localStorage.setItem('wetalks_backend_type_v2', backend);
        localStorage.setItem('wetalks_backend_type', backend);

        // Save Cloudflare URL
        const newCfUrl = (DOM.inputCfUrl.value || '').trim();
        if (newCfUrl) {
          localStorage.setItem('wetalks_cloudflare_url', newCfUrl);
        } else {
          localStorage.removeItem('wetalks_cloudflare_url');
        }

        // Save Supabase credentials
        const newUrl = DOM.inputSupabaseUrl.value.trim();
        const newKey = DOM.inputSupabaseKey.value.trim();
        if (newUrl && newKey) {
          localStorage.setItem('wetalks_supabase_url', newUrl);
          localStorage.setItem('wetalks_supabase_key', newKey);
        } else {
          localStorage.removeItem('wetalks_supabase_url');
          localStorage.removeItem('wetalks_supabase_key');
          supabaseClient = null;
        }

        updateActiveBackendBanner();
        renderedRoomIdsHash = '';
        await initSupabase();
        if (prevBackend !== backend) {
          clearAuthSession();
          switchView('auth');
        } else {
          switchView('lobby');
        }
      });

      DOM.btnSend.addEventListener('click', sendMessage);
      DOM.msgInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
      if (DOM.btnImageAttach && DOM.msgImageFile) {
        DOM.btnImageAttach.addEventListener('click', () => {
          DOM.msgImageFile.click();
        });
        DOM.msgImageFile.addEventListener('change', async (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          try {
            const compressed = await compressChatImage(file);
            setPendingChatImage(compressed, file.name);
            DOM.msgInput.focus();
          } catch (err) {
            clearPendingChatImage();
            if (DOM.msgImagePreviewName) DOM.msgImagePreviewName.textContent = (err && err.message) || '画像の読み込みに失敗しました。';
          }
        });
      }
      if (DOM.btnClearMsgImage) {
        DOM.btnClearMsgImage.addEventListener('click', clearPendingChatImage);
      }
      if (DOM.msgInput) {
        DOM.msgInput.addEventListener('paste', async (e) => {
          const items = e.clipboardData && e.clipboardData.items;
          if (!items) return;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type && items[i].type.startsWith('image/')) {
              const file = items[i].getAsFile();
              if (file) {
                e.preventDefault();
                try {
                  const compressed = await compressChatImage(file);
                  setPendingChatImage(compressed, file.name || 'クリップボード画像');
                } catch (err) {}
              }
              break;
            }
          }
        });
      }
      if (DOM.btnCloseImageViewer && DOM.modalImageViewer) {
        DOM.btnCloseImageViewer.addEventListener('click', () => {
          DOM.modalImageViewer.classList.remove('active');
          if (DOM.imageViewerImg) DOM.imageViewerImg.src = '';
        });
        DOM.modalImageViewer.addEventListener('click', (e) => {
          if (e.target === DOM.modalImageViewer) {
            DOM.modalImageViewer.classList.remove('active');
            if (DOM.imageViewerImg) DOM.imageViewerImg.src = '';
          }
        });
      }
      function updateCreateRoomModalFields() {
        if (DOM.createRoomError) DOM.createRoomError.style.display = 'none';
        const type = DOM.selectNewRoomType.value;
        if (type === 'direct') {
          DOM.containerRoomName.style.display = 'none';
          DOM.containerDirectTarget.style.display = 'flex';
          
          DOM.selectDirectTarget.innerHTML = '';
          const myName = getSessionUser();
          const otherUsers = cachedUsers.filter(u => u.username !== myName);
          if (otherUsers.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = '他の登録ユーザーがいません';
            DOM.selectDirectTarget.appendChild(opt);
          } else {
            otherUsers.forEach(u => {
              const opt = document.createElement('option');
              opt.value = u.username;
              opt.textContent = u.username;
              DOM.selectDirectTarget.appendChild(opt);
            });
          }
        } else {
          DOM.containerRoomName.style.display = 'flex';
          DOM.containerDirectTarget.style.display = 'none';
        }
      }

      DOM.selectNewRoomType.addEventListener('change', updateCreateRoomModalFields);

      DOM.btnOpenCreate.addEventListener('click', () => {
        if (DOM.createRoomError) DOM.createRoomError.style.display = 'none';
        DOM.modalCreate.classList.add('active');
        updateCreateRoomModalFields();
        if (DOM.selectNewRoomType.value === 'group') {
          setTimeout(() => DOM.inputNewRoomName.focus(), 50);
        }
        // Background reload users if any new user joined
        loadCachedUsers().then(() => updateCreateRoomModalFields()).catch(() => {});
      });
      DOM.btnCreateCancel.addEventListener('click', () => DOM.modalCreate.classList.remove('active'));
      DOM.btnCreateConfirm.addEventListener('click', createRoom);
      DOM.inputNewRoomName.addEventListener('keydown', e => { if (e.key === 'Enter') createRoom(); });

      window.addEventListener('storage', e => {
        if (e.key === DB_KEY) {
          try {
            const db = JSON.parse(e.newValue || localStorage.getItem(DB_KEY));
            if (db && db.messages) {
              Object.keys(db.messages).forEach(roomId => {
                db.messages[roomId].forEach(msg => {
                  checkAndNotifyNewMessage(msg);
                });
              });
            }
          } catch(err){}
          if (currentView === 'lobby') renderLobby();
          else if (currentView === 'chat') renderMessages();
        }
        if (e.key === ACTIVE_USERS_KEY) updateReadReceipts();
      });

      function initGlobalDeleteListener() {
        if (!supabaseClient) return;
        const lobbyChannel = supabaseClient.channel('global-lobby-sync');
        lobbyChannel
          .on('broadcast', { event: 'room_deleted' }, ({ payload }) => {
            const delId = payload.roomId;
            if (activeRoomId === delId) {
              alert("このトークルームは管理者に削除されました。");
              switchView('lobby');
            } else {
              renderLobby();
            }
          })
          .subscribe();
      }

      // Smooth background polling for server-based messages and room updates (every 3 seconds)
      setInterval(async () => {
        try {
          if (currentView === 'chat' && activeRoomId) {
            await pollActiveRoomMessages();
          } else if (currentView === 'lobby') {
            await pollLobbyUpdates();
          }
        } catch(e) {}
      }, 3000);

      initSupabase();
      initGlobalDeleteListener();
      fetchUserIpAndInitName();
    })();
  </script>
</body>
</html>`;

// 3DヨットダイスのHTMLソース
export const YACHT_GAME_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>We talks Yacht Dice</title>
  <style>
    :root {
      --primary: #06C755;
      --bg: #1e293b;
      --panel: #334155;
      --text: #f8fafc;
      --text-dim: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg); color: var(--text); padding: 12px; display: flex; flex-direction: column; overflow: hidden;
    }
    .header { background: var(--primary); padding: 12px; font-weight: bold; border-radius: 8px; text-align: center; margin-bottom: 12px; flex-shrink: 0; font-size:16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .lobby-screen, .game-screen { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
    .btn { background: var(--primary); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; text-align: center; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: background-color 0.15s; }
    .btn:hover { background: #05b042; }
    .btn.secondary { background: #64748b; }
    .btn.secondary:hover { background: #475569; }
    .btn:disabled { background: #475569; opacity: 0.5; cursor: default; }
    .game-board { display: flex; flex-direction: row; gap: 12px; flex: 1; overflow: hidden; }
    .board-left { flex: 1.2; display: flex; flex-direction: column; gap: 12px; }
    .board-right { flex: 0.8; background: var(--panel); border-radius: 8px; padding: 10px; overflow-y: auto; font-size: 12px; }
    .dice-container { display: flex; gap: 12px; justify-content: center; padding: 15px 0; flex-wrap: wrap; }
    .die-scene { width: 50px; height: 50px; perspective: 300px; cursor: pointer; }
    .die-cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.3, 1); }
    .die-face {
      position: absolute; width: 50px; height: 50px; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: bold; color: #1e293b;
      box-shadow: inset 0 0 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1); backface-visibility: hidden;
    }
    .die-face.f1 { transform: rotateY(0deg) translateZ(25px); }
    .die-face.f6 { transform: rotateY(180deg) translateZ(25px); }
    .die-face.f3 { transform: rotateY(90deg) translateZ(25px); }
    .die-face.f4 { transform: rotateY(-90deg) translateZ(25px); }
    .die-face.f2 { transform: rotateX(90deg) translateZ(25px); }
    .die-face.f5 { transform: rotateX(-90deg) translateZ(25px); }
    .die-scene.kept .die-face { border: 3px solid #f97316; background: #fff7ed; box-shadow: inset 0 0 6px rgba(249, 115, 22, 0.2), 0 3px 6px rgba(249, 115, 22, 0.3); }
    .score-table { width: 100%; border-collapse: collapse; text-align: left; margin-top: 4px; }
    .score-table th, .score-table td { padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .score-table th { background: rgba(0,0,0,0.2); color: var(--text-dim); font-size: 11px; }
    .score-row { cursor: pointer; transition: background-color 0.1s; }
    .score-row:hover:not(.scored) { background: rgba(255,255,255,0.05); }
    .score-row.scored { cursor: not-allowed; opacity: 0.6; }
    .score-val { text-align: right; font-weight: bold; color: var(--primary); }
    .score-val.potential { color: #f59e0b; opacity: 0.8; }
    .game-status-bar { padding: 8px; background: rgba(0,0,0,0.15); border-radius: 6px; font-size: 13px; text-align: center; font-weight: bold; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <div class="header" id="header-text">We talks Yacht Dice</div>

  <div class="lobby-screen" id="lobby-screen">
    <div style="font-size: 13px; color: var(--text-dim); margin-bottom: 12px; text-align: center;">部屋コードを指定してオンライン対戦相手と繋がります</div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px;">
      <input type="text" id="input-room-code" placeholder="部屋コードを入力 (例: 777)" style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #475569; background: var(--panel); color: white; outline: none; font-size: 14px;" />
      <button class="btn" id="btn-join-room">部屋に入る / 作成</button>
    </div>
    <button class="btn secondary" id="btn-solo-play" style="width: 100%;">練習用ソロプレイ (オフライン)</button>
  </div>

  <div class="game-screen" id="game-screen" style="display: none;">
    <div class="game-board">
      <div class="board-left">
        <div class="game-status-bar" id="status-bar">対戦相手を待っています...</div>
        <div class="dice-container" id="dice-container">
          <div class="die-scene" data-idx="0"><div class="die-cube"><div class="die-face f1">⚀</div><div class="die-face f2">⚁</div><div class="die-face f3">⚂</div><div class="die-face f4">⚃</div><div class="die-face f5">⚄</div><div class="die-face f6">⚅</div></div></div>
          <div class="die-scene" data-idx="1"><div class="die-cube"><div class="die-face f1">⚀</div><div class="die-face f2">⚁</div><div class="die-face f3">⚂</div><div class="die-face f4">⚃</div><div class="die-face f5">⚄</div><div class="die-face f6">⚅</div></div></div>
          <div class="die-scene" data-idx="2"><div class="die-cube"><div class="die-face f1">⚀</div><div class="die-face f2">⚁</div><div class="die-face f3">⚂</div><div class="die-face f4">⚃</div><div class="die-face f5">⚄</div><div class="die-face f6">⚅</div></div></div>
          <div class="die-scene" data-idx="3"><div class="die-cube"><div class="die-face f1">⚀</div><div class="die-face f2">⚁</div><div class="die-face f3">⚂</div><div class="die-face f4">⚃</div><div class="die-face f5">⚄</div><div class="die-face f6">⚅</div></div></div>
          <div class="die-scene" data-idx="4"><div class="die-cube"><div class="die-face f1">⚀</div><div class="die-face f2">⚁</div><div class="die-face f3">⚂</div><div class="die-face f4">⚃</div><div class="die-face f5">⚄</div><div class="die-face f6">⚅</div></div></div>
        </div>
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button class="btn" id="btn-roll" style="flex: 1;">サイコロを振る (残り3回)</button>
          <button class="btn secondary" id="btn-leave-game" style="flex: 0.5;">退出</button>
        </div>
        <div style="font-size: 10px; color: var(--text-dim); text-align: center;">※キープしたいサイコロをタップして「サイコロを振る」を押してください。</div>
      </div>
      <div class="board-right">
        <h4 style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; margin-bottom: 6px; font-size: 13px;">スコアシート</h4>
        <table class="score-table">
          <thead><tr><th>役名</th><th style="text-align: right;">あなた</th><th style="text-align: right;" id="col-opp">相手</th></tr></thead>
          <tbody id="score-rows-container"></tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    (function() {
      'use strict';

      let localStorage;
      try {
        window.localStorage.getItem('test');
        localStorage = window.localStorage;
      } catch (e) {
        localStorage = {
          _data: {},
          getItem: function(k) { return this._data[k] !== undefined ? this._data[k] : null; },
          setItem: function(k, v) { this._data[k] = String(v); },
          removeItem: function(k) { delete this._data[k]; },
          clear: function() { this._data = {}; }
        };
      }

      let sessionStorage;
      try {
        window.sessionStorage.getItem('test');
        sessionStorage = window.sessionStorage;
      } catch (e) {
        sessionStorage = {
          _data: {},
          getItem: function(k) { return this._data[k] !== undefined ? this._data[k] : null; },
          setItem: function(k, v) { this._data[k] = String(v); },
          removeItem: function(k) { delete this._data[k]; },
          clear: function() { this._data = {}; }
        };
      }

      let supabaseClient = null;
      let gameChannel = null;
      const url = localStorage.getItem('wetalks_supabase_url') || 'https://nsyvlftqcciyetsbhymg.supabase.co';
      const key = localStorage.getItem('wetalks_supabase_key') || 'sb_publishable_lkhrFuMlNyEmUX4RTFApKw_AhD1sAkV';
      try {
        if (typeof supabase !== 'undefined') {
          supabaseClient = supabase.createClient(url, key);
        } else {
          console.warn("Supabase SDK is not loaded.");
        }
      } catch(e) { console.error(e); }

      let isSolo = false;
      let myId = 'p-' + Math.floor(1000 + Math.random() * 9000);
      let myName = sessionStorage.getItem('wetalks_session_user') || 'ゲスト';
      let oppId = null;
      let oppName = "対戦相手";
      let diceValues = [1, 1, 1, 1, 1];
      let diceKept = [false, false, false, false, false];
      let rollCount = 0;
      let isMyTurn = false;
      let gameActive = false;
      let rollRotations = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];

      const CATEGORIES = [
        { id: 'aces', name: '① エース', calc: d => sumOf(d, 1) },
        { id: 'deuces', name: '② デュース', calc: d => sumOf(d, 2) },
        { id: 'treys', name: '③ トレイ', calc: d => sumOf(d, 3) },
        { id: 'fours', name: '④ フォー', calc: d => sumOf(d, 4) },
        { id: 'fives', name: '⑤ ファイブ', calc: d => sumOf(d, 5) },
        { id: 'sixes', name: '⑥ シックス', calc: d => sumOf(d, 6) },
        { id: 'choice', name: '選択 (全合計)', calc: d => d.reduce((a, b) => a + b, 0) },
        { id: 'four_kind', name: 'フォー・カインド', calc: d => hasOfKind(d, 4) ? d.reduce((a, b) => a + b, 0) : 0 },
        { id: 'full_house', name: 'フルハウス', calc: d => isFullHouse(d) ? d.reduce((a, b) => a + b, 0) : 0 },
        { id: 's_straight', name: 'S.ストレート', calc: d => isSmallStraight(d) ? 15 : 0 },
        { id: 'l_straight', name: 'L.ストレート', calc: d => isLargeStraight(d) ? 30 : 0 },
        { id: 'yacht', name: 'ヨット', calc: d => hasOfKind(d, 5) ? 50 : 0 }
      ];

      let myScores = {};
      let oppScores = {};

      const DOM = {
        lobby: document.getElementById('lobby-screen'),
        game: document.getElementById('game-screen'),
        roomCode: document.getElementById('input-room-code'),
        btnJoin: document.getElementById('btn-join-room'),
        btnSolo: document.getElementById('btn-solo-play'),
        statusBar: document.getElementById('status-bar'),
        btnRoll: document.getElementById('btn-roll'),
        btnLeave: document.getElementById('btn-leave-game'),
        diceContainer: document.getElementById('dice-container'),
        colOpp: document.getElementById('col-opp'),
        scoreRows: document.getElementById('score-rows-container'),
        headerText: document.getElementById('header-text')
      };

      function sumOf(d, val) { return d.filter(x => x === val).length * val; }
      function hasOfKind(d, num) {
        const counts = d.reduce((acc, val) => { acc[val] = (acc[val] || 0) + 1; return acc; }, {});
        return Object.values(counts).some(c => c >= num);
      }
      function isFullHouse(d) {
        const counts = d.reduce((acc, val) => { acc[val] = (acc[val] || 0) + 1; return acc; }, {});
        const vals = Object.values(counts);
        return (vals.includes(3) && vals.includes(2)) || vals.includes(5);
      }
      function isSmallStraight(d) {
        const unique = Array.from(new Set(d)).sort().join("");
        return unique.includes("1234") || unique.includes("2345") || unique.includes("3456");
      }
      function isLargeStraight(d) {
        const unique = Array.from(new Set(d)).sort().join("");
        return unique === "12345" || unique === "23456";
      }

      function getCubeTransform(idx, value) {
        const rx = rollRotations[idx].x;
        const ry = rollRotations[idx].y;
        switch (value) {
          case 1: return 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
          case 6: return 'rotateX(' + rx + 'deg) rotateY(' + (ry + 180) + 'deg)';
          case 3: return 'rotateX(' + rx + 'deg) rotateY(' + (ry + 90) + 'deg)';
          case 4: return 'rotateX(' + rx + 'deg) rotateY(' + (ry - 90) + 'deg)';
          case 2: return 'rotateX(' + (rx - 90) + 'deg) rotateY(' + ry + 'deg)';
          case 5: return 'rotateX(' + (rx + 90) + 'deg) rotateY(' + ry + 'deg)';
          default: return 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        }
      }

      function updateDiceUI() {
        const scenes = DOM.diceContainer.querySelectorAll('.die-scene');
        scenes.forEach((scene, idx) => {
          scene.classList.toggle('kept', diceKept[idx]);
          const cube = scene.querySelector('.die-cube');
          if (cube) cube.style.transform = getCubeTransform(idx, diceValues[idx]);
        });
      }

      function toggleKeep(idx) {
        if (!gameActive || !isMyTurn || rollCount === 0) return;
        diceKept[idx] = !diceKept[idx];
        updateDiceUI();
        if (!isSolo) sendGameState(false);
      }

      function updateGameStatus() {
        if (!gameActive) {
          DOM.statusBar.textContent = "対戦相手を待っています...";
          return;
        }
        if (isMyTurn) {
          DOM.statusBar.textContent = "🟢 あなたの番です。ダイスを振るか、得点表の確定させたい役をクリックしてください。";
          DOM.btnRoll.disabled = rollCount >= 3;
        } else {
          DOM.statusBar.textContent = "🔴 " + oppName + " の手番です。相手のプレイを待っています...";
          DOM.btnRoll.disabled = true;
        }
      }

      function checkGameOver() {
        const myDone = CATEGORIES.every(cat => myScores[cat.id] !== undefined);
        const oppDone = isSolo || CATEGORIES.every(cat => oppScores[cat.id] !== undefined);
        if (myDone && oppDone) {
          gameActive = false;
          const myTotal = Object.values(myScores).reduce((a, b) => a + b, 0);
          const oppTotal = isSolo ? 0 : Object.values(oppScores).reduce((a, b) => a + b, 0);
          let resultMsg = "ゲーム終了！あなたの最終得点: " + myTotal + "点";
          if (!isSolo) {
            resultMsg += " 対 " + oppName + ": " + oppTotal + "点\\n";
            if (myTotal > oppTotal) resultMsg += "🏆 あなたの勝ちです！";
            else if (myTotal < oppTotal) resultMsg += "敗北しました...";
            else resultMsg += "引き分けです！";
          } else {
            resultMsg += " (ソロ練習終了)";
          }
          DOM.statusBar.textContent = resultMsg;
          alert(resultMsg);
        }
      }

      function updateScoreboard() {
        DOM.scoreRows.innerHTML = '';
        CATEGORIES.forEach(cat => {
          const tr = document.createElement('tr');
          tr.className = 'score-row';
          if (myScores[cat.id] !== undefined) tr.classList.add('scored');
          const tdName = document.createElement('td');
          tdName.textContent = cat.name;
          const tdMy = document.createElement('td');
          tdMy.className = 'score-val';
          if (myScores[cat.id] !== undefined) {
            tdMy.textContent = myScores[cat.id];
          } else if (rollCount > 0 && isMyTurn && gameActive) {
            tdMy.textContent = cat.calc(diceValues);
            tdMy.classList.add('potential');
            tr.addEventListener('click', () => selectCategory(cat.id));
          } else {
            tdMy.textContent = '-';
          }
          const tdOpp = document.createElement('td');
          tdOpp.className = 'score-val';
          tdOpp.textContent = oppScores[cat.id] !== undefined ? oppScores[cat.id] : '-';
          if (isSolo) tdOpp.style.display = 'none';
          tr.appendChild(tdName);
          tr.appendChild(tdMy);
          tr.appendChild(tdOpp);
          DOM.scoreRows.appendChild(tr);
        });

        const totalTr = document.createElement('tr');
        totalTr.style.background = 'rgba(255,255,255,0.05)';
        totalTr.style.fontWeight = 'bold';
        const tdTotalName = document.createElement('td');
        tdTotalName.textContent = '合計得点';
        const tdMyTotal = document.createElement('td');
        tdMyTotal.className = 'score-val';
        tdMyTotal.textContent = Object.values(myScores).reduce((a, b) => a + b, 0);
        const tdOppTotal = document.createElement('td');
        tdOppTotal.className = 'score-val';
        tdOppTotal.textContent = Object.values(oppScores).reduce((a, b) => a + b, 0);
        if (isSolo) tdOppTotal.style.display = 'none';
        totalTr.appendChild(tdTotalName);
        totalTr.appendChild(tdMyTotal);
        totalTr.appendChild(tdOppTotal);
        DOM.scoreRows.appendChild(totalTr);
      }

      function selectCategory(catId) {
        if (!isMyTurn || myScores[catId] !== undefined || rollCount === 0 || !gameActive) return;
        const score = CATEGORIES.find(c => c.id === catId).calc(diceValues);
        myScores[catId] = score;
        diceKept = [false, false, false, false, false];
        rollCount = 0;
        if (isSolo) {
          isMyTurn = true;
          checkGameOver();
        } else {
          isMyTurn = false;
          sendGameState(true);
          checkGameOver();
        }
        DOM.btnRoll.textContent = "サイコロを振る (残り3回)";
        updateScoreboard();
        updateDiceUI();
        updateGameStatus();
      }

      function rollDice() {
        if (!isMyTurn || rollCount >= 3 || !gameActive) return;
        for (let i = 0; i < 5; i++) {
          if (!diceKept[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
            rollRotations[i].x += 720 + Math.floor(Math.random() * 4) * 90;
            rollRotations[i].y += 720 + Math.floor(Math.random() * 4) * 90;
          }
        }
        rollCount++;
        DOM.btnRoll.textContent = "サイコロを振る (残り" + (3 - rollCount) + "回)";
        if (rollCount >= 3) DOM.btnRoll.disabled = true;
        updateDiceUI();
        updateScoreboard();
        updateGameStatus();
        if (!isSolo) sendGameState(false);
      }

      function joinRoom(roomCode) {
        if (!supabaseClient) return alert("Supabaseの設定が有効になっていないため対戦できません。");
        isSolo = false;
        DOM.colOpp.style.display = 'table-cell';
        DOM.headerText.textContent = "Yacht Room: " + roomCode;
        DOM.lobby.style.display = 'none';
        DOM.game.style.display = 'flex';
        myScores = {};
        oppScores = {};
        rollCount = 0;
        diceValues = [1, 1, 1, 1, 1];
        diceKept = [false, false, false, false, false];

        gameChannel = supabaseClient.channel('yacht-' + roomCode);
        gameChannel
          .on('broadcast', { event: 'join' }, ({ payload }) => {
            if (payload.id !== myId) {
              oppId = payload.id;
              oppName = payload.name;
              gameChannel.send({ type: 'broadcast', event: 'welcome', payload: { id: myId, name: myName, scores: myScores } });
              gameActive = true;
              isMyTurn = true;
              updateGameStatus();
              updateScoreboard();
              updateDiceUI();
            }
          })
          .on('broadcast', { event: 'welcome' }, ({ payload }) => {
            if (payload.id !== myId) {
              oppId = payload.id;
              oppName = payload.name;
              oppScores = payload.scores;
              gameActive = true;
              isMyTurn = false;
              updateGameStatus();
              updateScoreboard();
              updateDiceUI();
            }
          })
          .on('broadcast', { event: 'state' }, ({ payload }) => {
            if (payload.id !== myId) {
              diceValues = payload.diceValues;
              oppScores = payload.scores;
              if (payload.turnEnded) {
                isMyTurn = true;
                rollCount = 0;
                diceKept = [false, false, false, false, false];
                DOM.btnRoll.textContent = "サイコロを振る (残り3回)";
                DOM.btnRoll.disabled = false;
              }
              updateDiceUI();
              updateScoreboard();
              updateGameStatus();
              checkGameOver();
            }
          })
          .on('broadcast', { event: 'leave' }, () => {
            alert("対戦相手が退出しました。");
            leaveGame();
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              gameChannel.send({ type: 'broadcast', event: 'join', payload: { id: myId, name: myName } });
            }
          });
      }

      function sendGameState(turnEnded = false) {
        if (!gameChannel) return;
        gameChannel.send({
          type: 'broadcast',
          event: 'state',
          payload: { id: myId, diceValues: diceValues, scores: myScores, turnEnded: turnEnded }
        });
      }

      function startSoloPlay() {
        isSolo = true;
        DOM.colOpp.style.display = 'none';
        DOM.headerText.textContent = "We talks Yacht (Solo)";
        DOM.lobby.style.display = 'none';
        DOM.game.style.display = 'flex';
        gameActive = true;
        isMyTurn = true;
        myScores = {};
        oppScores = {};
        rollCount = 0;
        diceValues = [1, 1, 1, 1, 1];
        diceKept = [false, false, false, false, false];
        updateDiceUI();
        updateScoreboard();
        updateGameStatus();
      }

      function leaveGame() {
        if (gameChannel) {
          gameChannel.send({ type: 'broadcast', event: 'leave', payload: { id: myId } });
          supabaseClient.removeChannel(gameChannel);
          gameChannel = null;
        }
        isSolo = false;
        gameActive = false;
        myScores = {};
        oppScores = {};
        DOM.lobby.style.display = 'flex';
        DOM.game.style.display = 'none';
        DOM.headerText.textContent = "We talks Yacht Dice";
      }

      DOM.btnJoin.addEventListener('click', () => {
        const code = DOM.roomCode.value.trim();
        if (code) joinRoom(code);
      });
      DOM.btnSolo.addEventListener('click', startSoloPlay);
      DOM.btnLeave.addEventListener('click', leaveGame);
      DOM.btnRoll.addEventListener('click', rollDice);

      DOM.diceContainer.querySelectorAll('.die-scene').forEach(scene => {
        scene.addEventListener('click', () => {
          const idx = parseInt(scene.getAttribute('data-idx'));
          toggleKeep(idx);
        });
      });
    })();
  </script>
</body>
</html>`;

// We talks: 2. UNO風ゲーム（UNO Card Game）のHTMLソース
export const UNO_GAME_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>We talks UNO</title>
  <style>
    :root {
      --primary: #06C755;
      --bg: #151515;
      --panel: #222222;
      --text: #f5f5f5;
      --text-dim: #999;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; margin: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg); color: var(--text); padding: 12px; display: flex; flex-direction: column; overflow: hidden;
    }
    .header { background: var(--primary); padding: 12px; font-weight: bold; border-radius: 8px; text-align: center; margin-bottom: 12px; flex-shrink: 0; font-size:16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .lobby-screen, .game-screen { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
    .btn { background: var(--primary); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; text-align: center; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: background-color 0.15s; }
    .btn:hover { background: #05b042; }
    .btn.secondary { background: #444; }
    .btn.secondary:hover { background: #333; }
    .game-area { display: flex; flex-direction: column; flex: 1; justify-content: space-between; overflow: hidden; gap: 8px; }
    .opponent-hand-area { background: var(--panel); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .opponent-cards { display: flex; gap: -15px; }
    .card-back {
      width: 44px; height: 66px; background: radial-gradient(circle, #f43f5e 60%, #9f1239 100%);
      border: 2px solid white; border-radius: 6px; display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: bold; color: yellow; transform: scale(0.9); box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .field-area { display: flex; flex: 1; align-items: center; justify-content: center; gap: 32px; background: rgba(255,255,255,0.02); border-radius: 8px; position: relative; }
    .pile-container { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .card {
      width: 54px; height: 80px; border-radius: 8px; border: 3px solid white;
      display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px;
      color: white; cursor: pointer; position: relative; box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      user-select: none; transition: transform 0.12s, margin-top 0.12s;
    }
    .card:hover { transform: translateY(-8px) scale(1.05); z-index: 10; }
    .card.red { background: linear-gradient(135deg, #ef4444, #b91c1c); }
    .card.yellow { background: linear-gradient(135deg, #eab308, #a16207); color: #000; border-color: #000; }
    .card.green { background: linear-gradient(135deg, #22c55e, #15803d); }
    .card.blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .card.wild { background: linear-gradient(135deg, #1e1e1e, #111111); }
    .player-hand-area { background: var(--panel); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
    .player-cards { display: flex; gap: 4px; overflow-x: auto; width: 100%; justify-content: center; padding: 6px 0; }
    .status-bar { padding: 8px; background: rgba(0,0,0,0.3); border-radius: 6px; font-size: 13px; text-align: center; font-weight: bold; width: 100%; }

    @keyframes slideInFromDeck {
      0% { transform: translateY(-200px) rotate(45deg); opacity: 0; }
      100% { transform: translateY(0) rotate(0deg); opacity: 1; }
    }
    .card.drawn-anim { animation: slideInFromDeck 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

    @keyframes slideToDiscard {
      0% { transform: translateY(120px) scale(1.1) rotate(-10deg); opacity: 0.5; }
      100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
    }
    .card.played-anim { animation: slideToDiscard 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

    @keyframes slideToDiscardFromOpp {
      0% { transform: translateY(-120px) scale(1.1) rotate(10deg); opacity: 0.5; }
      100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
    }
    .card.played-opp-anim { animation: slideToDiscardFromOpp 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <div class="header" id="header-text">We talks UNO</div>

  <div class="lobby-screen" id="lobby-screen">
    <div style="font-size: 13px; color: var(--text-dim); margin-bottom: 12px; text-align: center;">部屋コードを指定してオンライン対戦相手と繋がります</div>
    <div style="display: flex; gap: 8px; margin-bottom: 12px;">
      <input type="text" id="input-room-code" placeholder="部屋コードを入力 (例: 888)" style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #475569; background: var(--panel); color: white; outline: none; font-size: 14px;" />
      <button class="btn" id="btn-join-room">部屋に入る / 作成</button>
    </div>
    <button class="btn secondary" id="btn-ai-play" style="width: 100%;">練習用AI対戦プレイ (オフライン)</button>
  </div>

  <div class="game-screen" id="game-screen" style="display: none;">
    <div class="game-area">
      <div class="opponent-hand-area">
        <span id="opp-name-tag" style="font-size: 12px; font-weight: bold;">AI対戦相手 (手札: 7枚)</span>
        <div class="opponent-cards" id="opp-cards-container"></div>
      </div>
      <div class="field-area">
        <div class="pile-container">
          <div class="card-back" id="btn-draw" style="cursor: pointer; width: 56px; height: 82px; font-size: 11px;">山札<br>引く</div>
        </div>
        <div class="pile-container">
          <span style="font-size:11px; color: var(--text-dim);">場札</span>
          <div id="discard-card-container"></div>
        </div>
        <button class="btn" id="btn-end-turn" style="display: none; position: absolute; left: 12px; bottom: 12px; padding: 6px 12px; font-size:11px; background:#f59e0b;">ターン終了</button>
        <button class="btn secondary" id="btn-leave-game" style="position: absolute; right: 12px; bottom: 12px; padding: 6px 12px; font-size:11px;">退出</button>
      </div>
      <div class="player-hand-area">
        <div class="status-bar" id="status-bar">山札から引くか、出せるカードを出してください。</div>
        <div class="player-cards" id="player-cards-container"></div>
      </div>
    </div>
  </div>

  <script>
    (function() {
      'use strict';

      let localStorage;
      try {
        window.localStorage.getItem('test');
        localStorage = window.localStorage;
      } catch (e) {
        localStorage = {
          _data: {},
          getItem: function(k) { return this._data[k] !== undefined ? this._data[k] : null; },
          setItem: function(k, v) { this._data[k] = String(v); },
          removeItem: function(k) { delete this._data[k]; },
          clear: function() { this._data = {}; }
        };
      }

      let sessionStorage;
      try {
        window.sessionStorage.getItem('test');
        sessionStorage = window.sessionStorage;
      } catch (e) {
        sessionStorage = {
          _data: {},
          getItem: function(k) { return this._data[k] !== undefined ? this._data[k] : null; },
          setItem: function(k, v) { this._data[k] = String(v); },
          removeItem: function(k) { delete this._data[k]; },
          clear: function() { this._data = {}; }
        };
      }

      let supabaseClient = null;
      let gameChannel = null;
      const url = localStorage.getItem('wetalks_supabase_url') || 'https://nsyvlftqcciyetsbhymg.supabase.co';
      const key = localStorage.getItem('wetalks_supabase_key') || 'sb_publishable_lkhrFuMlNyEmUX4RTFApKw_AhD1sAkV';
      try {
        if (typeof supabase !== 'undefined') {
          supabaseClient = supabase.createClient(url, key);
        } else {
          console.warn("Supabase SDK is not loaded.");
        }
      } catch(e) {}

      let isSolo = false;
      let myId = 'p-' + Math.floor(1000 + Math.random() * 9000);
      let myName = sessionStorage.getItem('wetalks_session_user') || 'ゲスト';
      let oppId = null;
      let oppName = "対戦相手";
      let myHand = [];
      let oppHandCount = 0;
      let oppHand = [];
      let discardPile = [];
      let activeColor = '';
      let isMyTurn = false;
      let gameActive = false;
      let stackedValue = null; 
      let lastAction = null;

      const COLORS = ['red', 'yellow', 'green', 'blue'];
      const VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Draw2'];

      const DOM = {
        lobby: document.getElementById('lobby-screen'),
        game: document.getElementById('game-screen'),
        roomCode: document.getElementById('input-room-code'),
        btnJoin: document.getElementById('btn-join-room'),
        btnAI: document.getElementById('btn-ai-play'),
        statusBar: document.getElementById('status-bar'),
        btnDraw: document.getElementById('btn-draw'),
        btnLeave: document.getElementById('btn-leave-game'),
        btnEndTurn: document.getElementById('btn-end-turn'),
        oppNameTag: document.getElementById('opp-name-tag'),
        oppCardsContainer: document.getElementById('opp-cards-container'),
        playerCardsContainer: document.getElementById('player-cards-container'),
        discardContainer: document.getElementById('discard-card-container'),
        headerText: document.getElementById('header-text')
      };

      function createRandomCard() {
        if (Math.random() < 0.1) return { color: 'wild', value: 'Wild' };
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const value = VALUES[Math.floor(Math.random() * VALUES.length)];
        return { color, value };
      }

      function buildCardDOM(card, isPlayable = false, clickHandler = null) {
        const div = document.createElement('div');
        div.className = 'card ' + card.color;
        let label = card.value;
        if (card.value === 'Draw2') label = '+2';
        if (card.value === 'Wild') label = 'W';
        div.textContent = label;
        if (isPlayable && clickHandler) div.addEventListener('click', clickHandler);
        return div;
      }

      function updateUI() {
        if (!gameActive) return;
        DOM.discardContainer.innerHTML = '';
        if (discardPile.length > 0) {
          const topCard = discardPile[discardPile.length - 1];
          const displayCard = { ...topCard };
          if (topCard.color === 'wild' && activeColor) displayCard.color = activeColor;
          const discardDOM = buildCardDOM(displayCard);
          if (lastAction === 'play_me') discardDOM.classList.add('played-anim');
          else if (lastAction === 'play_opp') discardDOM.classList.add('played-opp-anim');
          DOM.discardContainer.appendChild(discardDOM);
        }

        DOM.playerCardsContainer.innerHTML = '';
        myHand.forEach((card, idx) => {
          const playable = isMyTurn && canPlay(card);
          const dom = buildCardDOM(card, playable, () => playCard(idx));
          if (!playable) dom.style.opacity = '0.5';
          if (lastAction === 'draw' && idx === myHand.length - 1) dom.classList.add('drawn-anim');
          DOM.playerCardsContainer.appendChild(dom);
        });

        DOM.oppCardsContainer.innerHTML = '';
        const count = isSolo ? oppHand.length : oppHandCount;
        for (let i = 0; i < count; i++) {
          const cardBack = document.createElement('div');
          cardBack.className = 'card-back';
          cardBack.textContent = 'UNO';
          DOM.oppCardsContainer.appendChild(cardBack);
        }
        DOM.oppNameTag.textContent = oppName + " (手札: " + count + "枚)";

        if (isMyTurn) {
          if (stackedValue !== null) {
            DOM.statusBar.textContent = "🟢 同数字（" + stackedValue + "）の連続出しが可能です。出さない場合は「ターン終了」を押してください。";
            DOM.btnDraw.style.pointerEvents = 'none';
            DOM.btnDraw.style.opacity = '0.5';
          } else {
            DOM.statusBar.textContent = "🟢 あなたの手番です。場札に合うカードを出すか、山札から引いてください。";
            DOM.btnDraw.style.pointerEvents = 'auto';
            DOM.btnDraw.style.opacity = '1';
          }
        } else {
          DOM.statusBar.textContent = "🔴 " + oppName + " の手番です。相手の操作を待っています...";
          DOM.btnDraw.style.pointerEvents = 'none';
          DOM.btnDraw.style.opacity = '0.5';
        }
        lastAction = null;
        checkGameOver();
      }

      function canPlay(card) {
        if (stackedValue !== null) return card.value === stackedValue;
        if (discardPile.length === 0) return true;
        const top = discardPile[discardPile.length - 1];
        if (card.color === 'wild') return true;
        const topColor = top.color === 'wild' ? activeColor : top.color;
        if (card.color === topColor) return true;
        if (card.value === top.value) return true;
        return false;
      }

      function playCard(idx) {
        if (!isMyTurn) return;
        const card = myHand.splice(idx, 1)[0];
        discardPile.push(card);
        lastAction = 'play_me';
        if (card.color === 'wild') {
          activeColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        } else {
          activeColor = card.color;
        }
        const hasMoreSameValue = myHand.some(c => c.value === card.value);
        if (hasMoreSameValue) {
          stackedValue = card.value;
          DOM.btnEndTurn.style.display = 'block';
          updateUI();
        } else {
          endMyTurn(card);
        }
      }

      function endMyTurn(card) {
        stackedValue = null;
        DOM.btnEndTurn.style.display = 'none';
        let turnSkip = false;
        let drawPenalty = 0;
        if (card.value === 'Skip') turnSkip = true;
        if (card.value === 'Draw2') drawPenalty = 2;
        isMyTurn = false;

        if (isSolo) {
          updateUI();
          if (drawPenalty > 0) {
            for (let i = 0; i < drawPenalty; i++) oppHand.push(createRandomCard());
          }
          if (turnSkip) {
            isMyTurn = true;
            setTimeout(updateUI, 1000);
          } else {
            setTimeout(aiTurn, 1500);
          }
        } else {
          sendGameState(turnSkip, drawPenalty);
          updateUI();
        }
      }

      function drawCard() {
        if (!isMyTurn || stackedValue !== null) return;
        myHand.push(createRandomCard());
        lastAction = 'draw';
        isMyTurn = false;
        if (isSolo) {
          updateUI();
          setTimeout(aiTurn, 1200);
        } else {
          sendGameState(false, 0);
          updateUI();
        }
      }

      function checkGameOver() {
        if (!gameActive) return;
        if (myHand.length === 0) {
          gameActive = false;
          isMyTurn = false;
          DOM.statusBar.textContent = "🏆 あなたの勝利！すべてのカードを出し切りました！";
          alert("おめでとうございます！あなたの勝利です！");
        } else if ((isSolo && oppHand.length === 0) || (!isSolo && oppHandCount === 0 && oppId)) {
          gameActive = false;
          isMyTurn = false;
          DOM.statusBar.textContent = "敗北... " + oppName + " が先にカードを出し切りました。";
          alert("残念... " + oppName + "の勝利です。");
        }
      }

      function aiTurn() {
        if (!gameActive) return;
        let playIdx = -1;
        for (let i = 0; i < oppHand.length; i++) {
          if (canPlay(oppHand[i])) {
            playIdx = i;
            break;
          }
        }
        if (playIdx !== -1) {
          const card = oppHand.splice(playIdx, 1)[0];
          discardPile.push(card);
          lastAction = 'play_opp';
          let turnSkip = false;
          let drawPenalty = 0;
          if (card.color === 'wild') {
            activeColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          } else {
            activeColor = card.color;
          }
          if (card.value === 'Skip') turnSkip = true;
          if (card.value === 'Draw2') drawPenalty = 2;
          if (drawPenalty > 0) {
            for (let i = 0; i < drawPenalty; i++) myHand.push(createRandomCard());
          }
          if (turnSkip) setTimeout(aiTurn, 1500);
          else isMyTurn = true;
        } else {
          oppHand.push(createRandomCard());
          lastAction = 'draw_opp';
          isMyTurn = true;
        }
        updateUI();
      }

      function joinRoom(roomCode) {
        if (!supabaseClient) return alert("シミュレーターの設定でSupabaseが連携されていないため動作しません。");
        isSolo = false;
        DOM.headerText.textContent = "UNO Room: " + roomCode;
        DOM.lobby.style.display = 'none';
        DOM.game.style.display = 'flex';
        myHand = Array.from({ length: 7 }, createRandomCard);
        oppHandCount = 7;
        discardPile = [{ color: 'red', value: '5' }];
        activeColor = 'red';

        gameChannel = supabaseClient.channel('uno-' + roomCode);
        gameChannel
          .on('broadcast', { event: 'join' }, ({ payload }) => {
            if (payload.id !== myId) {
              oppId = payload.id;
              oppName = payload.name;
              gameChannel.send({ type: 'broadcast', event: 'welcome', payload: { id: myId, name: myName, handCount: myHand.length, discard: discardPile } });
              gameActive = true;
              isMyTurn = true;
              updateUI();
            }
          })
          .on('broadcast', { event: 'welcome' }, ({ payload }) => {
            if (payload.id !== myId) {
              oppId = payload.id;
              oppName = payload.name;
              oppHandCount = payload.handCount;
              discardPile = payload.discard;
              gameActive = true;
              isMyTurn = false;
              updateUI();
            }
          })
          .on('broadcast', { event: 'state' }, ({ payload }) => {
            if (payload.id !== myId) {
              if (payload.handCount < oppHandCount) lastAction = 'play_opp';
              else if (payload.handCount > oppHandCount) lastAction = 'draw_opp';
              oppHandCount = payload.handCount;
              discardPile = payload.discard;
              activeColor = payload.activeColor;
              if (payload.drawPenalty > 0) {
                for (let i = 0; i < payload.drawPenalty; i++) myHand.push(createRandomCard());
              }
              if (payload.turnSkip) {
                isMyTurn = false;
                gameChannel.send({
                  type: 'broadcast',
                  event: 'state',
                  payload: { id: myId, handCount: myHand.length, discard: discardPile, activeColor: activeColor, turnSkip: false, drawPenalty: 0, myTurnNext: true }
                });
              } else if (payload.myTurnNext || !payload.turnSkip) {
                isMyTurn = true;
              }
              updateUI();
            }
          })
          .on('broadcast', { event: 'leave' }, () => {
            alert("対戦相手が退出しました。");
            leaveGame();
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') gameChannel.send({ type: 'broadcast', event: 'join', payload: { id: myId, name: myName } });
          });
      }

      function sendGameState(turnSkip = false, drawPenalty = 0) {
        if (!gameChannel) return;
        gameChannel.send({
          type: 'broadcast',
          event: 'state',
          payload: { id: myId, handCount: myHand.length, discard: discardPile, activeColor: activeColor, turnSkip: turnSkip, drawPenalty: drawPenalty, myTurnNext: false }
        });
      }

      function startAIGame() {
        isSolo = true;
        oppName = "AI対戦相手";
        DOM.headerText.textContent = "We talks UNO (vs AI)";
        DOM.lobby.style.display = 'none';
        DOM.game.style.display = 'flex';
        myHand = Array.from({ length: 7 }, createRandomCard);
        oppHand = Array.from({ length: 7 }, createRandomCard);
        discardPile = [{ color: 'blue', value: '7' }];
        activeColor = 'blue';
        gameActive = true;
        isMyTurn = true;
        updateUI();
      }

      function leaveGame() {
        if (gameChannel) {
          gameChannel.send({ type: 'broadcast', event: 'leave', payload: { id: myId } });
          supabaseClient.removeChannel(gameChannel);
          gameChannel = null;
        }
        isSolo = false;
        gameActive = false;
        DOM.lobby.style.display = 'flex';
        DOM.game.style.display = 'none';
        DOM.headerText.textContent = "We talks UNO";
      }

      DOM.btnJoin.addEventListener('click', () => {
        const code = DOM.roomCode.value.trim();
        if (code) joinRoom(code);
      });
      DOM.btnAI.addEventListener('click', startAIGame);
      DOM.btnLeave.addEventListener('click', leaveGame);
      DOM.btnDraw.addEventListener('click', drawCard);
      DOM.btnEndTurn.addEventListener('click', () => {
        if (stackedValue !== null) {
          const lastCard = discardPile[discardPile.length - 1];
          endMyTurn(lastCard);
        }
      });
    })();
  </script>
</body>
</html>`;
