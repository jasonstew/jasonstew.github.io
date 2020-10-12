(function() {
  'use strict';

  class HeartRateSensor {
    constructor() {
      this.device = null;
      this.server = null;
      this._characteristics = new Map();
      this.options =[];
    }
    connect() {
      return navigator.bluetooth.requestDevice({filters:[{services:[ '4677062c-ad02-4034-9abf-98581772427c' ]}]})
      .then(device => {
        this.device = device;
        return device.gatt.connect();
      })
      .then(server => {
        this.server = server;
        return Promise.all([
          server.getPrimaryService('4677062c-ad02-4034-9abf-98581772427c').then(service => {
      //      return Promise.all([
      //        this._cacheCharacteristic(service, 'dc13b36a-3499-46b0-ac11-5ac0173c4cc5'),
      //        this._cacheCharacteristic(service, 'b4250402-fb4b-4746-b2b0-93f0e61122c6'),
      //      ])
            return service.getCharacteristics()
            .then(characteristics => {


            this.options=  characteristics;
            })
          //  .then( () =>statusText.textContent = 'Select Sensor');
          })
        ]);
      })
    }

    /* Heart Rate Service */

    // getBodySensorLocation() {
    //   return this._readCharacteristicValue('dc13b36a-3499-46b0-ac11-5ac0173c4cc5')
    //   .then(data => {
    //     let sensorLocation = data.getUint8(0);
    //     switch (sensorLocation) {
    //       case 0: return 'Other';
    //       case 1: return 'Chest';
    //       case 2: return 'Wrist';
    //       case 3: return 'Finger';
    //       case 4: return 'Hand';
    //       case 5: return 'Ear Lobe';
    //       case 6: return 'Foot';
    //       default: return 'Unknown';
    //     }
    //  });
    // }
    startNotificationsHeartRateMeasurement() {

    //  return this._startNotifications(heartRateSensor.options[index].uuid);

        return this.options[0].startNotifications();
    }
    stopNotificationsHeartRateMeasurement(index) {
    //  return this._stopNotifications(heartRateSensor.options[index].uuid);
        return this.options[0].stopNotifications();
    }
    parseHeartRate(value) {
      // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
      value = value.buffer ? value : new DataView(value);


      let result = {};


      result.config = value.getUint16(0,true);
      result.config= result.config.toString(2);
      result.SensorVal=[];
      // if (rate16Bits) {
      var  i;
      for (i=1; i<= result.config.length; i++)
      {

      result.SensorVal[12-i] = value.getUint16(2*i,true)/100;

      }

      //   index += 2;
      // } else {
      //   result.heartRate = value.getUint8(index);
      //   index += 1;
      // }
      // let contactDetected = flags & 0x2;
      // let contactSensorPresent = flags & 0x4;
      // if (contactSensorPresent) {
      //   result.contactDetected = !!contactDetected;
      // }
      // let energyPresent = flags & 0x8;
      // if (energyPresent) {
      //   result.energyExpended = value.getUint16(index, /*littleEndian=*/true);
      //   index += 2;
      // }
      // let rrIntervalPresent = flags & 0x10;
      // if (rrIntervalPresent) {
      //   let rrIntervals = [];
      //   for (; index + 1 < value.byteLength; index += 2) {
      //     rrIntervals.push(value.getUint16(index, /*littleEndian=*/true));
      //   }
      //   result.rrIntervals = rrIntervals;
      // }
      return result;
    }

    /* Utils */

    _cacheCharacteristic(service, characteristicUuid) {
      return service.getCharacteristic(characteristicUuid)
      .then(characteristic => {
        this._characteristics.set(characteristicUuid, characteristic);
      });
    }
    _readCharacteristicValue(characteristicUuid) {
      let characteristic = this._characteristics.get(characteristicUuid);
      return characteristic.readValue()
      .then(value => {
        // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
        value = value.buffer ? value : new DataView(value);
        return value;
      });
    }
    _writeCharacteristicValue(characteristicUuid, value) {
      let characteristic = this._characteristics.get(characteristicUuid);
      return characteristic.writeValue(value);
    }
    _startNotifications(characteristicUuid) {
      let characteristic = this._characteristics.get(characteristicUuid);
      // Returns characteristic to set up characteristicvaluechanged event
      // handlers in the resolved promise.
      return characteristic.startNotifications()
      .then(() => characteristic);
    }
    _stopNotifications(characteristicUuid) {
      let characteristic = this._characteristics.get(characteristicUuid);
      // Returns characteristic to remove characteristicvaluechanged event
      // handlers in the resolved promise.
      return characteristic.stopNotifications()
      .then(() => characteristic);
    }
    getFloatValue(value) {
      var offset=0;
    // if the last byte is a negative value (MSB is 1), the final
    // float should be too
    const negative = value.getInt8(offset + 2) >>> 31;

    // this is how the bytes are arranged in the byte array/DataView
    // buffer
    const [b0, b1, b2, exponent] = [
        // get first three bytes as unsigned since we only care
        // about the last 8 bits of 32-bit js number returned by
        // getUint8().
        // Should be the same as: getInt8(offset) & -1 >>> 24
        value.getUint8(offset),
        value.getUint8(offset + 1),
        value.getUint8(offset + 2),

        // get the last byte, which is the exponent, as a signed int
        // since it's already correct
        value.getInt8(offset + 3)
    ];

    let mantissa = b0 | (b1 << 8) | (b2 << 16);
    if (negative) {
        // need to set the most significant 8 bits to 1's since a js
        // number is 32 bits but our mantissa is only 24.
        mantissa |= 255 << 24;
    }

    return mantissa * Math.pow(10, exponent);
}
  }

  window.heartRateSensor = new HeartRateSensor();

})();
