import { useEffect, useState } from 'react';
import { auth, ui, uiConfig } from './firebase';
import './App.css';
import 'firebaseui/dist/firebaseui.css';

function App() {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(''); // JWTを保存するためのステート

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // JWTを取得して設定
        user.getIdToken().then((token) => {
          setJwt(token); // JWTをステートに保存
          handleRedirect(token); // ログイン後のリダイレクト処理
        });
      } else {
        setUser(null);
        setJwt(''); // ログアウト時はJWTをリセット
      }
    });

    if (!user) {
      ui.start('#firebaseui-auth-container', uiConfig);
    }

    return () => unregisterAuthObserver();
  }, [user]);

  // リダイレクト処理
  const handleRedirect = (token) => {
    const queryParams = new URLSearchParams(window.location.search);
    const rValue = queryParams.get('r'); // 'r'パラメータを取得

    if (rValue) {
      const redirectUrl = new URL(rValue);

      // リダイレクト先のドメインが許可されているか確認
      const allowedDomains = ['takoyaki3.com', 'takoyaki-3.github.io', 'localhost', '127.0.0.1'];
      const isAllowedDomain = allowedDomains.some(domain => redirectUrl.hostname.endsWith(domain));

      if (!isAllowedDomain) {
        console.error('Invalid redirect domain', redirectUrl.hostname);
        return;
      }

      // JWTをクエリパラメータに追加
      const searchParams = redirectUrl.searchParams;
      searchParams.delete('jwt'); // 既存のJWTを削除
      searchParams.set('jwt', token); // 新しいJWTを追加

      // リダイレクトを実行
      window.location.href = redirectUrl.toString();
    }
  };

  return (
    <div className="App">
      <div className="card">
        <h2>takoyaki3-Auth</h2>
        {!user ? (
          <div>
            <h1>サインインしてください</h1>
            <p>
              You’re seeing this because you’ve successfully setup Firebase
              Hosting. Now it’s time to go build something extraordinary!
            </p>
            <div id="firebaseui-auth-container"></div>
          </div>
        ) : (
          <div>
            <p>Welcome, {user.displayName || user.email}!</p>
            <p><strong>JWT:</strong></p>
            <textarea
              value={jwt}
              readOnly
              rows="5"
              style={{ width: '100%', padding: '10px', marginBottom: '20px', fontFamily: 'monospace' }}
            />
            <button className="signout-button" onClick={() => auth.signOut()}>Sign Out</button>
          </div>
        )}
      </div>
      <footer>Firebase SDK loaded with auth, analytics</footer>
    </div>
  );
}

export default App;
