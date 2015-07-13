@stylesheet navbars Navbars
@parent styles-base 0

Global app navigation in either horizontal or vertical. Default syntax looks like: 

````
<nav class="nav navbar-nav">
  <li class="disabled"><a href="#">About</a></li>
  <li><a href="#">Variables</a></li>
  <li><a href="#">Steps</a></li>
  <li class="active"><a href="#">Interviews</a></li>
</nav>
````

## Inverted navbar
Modify the look of the navbar by adding `.navbar-inverse`.
````
<nav class="navbar navbar-inverse">
  ...
</nav>
````
