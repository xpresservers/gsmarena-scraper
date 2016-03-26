# INSTALLATION
1. Clone this repository using command `git clone https://github.com/natanelia/gsmarena-scraper.git`
2. Run `npm install`
3. Run `npm run prod`, or `npm start` (using node-dev)
4. Open web browser and navigate to http://localhost:5555/files?pageLimit=1&verbose=1

This app has been created with Node v0.10.32.
Please kindly report if it doesn't work as expected.

# RESULT
```#!json
{
  "name": "BLU Life Mark",
  "description": "BLU Life Mark Android smartphone. Announced 2016, March. Features 3G, 5.0″ IPS LCD capacitive touchscreen, 13 MP camera, Wi-Fi, GPS, Bluetooth.",
  "url": "http://www.gsmarena.com/blu_life_mark-7990.php",
  "imageUrl": "http://cdn2.gsmarena.com/vv/bigpic/blu-life-mark.jpg",
  "Network": {
    "Technology": "GSM / HSPA / LTE",
    "2G bands": "GSM 850 / 900 / 1800 / 1900 - SIM 1 & SIM 2",
    "3G bands": "HSDPA 900 / 2100",
    "4G bands": "LTE band 3(1800), 7(2600), 20(800), 38(2600), 40(2300) - L0030EE",
    "Speed": "HSPA 42.2/11.5 Mbps, LTE Cat4 150/50 Mbps",
    "GPRS": "Yes",
    "EDGE": "Yes"
  },
  "Launch": {
    "Announced": "2016, March",
    "Status": "Available. Released 2016, March"
  },
  "Body": {
    "Dimensions": "142.4 x 72 x 9.5 mm (5.61 x 2.83 x 0.37 in)",
    "Weight": "150 g (5.29 oz)",
    "SIM": "Dual SIM (Micro-SIM, dual stand-by)"
  },
  "Display": {
    "Type": "IPS LCD capacitive touchscreen, 16M colors",
    "Size": "5.0 inches (~67.2% screen-to-body ratio)",
    "Resolution": "720 x 1280 pixels (~294 ppi pixel density)",
    "Multitouch": "Yes"
  },
  "Platform": {
    "OS": "Android OS, v5.1 (Lollipop)",
    "Chipset": "Mediatek MT6735",
    "CPU": "Quad-core 1.3 GHz Cortex-A53",
    "GPU": "Mali-T720"
  },
  "Memory": {
    "Card slot": "microSD, up to 64 GB",
    "Internal": "16 GB, 2 GB RAM"
  },
  "Camera": {
    "Primary": "13 MP, f/2.0, autofocus, LED flash",
    "Features": "1/3\" sensor size, geo-tagging, touch focus, face/smile detection, panorama, HDR",
    "Video": "1080p@30fps",
    "Secondary": "5 MP"
  },
  "Sound": {
    "Alert types": "Vibration; MP3, WAV ringtones",
    "Loudspeaker ": "Yes",
    "3.5mm jack ": "Yes"
  },
  "Comms": {
    "WLAN": "Yes",
    "Bluetooth": "v4.0",
    "GPS": "Yes, with A-GPS",
    "Radio": "FM radio",
    "USB": "microUSB v2.0"
  },
  "Features": {
    "Sensors": "Fingerprint, accelerometer, proximity, compass",
    "Messaging": "SMS(threaded view), MMS, Email, Push Email, IM",
    "Browser": "HTML5",
    "Java": "No",
    "Others": [
      "MP4/H.264 player",
      "MP3/eAAC+/WAV/Flac player",
      "Document viewer",
      "Photo/video editor"
    ]
  },
  "Battery": {
    "Others": "Removable Li-Po 2300 mAh battery",
    "Stand-by": "Up to 715 h (2G) / Up to 615 h (3G)",
    "Talk time": "Up to 25 h (2G) / Up to 15 h (3G)"
  },
  "Misc": {
    "Colors": "Gold, Grey, White"
  }
}
```
