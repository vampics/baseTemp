# baseTemp
Simple Frontend Boilerplate with Gulp, SASS, HTML with Grid &amp; JS ES6 Framework.

#### Browsers
- IE 11+
- Firefox 50+, Chrome 55+
- iOS 10, Android 4.4.4

#### Requirements
- IDE or simply HTML/CSS Editor
- [NodeJS](https://nodejs.org/en/)
- Basic Sass/JS Knowledge



#### Init Framework

Put all files in the root of your project folder. To init the framework install all node modules with npm.

```bash
npm install
```



---



## Getting Started

`/src/` - folder with all sass, js and html files like a vendor folder. Gulp generate from here.

`/htdocs/` - result folder with all compiled files, ready to give this folder to your backend development.

`/static/` - (Optional) result folder with all compiled files but only for testing/creating without php. By default gulp browser-sync is rooted to this folder. Perfect to write or extend the frontend.  


You just can primary work in the src folder with all frontend files.



### (Gulp-) Tasks

Task | Result
--- | ---
`gulp compile-js` | Compile the JS from src to htdocs & static
`gulp compile-js-es5` | Compile the JS from src to htdocs & static as ES5 version
`gulp compile-scss` | Compile the CSS from src to htdocs & static
`gulp compile-html` | Compile the HTML from src to static
`gulp compress-js` | Minify the JS in htdocs
`gulp compress-js-libs` | Minify the JS libraries from static/js/libs to htdocs/js/libs
`gulp compress-css` | Minify the CSS in htdocs
`gulp compress-images` | Minify all images in htdocs/images & static/images
`gulp browser-sync` | Start the browser-sync. The Sync is rooted to /static [More Information](https://browsersync.io/)
`gulp compress` | All compress tasks, perfect for a git pushing hook
`gulp test-css` | Test your CSS with csslint
`gulp test-js` | Test your JS with jslint
`gulp test-frontend` | `gulp test-css` and `gulp test-js` in one task


### Edit (S)CSS

The structure is quite simple. In `/src/scss` you´ll find the basic structure of the baseTemp. In this root are all scss files where used across the site. The main sass configurations like grid, colors or fonts pooled in the config.scss.


##### Mediaquerys

In the most of the scss files your can find the mediaquery directly:

```bash
@media screen and (min-width: map-get($viewports, mw)) { ... }
```

Sass get via `map-get` the size of `mw`. The `$viewports` Array are defined in the config.scss. A Gulp Module merge automatically all same Mediaquerys to prevent a bunch of trash.

##### SCSS Modules/Pages

Modules are closed CSS declarations (with mediaquerys ect.) for using this styles multiple times on multiple pages. Pages are closed CSS declarations to overwrite styles of a module (as a last resort) on a specific site. This can controlled via a body class. When you add a new modules or a new page it´s necessary to add the new scss file in the styles.scss.


### Edit JS

We create a little JS framework to make codeing with Javascript easier. The framework reads the complete code and loads only the functions it requires. If you want to write a new JS module you just can create a new JS file in the modules folder. A Gulp Module merge all Javascript files automatically together. To use your module on your site/element you just can add the `data-js` attribute to a HTML Element with the name of your module. The framework call automatically the init function. 

##### Example to init 'newModule' Javascript Module
```bash
 <div data-js="newModule">....</div>
```

```bash
modules.newModule = {

    init: function() {

        alert("Hello World");

    }
}
```

We recommend this method. If you need a module across the site you can write it down in the header.js (like a navigation script ect.). The header.js and the base.js are loaded everytime across the site without set a specific attribute.


##### External Libarys


The Framework differentiate external Libarys they used everytime across the site and external Libarys they used only punctual. Libarys they used everytime across the site you´ll find/set in `src/js/libs`. Libarys they used only punctual or once you´ll find/set in `static/js/libs` and `htdocs/js/libs`

Libarys they used everytime across the site will be merged in the concated js file (functions.js). The other Libarys can be dynamically loaded via Ajax in a Javascript Module.


```bash
modules.selectbox = {
    init: function () {
        $.getScript( "/js/libs/selectbox.js", function() {
            $.each($('*[data-js=selectbox]'), function() {
                $(this).find("select").selectBoxIt();
            });

        });
    }
}
```

##### Helper

The framework includes some little helper for optimal codeing. 
You can use them in all your own modules.

Variables | What it does
--- | ---
`baseVars.windowWidth` | Get window width (Recalculate automatically)
`baseVars.windowHeight` | Get window height (Recalculate automatically)
`baseVars.documentWidth` | Get document width (Recalculate automatically)
`baseVars.documentHeight` | Get document height (Recalculate automatically)
`baseVars.vendorBasePath` | Get folder path to third party libs
`baseVars.mediaquerys` | Get all Mediaquerys from CSS as Array
`baseVars.grid` | Get the columns of the grid

Some functions for nasty effects. The libarys included in the main functions.js. 
You dont need to import it.

Functions | What it does
--- | ---
`baseClass.scrollTo(<string>)` | Scroll to a postion (as string)
`$(object).imagesLoaded( () => {})` | Triggers when all images are loaded (include images come from ajax) ([ImagesLoaded Plugin](https://imagesloaded.desandro.com/))
`$(object).bind('inview', (event, visible, topOrBottomOrBoth) => {})` | Triggers when the binded object scrolls into the visible viewport) ([InView Plugin](https://github.com/zuk/jquery.inview/))


We´ve add some own events to prevent a bunch of duplicate code.

Events | Trigger
--- | ---
`DOMLoaded` | Triggers when DOM complety loaded. Included all images. (Since jQuery 3.0 $(window).on("load") isn´t working in a $(document).ready() anmyore.)
`DOMFinished` | Triggers when DOM complety finished (incl. framework JS functions linke slider or equalheight). Can triggered multiple times.
`resized` | Triggers when the user stop scrolling to prevent bunch of unnecessary functions executions


You can set these attributes on every HTML element. 
This are plug and play ready functions.

Attribute Functions | What it does
--- | ---
`data-auto-scrolltop` | Scroll on Click to the top of the page
`data-auto-submit` | Submit closest form on change
`data-auto-link` | link to target on change (target define the attribute data-auto-link)

### Edit HTML / Grid

To build a better frontend we implemented a Gulp HTML fileinclude module. You can include HTML in other HTML files and add optional variables. The merged files will be only stored in the `/static` folder. 

The grid is oriented to the bootstrap grid. The sizes are generating automatically based on the `$viewports` Array in the config.scss.

##### Options in config.scss
```bash
$viewports: (
    w: 0px,
    sw: 480px,
    mw: 768px,
    lw: 1000px
);
  
$grid:                        12;   <-- Columns
$grid-absolute-box-margin:    5px;  <-- Margin for items
$grid-absolute-site-width:	1008px;  <-- Max. width of Content
```

##### Usage in index.html

```bash
<main class="gridWrap">
    <div class="w12 mw6"></div> 
    <div class="w12 mw6"></div>
    <div class="w12"></div>
</main>
```
In this Example all 3 boxes are going on mobile over 12 columns. From 768px (mw) up the first 2 boxes only going over 6 columns and slide into one line.


Syntax | Example | Function
--- | --- | ---
`(VIEWPORT)(COLUMNS)` | mw12 | Element has a width of 12 columns in the mw viewport
`(VIEWPORT)Right` | mwRight | Element are right aligned  in the mw viewport
`(VIEWPORT)Full` | mwFull | Element has a 100% width and a float in the mw viewport
`(VIEWPORT)Hidden` | mwHidden | Element is hidden in the mw viewport
`(VIEWPORT)Visible` | mwVisible | Element is visible in the mw viewport


---


## Gadgets


### Formvalidation

We include a standardized formvalidation JS Libary.

##### Usage
```bash
<form data-js="formvalidation">
    <input type="text" data-validation-required title="example">
</form>
```

Attribute to set on form element | What it does
--- | ---
`data-validation-required` | Tests if its filled
`data-validation-zip` | Tests if its a german postcode
`data-validation-email` | Tests if its  a e-mail
`data-validation-length` | Tests if has a minimum length (data-min="X")

### Slider

We include a standardized Slider JS Libary, too. We use the [Slick Slider](http://kenwheeler.github.io/slick/). We just added some nice features like a trigger for the framework when a slider is loaded and some options can be easy set with Data Attributes. With the Suffix of a Viewport you can set a specific option to a viewport.

##### Basic usage
```bash
<div data-js="slider" data-dots="true" data-arrows="false" data-arrows-mw="true" data-slidesToShow="1" data-slidesToShow-mw="2">
    <div>
        <figure>
            <img src="http://placehold.it/1280x768">
        </figure>
    </div>
    <div>
        <figure>
            <img src="http://placehold.it/1280x768">
        </figure>
    </div>
</div>
```

### Accordion

A small accordion function for basic usages

##### Usage
```bash
<div data-js="accordion">
    <a href="javascript:void(0);" data-accordion-trigger>Click me</a>
    <div data-accordion-content>
        <p>
            Lorem ilor sit amet.
        </p>
    </div>
</div>
```

### Modalbox

A small modalbox function for basic usages

##### Usage
```bash
<a href="javascript:void(0);" data-js="modalbox" data-modalbox="modalbox1">Click me</a>

<div class="modalbox" data-modalbox-name="modalbox1">
    <div>
        <figure>
            <img src="http://placehold.it/1280x768">
        </figure>
    </div>
</div>
```

### Same Height Boxing

A small equal height function for basic usages on div boxes. All boxes with the `data-equalheight-element` get the same height inner the parent box. 

##### Usage
```bash
<div data-js="equalheight" data-equalheight-option-breakpoint="mw">
    <div data-equalheight-element="true">
        <p>
            Lorem ipsum dolor sit amet.
        </p>
    </div>
    <div data-equalheight-element="true">
        <p>
            Lorem ipsum dolor sit amet.
        </p>
    </div>
</div>
```

Attributes from parent | What it does
--- | ---
`data-equalheight-element` | Element that will be get the height
`data-equalheight-option-mobile` | (Optional, On data-js element only) equal height function will be triggered in mobile, too.
`data-equalheight-option-row` | (Optional, On data-js element only) Only the elements in a row get the same height
`data-equalheight-option-breakpoint` | (Optional, On data-js element only) 'Define the breakpoint to mobile (Default: mw)

### Selectbox

We include also in this Framework the [Selectric](http://lcdsantos.github.io/jQuery-Selectric/) Libary from Leonardo Santos. 