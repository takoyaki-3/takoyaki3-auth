package main

import (
	"fmt"
	"log"
	"crypto/rsa"
	"crypto/x509"
	"github.com/dgrijalva/jwt-go"
	"encoding/pem"
	"time"
	"io/ioutil"
	"net/http"
	"encoding/json"
	"encoding/base64"
	"strings"
	"errors"
)

type CustomClaims struct {
	Name     string `json:"name"`
	Picture  string `json:"picture"`
	Iss      string `json:"iss"`
	Aud      string `json:"aud"`
	AuthTime int64  `json:"auth_time"`
	UserId   string `json:"user_id"`
	Sub      string `json:"sub"`
	Iat      int64  `json:"iat"`
	Exp      int64  `json:"exp"`
	Email    string `json:"email"`
	jwt.StandardClaims
}

func main() {
	// exsample
	tokenString := "eyJhbGciOiJSUzI1NiIsImtpZCI6ImY5N2U3ZWVlY2YwMWM4MDhiZjRhYjkzOTczNDBiZmIyOTgyZTg0NzUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi576955Sw6YeO5rmn5aSqIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGMtZ2lsdGhFTWpsZEdneXFXUEJYbXV5NEJRZ25FWW1zQjRRRnN4Wlg4OFhsaz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS90YWtveWFraTMtYXV0aCIsImF1ZCI6InRha295YWtpMy1hdXRoIiwiYXV0aF90aW1lIjoxNjg4NjQ5NzM1LCJ1c2VyX2lkIjoicU9leEJ4T05LVVkxTVFiMUx1TkdObWdUazBsMSIsInN1YiI6InFPZXhCeE9OS1VZMU1RYjFMdU5HTm1nVGswbDEiLCJpYXQiOjE2ODg2NTMyMzEsImV4cCI6MTY4ODY1NjgzMSwiZW1haWwiOiJoYXRhbm8ueXV1dGFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDAxOTczNDczNDA2NTMwNTUzNzgiXSwiZW1haWwiOlsiaGF0YW5vLnl1dXRhQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.n17kmLvtsKpIgYkFUtyqA11qjEciaz6tyUYINR4G8ssxAtRYIxWbaLd0gX8Sx-qkXdsIo32jBaYOEEQnkHRl67agLeGvFHKaO0P9xeoMzZMz89LPy7CqeVdnPR55oppnPanPRUMDK5Tz4LFqsjLcfA18Cx6k3vwp3y1vZ2m7J3QzYLabGHUaeyeXODhOAFUoLeBkSQOBGAkx4nn8gF304B3Mldq94kVndHkNiNDRxmpIHT7bvGCClXfTbqkR05KlrOqDCKImNL2hh6LRxFyLfpFB-NSf3zggnRxQ9n0fbN2wB70ZY_Vfe5qCmuMoXiDFmSdPP9_2Y2sAY440Eb56Vw" // Your JWT here
	CustomClaims,err := checkFirebaseJWT(tokenString)
	fmt.Println(CustomClaims,err)
}

// JWTを検証する関数
func checkFirebaseJWT(tokenString string)(CustomClaims,error){

	// Googleの公開鍵を取得
	resp, err := http.Get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com")
	if err != nil {
		log.Fatalf("Failed to make a request: %v", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Failed to read the response body: %v", err)
	}

	var result map[string]interface{}
	err = json.Unmarshal([]byte(body), &result)

	if err != nil {
		log.Fatalf("Failed to json unmarshal: %v", err)
	}

	// JWTのヘッダを解析し署名に用いられている鍵を取得
	parts := strings.Split(tokenString, ".")

	// decode the header
	headerJson, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		log.Fatalf("Error decoding JWT header:", err)
		return CustomClaims{},err
	}

	var header map[string]interface{}
	err = json.Unmarshal(headerJson, &header)
	if err != nil {
		log.Fatalf("Error unmarshalling JWT header:", err)
		return CustomClaims{},err
	}

	kid := header["kid"].(string)
	certString := result[kid].(string)
	block, _ := pem.Decode([]byte(certString))
	if block == nil {
		log.Fatalf("failed to parse PEM block containing the public key")
		return CustomClaims{},err
	}

	cert, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		log.Fatalf("failed to parse certificate: ", err)
		return CustomClaims{},err
	}

	rsaPublicKey := cert.PublicKey.(*rsa.PublicKey)

	// 署名を検証
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return rsaPublicKey, nil
	})

	if err != nil {
		log.Fatalf("Error while parsing token: %v\n", err)
		return CustomClaims{},err
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		if time.Unix(claims.Exp, 0).Before(time.Now()) {
			return CustomClaims{},errors.New("Token is valid. But token is expired.")
		} else {
			return *claims, nil
		}
	} else {
		return CustomClaims{},errors.New("Token is not valid")
	}
}