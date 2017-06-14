# Text Dropshadow

Welcome to the Text Dropshadow repo. Here you can find an example project using the library as well as the library itself.

## How does it work?

Text Dropshadow takes the user-provided inputs, calculates all points between the center of the text ([0,0]) and a calculated end point based on the angle and distance from the center.

## Basic Information

There are three values when using this library:

- Angle
- Length
- Color

**Angle**  
Angles are written in terms of degrees, such as `45deg`

**Length**  
Length is written in pixels. Currently, there is no support for other units.

**Color**  
Currently, the only acceptable values for color are **hex values**, `transparent`, and [**HTML color names**](http://htmlcolorcodes.com/color-names/). Color names can be used with or without positions. When used without a position, the value may look like `#000`, while with a position the same value would look like `#000 20%`. The only position allowed is percents.

## How to Use

<span style="color: gray;">*Want to use this with CSS? See the [Prefix Free Section](#prefix-free-docs)*</span>

```javascript
new DropShadow({
    angle: '45deg', //Default 45deg
    length: '30px', //Default 20px
    colors: "white 20%, transparent", // required
});
```

### <a id="prefix-free-docs" style="color: inherit; text-decoration: none;">With Prefix-Free</a>

If you include [Lea Verou's](leaverou.github.io) [Prefix Free](https://leaverou.github.io/prefixfree/), you can use this library right in your CSS.

```css
h1 {
    text-shadow: dropshadow(45deg, 20px, white 20%, transparent);
}
```
