# 📘 Node + TypeScript Starter

Este proyecto es una guía rápida para configurar y ejecutar un entorno de desarrollo con **Node.js** y **TypeScript**.  

---

## 🔹 1. Instalar Node.js con NVM
Primero instala [NVM](https://github.com/nvm-sh/nvm) para gestionar versiones de Node.js:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

## Carga NVM en tu shell:
```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

## Instala la última versión LTS de Node.js:
```
nvm install --lts
```

## Verifica la instalacion
```
node -v
npm -v
```

## 🔹 2. Inicializar proyecto Node.js

Crea una carpeta para tu proyecto e inicialízalo con npm:
```
mkdir mi-proyecto
cd mi-proyecto
npm init -y
```

## 🔹 3. Instalar dependencias

Instala TypeScript, ts-node y ts-node-dev (para desarrollo con autoreload):
```
npm install --save-dev typescript ts-node ts-node-dev @types/node
```
## 🔹 4. Configurar TypeScript

Crea el archivo tsconfig.json:
```
npx tsc --init
```

Ejemplo recomendado de configuración (tsconfig.json):
```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```
## 🔹 5. Crear estructura de proyecto

Crea la carpeta de código fuente:
```
mkdir src
```

Agrega un archivo src/index.ts:
```
console.log("¡Hola desde TypeScript + Node.js 🚀!");
```

## 🔹 6. Configurar scripts en package.json

Agrega lo siguiente en la sección "scripts":
```
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```
## 🔹 7. Ejecutar el proyecto
Desarrollo (con autoreload)
```
npm run dev
```
Compilar a JavaScript
```
npm run build
```
Producción (ejecutar lo compilado)
```
npm start
```
