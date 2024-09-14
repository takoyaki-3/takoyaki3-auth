# Firebase Authentication JWT Checker

## 概要

このリポジトリは、Firebase Authenticationで発行されたJWT（JSON Web Token）を検証するためのサンプルプロジェクトです。Firebase Hostingでホストされたウェブページで、ユーザーがログインするとJWTが発行され、そのJWTをGolangのサンプルコードで検証する方法を示しています。

## 特徴

- Firebase Authenticationによるユーザー認証
- JWTの検証機能（Golang）
- Firebase Hostingへのデプロイ

## ファイルツリーとプロジェクト構成

```
├── .firebaserc  // Firebaseプロジェクトの設定ファイル
├── firebase.json // Firebase Hostingの設定ファイル
└── public        // Firebase Hostingで公開されるファイル
    ├── 404.html   // 404エラーページ
    ├── auth.js    // 認証処理を行うJavaScriptファイル
    └── index.html // メインのHTMLファイル
└── sample        // JWT検証サンプルコード（Golang）
    └── golang
        ├── check.go // JWT検証のGolangコード
        ├── go.mod   // Goモジュールファイル
        └── go.sum   // Goモジュールチェックサムファイル

```

### ファイルの説明

- `.firebaserc`: FirebaseプロジェクトのIDなどを設定するファイルです。
- `firebase.json`: Firebase Hostingの設定ファイルです。公開ディレクトリなどを指定します。
- `public/index.html`: メインのHTMLファイルです。FirebaseUIを使ってログイン画面を表示し、ログイン後にJWTを表示します。
- `public/auth.js`: 認証処理を行うJavaScriptファイルです。JWTの取得、検証、ローカルストレージへの保存などを行います。
- `public/404.html`: 404エラーページです。
- `sample/golang/check.go`: JWT検証のGolangコードです。Googleの公開鍵を使ってJWTの署名を検証します。
- `sample/golang/go.mod`: Goモジュールファイルです。
- `sample/golang/go.sum`: Goモジュールチェックサムファイルです。

## インストール方法

1. Firebase CLIをインストールします。
   ```bash
   npm install -g firebase-tools
   ```
2. Firebaseプロジェクトを作成します。
   ```bash
   firebase projects:create
   ```
3. Firebase Hostingを初期化します。
   ```bash
   firebase init hosting
   ```
4. このリポジトリをクローンします。
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   ```
5. プロジェクトディレクトリに移動します。
   ```bash
   cd YOUR_REPOSITORY
   ```

## 使い方

### Firebase Hostingへのデプロイ

1. Firebaseにログインします。
   ```bash
   firebase login
   ```
2. Firebase Hostingにデプロイします。
   ```bash
   firebase deploy
   ```

### JWTの検証（Golang）

1. `sample/golang`ディレクトリに移動します。
   ```bash
   cd sample/golang
   ```
2. `go run check.go`コマンドを実行します。
   ```bash
   go run check.go
   ```
   このとき、`check.go`ファイル内の`tokenString`変数に検証したいJWTを設定してください。

## 設定ファイル

- `.firebaserc`: Firebaseプロジェクトの設定ファイルです。
- `firebase.json`: Firebase Hostingの設定ファイルです。

## コマンド実行例

- Firebase CLIのインストール: `npm install -g firebase-tools`
- Firebaseプロジェクトの作成: `firebase projects:create`
- Firebase Hostingの初期化: `firebase init hosting`
- Firebaseへのログイン: `firebase login`
- Firebase Hostingへのデプロイ: `firebase deploy`
- JWTの検証（Golang）: `go run check.go`

