

const mongoose = require('mongoose');

export class WalletModel {

  PassCollection: any;
  InitialPassCollection: any;
  DeviceCollection: any;
  AppleLogsCollection: any;
  HospitalsLocationsCollection: any;
  GooglePassCollection: any;

  public constructor() {


    try
    {
      mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      const db = mongoose.connection
      db.on('Database connection error', (error: any) => console.log("Database connection error" + error))
      db.once('open', () => console.log('Connected to Database'))
  
      // PassCollection
      this.DeviceCollection = mongoose.model("Device", new mongoose.Schema({
        deviceLibraryIdentifier: {
          type: "string",
          required: true
        },
        pushToken: {
          type: "string",
          required: true
        },
        passes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pass' }]
      },
        {
          timestamps: true
        }))
  
      // Device Collection
      this.PassCollection = mongoose.model("Pass", new mongoose.Schema({
        passTypeIdentifier: {
          type: "string",
          required: true
        },
        serialNumber: {
          type: "string",
          required: true
        },
        lastUpdated: {
          type: Number,
          default: Date.now(),
          required: true
        },
        lastUpdateValues: {
          type: Object,
          required: false
        },
        devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
      },
        {
          timestamps: true
        }))
  
      // Device Collection
      this.InitialPassCollection = mongoose.model("InitialPass", new mongoose.Schema({
        passTypeIdentifier: {
          type: "string",
          required: true
        },
        serialNumber: {
          type: "string",
          required: true
        },
        lastUpdated: {
          type: Number,
          default: Date.now(),
          required: true
        },
        lastUpdateValues: {
          type: Object,
          required: false
        }
      },
        {
          timestamps: true
        }))
  
      // AppleLogsCollection
      this.AppleLogsCollection = mongoose.model("AppleLogs", new mongoose.Schema({
        logs: {
          type: Object,
          required: false
        }
      },
        {
          timestamps: true
        }))
  
      this.HospitalsLocationsCollection = mongoose.model("HospitalsLocations", new mongoose.Schema({
        locations: [{
          type: Object,
          required: false
        }]
      },
        {
          timestamps: true
        }))
  
  
      //Google Pass Collection
      this.GooglePassCollection = mongoose.model("GooglePass", new mongoose.Schema({
        serialNumber: {
          type: "string",
          required: true
        },
        lastUpdated: {
          type: Number,
          default: Date.now(),
          required: true
        },
        lastUpdateValues: {
          type: Object,
          required: false
        }
      },
        {
          timestamps: true
        }))
    }
    catch(error){
      console.log("Not connected to Database" + error);
      this.AppleLogsCollection=null;
      this.DeviceCollection=null;
      this.GooglePassCollection=null;
      this.HospitalsLocationsCollection=null;
      this.PassCollection=null;
      this.InitialPassCollection=null;
    }
  }

  public createPass = async (pass: any) => {
    let updateValues = await this.InitialPassCollection.findOne({ serialNumber: pass.serialNumber });
    pass.lastUpdateValues = updateValues._doc.lastUpdateValues;
    await this.InitialPassCollection.deleteOne({serialNumber: pass.serialNumber}).then(function () {
      console.log(`record with serialNumber: ${pass.serialNumber} successfully deleted`); // Success
    }).catch(function (error:any) {
      console.log(`record with serialNumber: ${pass.serialNumber} was not deleted. Error follows`);
      console.log(error); // Failure
    });
    try {
      let _pass = await this.PassCollection.find({ serialNumber: pass.serialNumber })
      if (_pass != null && _pass.length > 0) {
        await this.PassCollection.findByIdAndUpdate(_pass[0]._id, { "$set": {lastUpdateValues: pass.lastUpdateValues , updatedAt: pass.lastUpdated}}, { useFindAndModify: false })
        return _pass[0]._doc;
      }
    } catch (error) {
      console.log("Error in retrieving pass" + error);
    }
    // await this.InitialPassCollection.find({serialNumber: pass.serialNumber}).remove().exec(console.log(`record with serialNumber: ${pass.serialNumber} successfully deleted`));
    return this.PassCollection.create(pass).then((docPass: any) => {
      return docPass;
    })
  }

  public createDevice = async (device: any) => {
    try {
      let _device = await this.DeviceCollection.find({ deviceLibraryIdentifier: device.deviceLibraryIdentifier })
      if (_device != null && _device.length > 0) {
        return _device[0]._doc;
      }
    } catch (error) {
      console.log("Error in retrieving device" + error);
    }
    return this.DeviceCollection.create(device).then((docDevice: any) => {
      return docDevice;
    })
  }

  public addDeviceToPass = (passId: any, device: any) => {
    return this.PassCollection.findByIdAndUpdate(
      passId,
      { $push: { devices: device._id } },
      { new: true, useFindAndModify: false });
  }

  public addPassToDevice = (deviceId: any, pass: any) => {
    return this.DeviceCollection.findByIdAndUpdate(
      deviceId,
      { $push: { passes: pass._id } },
      { new: true, useFindAndModify: false });
  }

  public runCreate = async (__pass: any, __device: any) => {
    var _pass = await this.createPass(__pass);
    var _device = await this.createDevice(__device);
    var pass = await this.addDeviceToPass(_pass._id, _device);
    var device = await this.addPassToDevice(_device._id, _pass);
  }

  public runDelete = async (__pass: any, __device: any) => {
    try {
      // Check whether the pass exists in another device
      let _pass = await this.PassCollection.find({ serialNumber: __pass.serialNumber })
      let _device = await this.DeviceCollection.find({ deviceLibraryIdentifier: __device.deviceLibraryIdentifier })
      if (_pass != null && _pass.length > 0) {
        if (_pass[0].devices.length > 1) {
          await this.PassCollection.findByIdAndUpdate(_pass[0]._id, { $pull: { devices: _device[0]._id } }, { useFindAndModify: false })
        } else {
          await this.PassCollection.deleteOne({ _id: _pass[0]._id });
        }
      }
      if (_device != null && _device.length > 0) {
        if (_device[0].passes.length > 1) {
          await this.DeviceCollection.findByIdAndUpdate(_device[0]._id, { $pull: { passes: _pass[0]._id } }, { useFindAndModify: false })
        } else {
          await this.DeviceCollection.deleteOne({ _id: _device[0]._id });
        }
      }
    } catch (error) {
      console.log("Error in updating device or pass" + error);
    }
  }

  public runInitialCreate = async (__pass: any) => {
    var _pass = await this.createInitialPass(__pass);
    console.log(`created initial pass ${_pass}`);
  }

  public createInitialPass = async (pass: any) => {
    try {
      console.log(`createInitialPass: Before find in InitialPassCollection`);
      let _pass = await this.InitialPassCollection.find({ serialNumber: pass.serialNumber })
      if (_pass != null && _pass.length > 0) {
        console.log(`createInitialPass:Return doc`);
        console.log("Doc:" + JSON.stringify(_pass[0]._doc));
        return _pass[0]._doc;
      }
    } catch (error) {
      console.log("Error in retrieving pass" + error);
    }
    return this.InitialPassCollection.create(pass).then((docPass: any) => {
      console.log(`createInitialPass:InitialPassCollection create`);
      console.log("Doc:" + JSON.stringify(docPass));
      return docPass;
    })
  }

  public deleteInitialPass = async (serialNumber: any) => {

    let updateValues = await this.InitialPassCollection.findOne({ serialNumber: serialNumber });
    if(updateValues){
      await this.InitialPassCollection.deleteOne({serialNumber: serialNumber}).then(function () {
        console.log(`{sendPass} record with serialNumber: ${serialNumber} successfully deleted`); // Success
        }).catch(function (error:any) {
          console.log(`{sendPass} record with serialNumber: ${serialNumber} was not deleted. Error follows`);
          console.log(error); // Failure
        });
    }
  }
}