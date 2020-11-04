### Build Your Own Isoline Routing Tool

The purpose of this project is to be a "seed project" for people who want to build their own Isoline 
routing web application using HERE's [Isoline routing](https://developer.here.com/documentation/isoline-routing-api/dev_guide/index.html) product. The code and assets here are *not* meant to be used alone, but rather to help you get 
started building your own project, hopefully with minimal work.

You can see a simple demo of this in action in the [demo](./demo) subdirectory. You can view the online version here: <https://cfjedimaster.github.io/heredemos/apps/buildyourownisoline/demo/>

## So how does this work?

The application consists of two pieces of UI. The first is a left-side panel where you have text that describes your data and provides controls for showing isolines. These controls only show up after the data is loaded. The main part of application is the map itself. The map is interactive in terms of pinch to zoom and touch to pan, but doesn't provide any other interactivity. A good change would be to add touch events to the markers to display information about what they represent. 

The application consists of the following files:

* app.css - The styling which lays out how the left panel is displayed as well as other aspects. 
* app.js - The main logic of the application.
* index.html - The HTML of the application.

## Building your version

Here is the minimum steps you need to do to build your own Isoline tool. 

* Sign up for a free developer account at <https://developer.here.com>. 
* When you've signed up, go to your developer dashboard and generate a JavaScript key. You can, and should, restrict the key to the host where your application will be deployed.
* Edit app.js to change this line to match your key:

	const KEY = 'change me';

* This is the most complex change. The function, `loadData`, is called by the application in order to get your data and render it. This function can make a network request, or use hard coded data, but must return an array of items where each item has a `lat` and `lng` property. Right now it looks like this:

```
async function loadData() {
	alert('change me!');
}
```

* And that's it. Save your work, view it in your browser, and you should see your data load, the range controls load in the left hand panel, and you're good to go with further customizations!

