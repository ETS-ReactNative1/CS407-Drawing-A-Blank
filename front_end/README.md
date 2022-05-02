# Fresgo Front-End Setup Guide 
This guide will explain how to set up the React Native project to start development. This advice is taken from the following article: https://reactnative.dev/docs/environment-setup. I have tested this on a Windows 10 PC using a Ryzen processor. If you're using Intel, this should still work, but let me know if it does not.

## Pre-requisites
You will need to have the following programs installed:
* Node.JS (6.13.0 or greater) https://nodejs.org/en/
* Java Development Kit (Version 11 or greater)
* Android Studio (4.1.2 or greater) https://developer.android.com/studio. When installing Android Studio, you must select the following options in the setup wizard:
    - Android SDK
    - Android SDK Platform
    - Android Virtual Device

## Android Studio Setup
### SDK Manager
Once you have installed Android Studio, go to SDK manager, which is a button in the top right which looks like a cube. Here, you need to select the following:
* Android 11.0 (R)
* Android 10.0 (Q)
Once you have done this, click "Show Package Details" in the bottom right and check the following:
* Android SDK Platform 30
* Sources for Android 30
* Android SDK Platform 29
* Sources for Android 29
* Intel x86 Atom_64 System Image

Then, go to SDK tools, show package details and check the following under Android SDK Build Tools 32-rc1:
* 30.0.2
* 29.0.2
* 28.0.3

Click apply, and this will commence the installation process. Afterwards, click OK.

### Environment Variables
You will need to set the following environment variables:
* ANDROID_HOME For me this was: C:\Users\username\AppData\Local\Android\Sdk)
* Add to PATH  
    - ANDROID_HOME/emulator 
    - ANDROID_HOME/tools
    - ANDROID_HOME/tools/bin
    - ANDROID_HOME/platform-tools

### Virtual Machine Setup
In Android Studio, open the Virtual Device Manager (button also in the top right and looks like a phone). Create a virtual machine. You can use what you like, but I use Pixel_3A, API Version 30, x86.

## Running the project
This part is pretty straight forward. Firstly, run the android emulator with the virtual machine you just made. Afterwards, navigate to DrawingABlank, then run the following commands in two separate terminals:

`npx react-native start` - This starts the compilation process and launches the React Native process. This needs to stay open after running.

`npx react-native run-android` - This connects React Native to your emulator or device to run the application. This can be closed once finished.

If you have errors relating to missing dependencies, you may need to run the following command:

`npm install` - This installs all dependencies listed in package.json.

This process can take some time at first, but afterwards it should automatically load the app into the emulator. You can then use the first terminal to reload the project and also open a developer menu. The project should reload automatically each time you change a file.

Now you can start writing code. If you have any trouble with this process, do not hesitate to send me a message.

## Project Organization
This is just a basic setup at the moment which may change, but just to start, organize your code in the following way:
* API - Code for communicating with the back-end's Django API
* Assets - For storing things like images, fonts, sounds, etc. 
* Components - For storing React Components
* Containers - Store React Containers.
* Navigation - Navigational code should go here (i.e. StackNavigator).
* Styles - Put styles for different components/screens in here.