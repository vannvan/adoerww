### mixin.scss

```scss
$elementSeparator: '__';
$modifierSeparator: '--';

@function containsModifier($selector) {
    $selector: selectorToString($selector);
    @if str-index($selector, $modifierSeparator) {
        @return true;
    } @else {
        @return false;
    }
}

@function selectorToString($selector) {
    $selector: inspect($selector); //cast to string
    $selector: str-slice($selector, 2, -2); //remove brackets
    @return $selector;
}

@function getBlock($selector) {
    $selector: selectorToString($selector);
    $modifierStart: str-index($selector, $modifierSeparator) - 1;
    @return str-slice($selector, 0, $modifierStart);
}

@mixin b($block) {
    .#{$block} {
        @content;
    }
}

@mixin e($element) {
    $selector: &;
    @if containsModifier($selector) {
        $block: getBlock($selector);
        @at-root {
            #{$selector} {
                #{$block+$elementSeparator+$element} {
                    @content;
                }
            }
        }
    } @else {
        @at-root {
            #{$selector+$elementSeparator+$element} {
                @content;
            }
        }
    }
}

@mixin m($modifier) {
    @at-root {
        #{&}#{$modifierSeparator+$modifier} {
            @content;
        }
    }
}
```

### 实际运用

```scss
@include b(block) {
    background: red;
    @include e(header){
        font-size: 14px;
        @include m(css) {
            font-size: 18px;
        }
    };
    @include m(book) {
        color: blue;
        @include e(kindlebook) {
            background: gray;
        }
    }
}
```

### 编译效果

```css
.block {
  background: red;
}
.block__header {
  font-size: 14px;
}
.block__header--css {
  font-size: 18px;
}
.block--book {
  color: blue;
}
.block--book .block__kindlebook {
  background: gray;
}
```



