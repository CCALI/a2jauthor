@styles navbar.less Horizontal Navbars
@parent navbars 1

Global app navigation, fixed to the top or bottom of the browser window. This is a default Bootstrap control. 

@demo styles/style-guide/demos/horizontal-navbar.html

## Fixed to top

Add `.navbar-fixed-top` and include a `.container` or `.container-fluid` to center and pad navbar content.

````
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    ...
  </div>
</nav>
````

## Fixed to bottom
Add `.navbar-fixed-bottom` and include a `.container` or `.container-fluid` to center and pad navbar content.

````
<nav class="navbar navbar-default navbar-fixed-bottom">
  <div class="container">
    ...
  </div>
</nav>
````
