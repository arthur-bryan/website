---
title: "Web-OPI: controlling Orange Pi GPIOs from anywhere"
date: 2024-12-13T12:00:00
description: "A Flask-based web server to control Orange Pi GPIO pins remotely, built to learn web development with Python while combining programming, automation, and IoT."
tags: ["python", "flask", "iot", "automation", "linux"]
draft: false
---

Web-OPI is a mini web server i built to control Orange Pi GPIO pins from anywhere. The motivation was to learn the basics of Flask and web development with Python, while combining three areas i enjoy: programming, automation, and IoT.

## What is Web-OPI

Web-OPI is a Flask web application that:
- Provides a web interface to toggle GPIO pins on/off
- Displays the current Orange Pi CPU temperature
- Plays audio feedback when toggling pins
- Works from any device on the network (phone, computer, tablet)

## Features

- Control lamps, fans, relays, and more through GPIO
- See the current Orange Pi temperature
- Access from your phone or computer
- Audio feedback using text-to-speech

![Web-OPI Control Panel](https://user-images.githubusercontent.com/34891953/108835746-ab156f00-75ae-11eb-81b5-1a21d196d0c8.png)

## Architecture

```
[Browser (Phone/Computer)]
         |
    HTTP Request (Port 8080)
         |
[Flask Web Server (Orange Pi)]
         |
    OPi.GPIO Library
         |
    [Physical GPIO Pins]
         |
    [Relays/Lamps/Devices]
```

The server runs on the Orange Pi itself, controlling the GPIO pins directly through the OPi.GPIO library.

## The Flask server

The main server is simple - just a few routes. From `start-web-opi.py`:

```python
from flask import Flask, render_template
import OPi.GPIO as GPIO
import os
import threading

app = Flask(__name__)

DEFAULT_LISTEN_ADDR = '0.0.0.0'
DEFAULT_LISTEN_PORT = 8080

# SETUP THE Orange PI PC GPIO's
GPIO.setboard(GPIO.PC2)
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

GPIOs = {
    7: {'nome': 'GPIO 7', 'status': GPIO.LOW},
    11: {'nome': 'GPIO 11', 'status': GPIO.LOW},
    13: {'nome': 'GPIO 13', 'status': GPIO.LOW},
    15: {'nome': 'GPIO 15', 'status': GPIO.LOW},
    22: {'nome': 'GPIO 22', 'status': GPIO.LOW}
}

for pin in GPIOs:
    GPIO.setup(pin, GPIO.OUT)  # set the pins to output mode
```

The GPIO configuration uses a dictionary to track each pin's status. The pins are set to output mode on startup.

## Routes

The main route renders the control panel:

```python
@app.route("/")
def control_panel():
    """Route that render the main template with current GPIOs status."""
    for GPIO_number in GPIOs:
        GPIOs[GPIO_number]['status'] = GPIO.input(GPIO_number)
    data_for_template = {
        'pins': GPIOs,
        'temp': temp
    }
    return render_template('panel.html', **data_for_template)
```

The action route handles toggling pins:

```python
@app.route("/<pin_number>/<status>")
def send_action(pin_number, status):
    """Route that render the updated GPIO's status after an taken action
        On button press, two threads starts: one for speaking the action, other
        for changing the GPIO status.
    """
    f1 = threading.Thread(target=speak, args=[int(pin_number), status])
    f2 = threading.Thread(target=change_gpio, args=[int(pin_number), status])
    f1.start()
    f2.start()
    for GPIO_number in GPIOs:
        GPIOs[GPIO_number]['status'] = GPIO.input(GPIO_number)
    data_for_template = {
        'pins': GPIOs,
        'temp': temp
    }
    return render_template('panel.html', **data_for_template)
```

The URL pattern `/<pin>/<status>` makes it easy to control - just navigate to `/7/on` to turn on GPIO 7, or `/7/off` to turn it off.

## GPIO control

The actual GPIO manipulation is straightforward:

```python
def change_gpio(gpio_num, value):
    """Changes the current value of the GPIO.

        Args:
            gpio_num (int): the GPIO number to be controlled
            value (str):    'on' to power on the pin, 'off' to power off
    """
    if gpio_num in list(GPIOs.keys()):
        status = {'on': True, 'off': False}.get(value)
        GPIO.output(gpio_num, status)
```

## Temperature reading

The Orange Pi CPU temperature is read from the Linux thermal zone:

```python
temp = float(open('/sys/class/thermal/thermal_zone0/temp').read())
temp = "{0:0.1f} °C".format(temp / 1000)
```

This is a standard Linux interface - the temperature is stored in millidegrees, so we divide by 1000 to get Celsius.

## Audio feedback

One fun feature is audio feedback. When you toggle a pin, the Orange Pi speaks the action:

```python
def speak(pin_number, status):
    """Uses the mpg123 program to play an audio based on the taken action"""
    os.system("mpg123 " + os.path.abspath("static/audio/{}-{}.mp3".format(pin_number, status)))
```

The audio files are pre-generated using Google Text-to-Speech. There's a helper script `create_audio.py`:

```python
from gtts import gTTS

DEFAULT_LANG = 'en-us'

def str_to_mp3():
    """Convert a string to a .mp3 file."""
    phrase = input(">> Type the word or phrase do you want to convert: ")
    filename = input(">> Type the output (mp3) filename: ")
    try:
        tts = gTTS(phrase, lang=DEFAULT_LANG)
    except ValueError as error:
        print(f"Error: {error}.")
    else:
        if '.mp3' not in filename:
            filename = filename + '.mp3'
        tts.save(filename.replace('.mp3', '') + '.mp3')
        print(f"[ + ] {filename} MP3 file saved successfully!")
```

## The web interface

The frontend uses Bootstrap for a responsive design. The template uses Jinja2 conditionals to show the correct button state:

```html
{% if pins[7].status == true %}
    <a href="/7/off" class="btn btn-block btn-lg btn-danger">
        <i class="fas fa-toggle-on"></i> Turn off GPIO 7
    </a>
{% else %}
    <a href="/7/on" class="btn btn-block btn-lg btn-success">
        <i class="fas fa-toggle-off"></i> Turn on GPIO 7
    </a>
{% endif %}
```

Green buttons for "Turn on", red buttons for "Turn off" - simple and intuitive.

## Requirements

- Orange Pi PC (not tested with other versions)
- Something connected to GPIOs (relays, LEDs, etc.)
- Python 3.6+
- OPi.GPIO library
- mpg123 for audio playback

## Running it

```bash
# Clone the repo
git clone https://github.com/arthur-bryan/web-opi
cd web-opi

# Run setup (installs dependencies)
chmod +x setup.sh
sudo ./setup.sh

# Start the server
sudo python3 start-web-opi.py
```

The server listens on `0.0.0.0:8080` by default. Access it from any device on your network at `http://<orange-pi-ip>:8080`.

## What i learned

Building Web-OPI taught me:

1. **Flask basics** - Routes, templates, static files
2. **Jinja2 templating** - Conditionals, variable interpolation
3. **GPIO programming** - Controlling hardware from Python
4. **Linux interfaces** - Reading system information from `/sys`
5. **Threading** - Running audio playback without blocking the response

## Video demo

[Watch on YouTube](https://www.youtube.com/watch?v=T7odtEwHvsE)

## Resources

- [GitHub Repository](https://github.com/arthur-bryan/web-opi)
- [OPi.GPIO Documentation](https://opi-gpio.readthedocs.io/en/latest/)
- [Flask Documentation](https://flask.palletsprojects.com/)
