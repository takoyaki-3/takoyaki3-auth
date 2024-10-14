# Firebase Authentication JWT Checker

## 概要

このリポジトリは、Firebase Authenticationで発行されたJWT（JSON Web Token）を検証するためのサンプルプロジェクトです。Firebase Hostingでホストされたウェブページで、ユーザーがログインするとJWTが発行され、そのJWTをGolangのサンプルコードで検証する方法を示しています。

## 特徴

- Firebase Authenticationによるユーザー認証
- JWTの検証機能（Golang）
- Firebase Hostingへのデプロイ
- JWTの取得、検証、ローカルストレージへの保存
- ログイン状態の管理 (サインイン/サインアウト)
- 許可されたドメインへのリダイレクト機能

## ファイルツリーとプロジェクト構成

```
├── .firebaserc  // Firebaseプロジェクトの設定ファイル
├── firebase.json // Firebase Hostingの設定ファイル
├── public        // Firebase Hostingで公開されるファイル
│   ├── 404.html   // 404エラーページ
│   ├── auth.js    // 認証処理を行うJavaScriptファイル
│   └── index.html // メインのHTMLファイル
└── sample        // JWT検証サンプルコード（Golang）
    └── golang
        ├── check.go // JWT検証のGolangコード
        ├── go.mod   // Goモジュールファイル
        └── go.sum   // Goモジュールチェックサムファイル
```

### ファイルの説明

- **`.firebaserc`**: FirebaseプロジェクトのIDなどを設定するファイルです。（バイナリファイル）
- **`firebase.json`**: Firebase Hostingの設定ファイルです。公開ディレクトリなどを指定します。
- **`public/index.html`**: メインのHTMLファイルです。FirebaseUIを使ってログイン画面を表示し、ログイン後にJWTを表示します。Vue.jsを使用してフロントエンドの表示を管理しています。
- **`public/auth.js`**: 認証処理を行うJavaScriptファイルです。JWTの取得、検証、ローカルストレージへの保存、ログイン状態の管理、サインアウト処理などを実装しています。
- **`public/404.html`**: 404エラーページです。
- **`sample/golang/check.go`**: JWT検証のGolangコードです。Googleの公開鍵を使ってJWTの署名を検証します。
- **`sample/golang/go.mod`**: Goモジュールファイルです。（バイナリファイル）
- **`sample/golang/go.sum`**: Goモジュールチェックサムファイルです。（バイナリファイル）


## インストール方法

1. **Firebase CLIのインストール**:
   ```bash
   npm install -g firebase-tools
   ```
2. **Firebaseプロジェクトの作成**:
   ```bash
   firebase projects:create
   ```
3. **Firebase Hostingの初期化**:
   ```bash
   firebase init hosting
   ```
4. **リポジトリのクローン**:
   ```bash
   git clone https://github.com/takoyaki-3/takoyaki3-auth.git
   ```
5. **プロジェクトディレクトリへの移動**:
   ```bash
   cd takoyaki3-auth
   ```


## 使い方

### Firebase Hostingへのデプロイ

1. **Firebaseへのログイン**:
   ```bash
   firebase login
   ```
2. **Firebase Hostingへのデプロイ**:
   ```bash
   firebase deploy
   ```

### JWTの検証（Golang）

1. **`sample/golang`ディレクトリへの移動**:
   ```bash
   cd sample/golang
   ```
2. **`go run check.go`コマンドの実行**:
   ```bash
   go run check.go
   ```
   このとき、`check.go`ファイル内の`tokenString`変数に検証したいJWTを設定してください。


## 設定ファイル

### `.firebaserc`

Firebaseプロジェクトの設定ファイルです。プロジェクトIDなどの情報が格納されています。

### `firebase.json`

Firebase Hostingの設定ファイルです。以下に、設定例を示します。

```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

**公開ディレクトリ**: `public` ディレクトリを指定しています。
**無視するファイル**: `firebase.json`, 隠しファイル、`node_modules` ディレクトリを無視するように設定しています。

## 環境変数

このプロジェクトでは、Firebaseプロジェクトの設定情報を環境変数に設定する必要はありません。Firebase CLIと`firebase.json`ファイルを使用して、FirebaseプロジェクトとHostingの設定を管理します。

## APIエンドポイント

- **Googleの公開鍵取得エンドポイント**: `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`
  - Golangのサンプルコードで、Firebase Authenticationで発行されたJWTの署名を検証するために使用されます。

## コマンド実行例

- **Firebase CLIのインストール**: `npm install -g firebase-tools`
- **Firebaseプロジェクトの作成**: `firebase projects:create`
- **Firebase Hostingの初期化**: `firebase init hosting`
- **Firebaseへのログイン**: `firebase login`
- **Firebase Hostingへのデプロイ**: `firebase deploy`
- **JWTの検証（Golang）**: `go run check.go`


**備考**

- Firebase Authenticationで発行されたJWTは、`authIdToken`という名前のHttpOnly Cookieに保存されます。
- `public/index.html`のVue.jsコードでは、JWTを取得して表示したり、サインアウト処理を実行したりする機能が実装されています。
- ログイン時に、リダイレクト先のURLにJWTを含めることができます。

