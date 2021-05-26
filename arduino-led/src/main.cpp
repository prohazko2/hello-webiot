#include <Arduino.h>
#include <WebUSB.h>

WebUSB WebUSBSerial(1 /* https:// */, "webusb.github.io/arduino/demos/console");

#define Serial WebUSBSerial

const int ledPin = 13;

void setup()
{
    while (!Serial)
    {
        ;
    }
    Serial.begin(9600);
    Serial.write("init");
    Serial.flush();

    pinMode(ledPin, OUTPUT);
}

void loop()
{
    if (Serial && Serial.available())
    {
        int byte = Serial.read();
        byte = max(byte, 0);
        byte = min(byte, 255);

        Serial.write("got: ");
        Serial.write(String(byte).c_str());

        analogWrite(ledPin, byte);

        Serial.write("\r\n");
        Serial.flush();
    }
}