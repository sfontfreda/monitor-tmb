
# 🚌 TMB Monitor

Monitor en temps real per visualitzar les arribades de busos de TMB (Transports Metropolitans de Barcelona).

  ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Pantalla Principal](https://img.shields.io/badge/Resoluci%C3%B3-800x480-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

##  Descripció

Aplicació web dissenyada per funcionar en una Raspberry Pi amb pantalla tàctil de 7" (800x480px) que mostra en temps real les pròximes arribades de busos de fins a 3 parades diferents de TMB.

  
## Característiques

-  🚍 **Fins a 3 parades simultànies** configurables
-  🔄 **Auto-refresh cada 30 segons** sense intervenció
-  🎨 **Indicadors de color dinàmics** segons temps d'arribada:
-  🔴 Vermell: ≤ 2 minuts
-  🟠 Taronja: ≤ 5 minuts
-  🟡 Groc: ≤ 10 minuts
-  🟢 Verd: > 10 minuts
-  📱 **Optimitzat per 800x480px** (pantalla Raspberry Pi oficial)

  
## 🛠️ Tecnologies

-  **Framework**: Next.js 14 (App Router)
-  **Llenguatge**: TypeScript
-  **Estils**: Tailwind CSS
-  **API**: TMB API (v1/itransit)
-  **Runtime**: Node.js 20+

  
## 📦 Instal·lació

### Prerequisits

-  Node.js 20 o superior
-  Compte de desenvolupador TMB (https://developer.tmb.cat) per obtenir l'app id i la api key
-  Raspberry Pi 4 (recomanat) amb Raspbian/Raspberry Pi OS

  
### Passos

1.  **Clona el repositori**

```bash
git  clone  https://github.com/sfontfreda/monitor-tmb.git
cd  monitor-tmb
```

2.  **Instal·la les dependències**

```bash
npm  i
```


3.  **Configura les variables d'entorn**

Crea un fitxer `.env.local` a l'arrel del projecte:

```env
TMB_APP_ID=el_teu_app_id
TMB_APP_KEY=el_teu_app_key
```

4.  **Executa en mode desenvolupament**

```bash
npm  run  dev
```  

L'aplicació estarà disponible a `http://localhost:3000`

  
## 🚀 Desplegament en Raspberry Pi

  
⚠️ En aquest cas s’utilitza Debian Trixie; si fas servir qualsevol altre sistema operatiu, hauràs d’instal·lar paquets diferents.

### 1. Preparar Raspberry Pi

```bash
# Instal·lar Node.js
curl  -fsSL  https://deb.nodesource.com/setup_20.x  |  sudo  -E  bash  -
sudo  apt-get  install  -y  nodejs


# Clonar i configurar projecte
git clone https://github.com/sfontfreda/monitor-tmb.git
cd monitor-tmb
npm i


# Configurar variables d'entorn i afegir TMB_APP_ID i TMB_APP_KEY
nano .env.local


# Build del projecte
npm run build

```

### 3. Executar l'aplicació

  
```bash
# Opció 1: Executar manualment
npm  start

  
# Opció 2: Crear servei systemd (recomanat)
sudo  nano  /etc/systemd/system/tmb-monitor.service

```

Contingut del servei:

⚠️ Assegura’t de posar l’usuari, el directori de treball i la versió de Node que tens a la teva Raspberry.
```ini
[Unit]
Description=Monitor TMB
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/monitor-tmb
ExecStart=/home/pi/.nvm/versions/node/v20.11.1/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PATH=/home/pi/.nvm/versions/node/v20.11.1/bin:/usr/bin:/bin

[Install]
WantedBy=multi-user.target
```

Activar el servei:


⚠️ El mode kiosk fa que el teclat no estigui disponible. Assegura’t de tenir connectat un teclat amb cable o USB (o que els controladors Bluetooth estiguin correctament instal·lats si utilitzes un teclat sense fils) abans d’activar que aquest servei s’iniciï automàticament en engegar la Raspberry Pi.

```bash
sudo  systemctl  enable  tmb-monitor
sudo  systemctl  start  tmb-monitor
```

### 4. Configurar Chromium en mode kiosk

Crear script d'inici automàtic:

```bash
nano  ~/.config/autostart/tmb-monitor.desktop
```

Contingut:

```ini
[Desktop Entry]
Type=Application
Name=TMB Monitor Kiosk
Exec=chromium --kiosk --disable-infobars http://localhost:3000

```


## 🔧 Configuració

### Obtenir codis de parada

Els codis de parada es troben a les marquesines físiques de TMB. Són números de 3-4 dígits.
**Exemple**: La parada *Casp - Pau Claris* té el codi `3805`

## 📱 Ús

1.  **Primera execució**: Es mostrarà el menú de configuració
2.  **Afegir parades**: Introdueix fins a 3 codis de parada
3.  **Guardar**: El nom de la parada es valida automàticament
4.  **Visualització**: La pantalla mostra els 4 pròxims busos
5.  **Configurar**: Prem qualsevol part de la parada per entrar al menú de nou
  

## 🎨 Estructura del projecte


```bash
monitor-tmb/
├── app/
│ ├── api/
│ │ └── tmb/
│ │ └── bus/
│ │ └── route.ts        # API proxy per TMB
│ ├── globals.css       # Estils
│ ├── layout.tsx        # Layout global
│ └── page.tsx          # Pàgina principal
├── components/
│ ├── BusStopsList.tsx  # Llista de parades
│ ├── Clock.tsx         # Rellotge
│ ├── ConfigMenu.tsx    # Menú de configuració
│ ├── IncomingBus.tsx   # Component bus individual
│ └── ResultsPage.tsx   # Pantalla principal
├── lib/
│ ├── api.ts            # Lògica API
│ ├── routeColors.ts    # Mapping de colors perlínea
│ └── types.ts          # Tipus TypeScript
└── .env.local          # Variables d'entorn
```
  

## 🖥️ Hardware recomanat


-  **Raspberry Pi 4** (4GB RAM)
-  **Pantalla oficial Raspberry Pi 7"** (800x480px, tàctil)
-  **Targeta microSD** 32GB (Classe 10)
  
    ### Hardware addicional necessari
    -  Font d’alimentació USB-C (5 V)
    -  Teclat amb cable (o sense fil + controladors Bluetooth instal·lats)
  
## 📄 Llicència

  
MIT License - Lliure per ús personal i comercial


## 👤 Autor
  

**Sílvia Fontfreda**

-  GitHub: [@sfontfreda](https://github.com/sfontfreda)

  

## 🔗 Enllaços útils
  

-  [API TMB](https://developer.tmb.cat)
-  [Next.js Documentation](https://nextjs.org/docs)
-  [Raspberry Pi](https://www.raspberrypi.org)
-  [Tailwind CSS](https://tailwindcss.com)


---

  
**Fet amb 🤍 a Barcelona**