# Spec

## 目的

- アプリや環境毎のパラメータの管理
- パラメータの型とデフォルトパラメータの管理

## 実現方法

- パラメータは SSM で管理
- アプリと環境は SSM のパスで表現

パラメータの方は TypeScript で書く？

## Path

```txt
/CDK/APP/EC/ENV/PROD/OUTPUT
/{BASE_PATH}/APP/{appName}/ENV/{envName}/{parameterName}
```
