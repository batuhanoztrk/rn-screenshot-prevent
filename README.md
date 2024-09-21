# rn-screenshot-prevent

### This fork contains fully working blank screenshot on IOS13+ including screen recording
### This fork contains fully working image screenshot cover on IOS13+ including screen recording
### App layout is white / or black in dark theme

#### For now, you might disable RNPreventScreenshot.enableSecureView() in development mode (check __DEV__ variable)
#### because disableSecureView() is not working yet correctly


## Getting started

Install the library using either Yarn:

```
yarn add rn-screenshot-prevent
```

or npm:

```
npm install --save rn-screenshot-prevent
```

## Link

### React Native v0.60+

For iOS, use `cocoapods` to link the package.

run the following command:

```
$ npx pod-install
```

For android, the package will be linked automatically on build.

<details>
  <summary>For React Native version 0.59 or older</summary>

### React Native <= 0.59

run the following command to link the package:

```
$ react-native link rn-screenshot-prevent
```

For iOS, make sure you install the pod file.

```
cd ios && pod install && cd ..
```

or you could follow the instructions to [manually link the project](https://reactnative.dev/docs/linking-libraries-ios#manual-linking)

## Upgrading to React Native 0.60+

New React Native comes with `autolinking` feature, which automatically links Native Modules in your project. In order to get it to work, make sure you unlink `rn-screenshot-prevent` first:

```
$ react-native unlink rn-screenshot-prevent
```

</details>


## Usage
```javascript

// sample code

import RNScreenshotPrevent from 'rn-screenshot-prevent';

/* (IOS, Android) for android might be the only step to get secureView
 * on IOS enables blurry view when app goes into inactive state
 */
RNScreenshotPrevent.enabled(true/false);

/* (IOS) enableSecureView for IOS13+
 * creates a hidden secureTextField which prevents Application UI capture on screenshots
 */
if(!__DEV__) RNScreenshotPrevent.enableSecureView();

/* (IOS) enableSecureView for IOS13+
 * creates a hidden secureTextField which prevents Application UI capture on screenshots
 * and uses imgUri as the source of the background image (can be both https://, file:///)
 */
if(!__DEV__) RNPreventScreenshot.enableSecureView(imgUri);

/* (IOS) disableSecureView for IOS13+
 * remove a hidden secureTextField which prevents Application UI capture on screenshots
 */
if(!__DEV__) RNScreenshotPrevent.disableSecureView();

/* (IOS) notification handler
 * notifies when user has taken screenshot (yes, after taking) - you can show alert or do some actions
 *
 * @param {function} callback fn
 * @returns object with .remove() method
 */
addListener(fn);

/** example using the listener */
useEffect(() => {
	const subscription = RNScreenshotPrevent.addListener(() => {
		console.log('Screenshot taken');
		showAlert({
			title: 'Warning',
			message: 'You have taken a screenshot of the app. This is prohibited due to security reasons.',
			confirmText: 'I understand'
		});
	})

	return () => {
		subscription.remove();
	}
}, []);

```


[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/batuhanoztrk)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
