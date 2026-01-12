#let amazed(term, color: blue) = {
  text(color, box[✨ #term ✨])
}

#let template(doc) = [
  #set text(font: "Andale Mono")
  #show "something cool": [Typst]
  #doc
]

```js
console.log("herp derp");

let x = 69;
```
#line(length: 100%)

#figure(caption: "Rust's default main function.")[
  ```rust
  fn main() {
      println!("Hello World!");
  }
  ```
] <rustcode>

#set heading(numbering: "(I)")
#show heading: it => [
  #set align(center)
  #set text(font: "Inria Serif")
  \~ #emph(it.body)
  #counter(heading).display(it.numbering) \~
]

= Dragon
With a base health of 15, the
dragon is the most powerful
creature.

= Manticore
While less powerful than the
dragon, the manticore gets
extra style points.

#emph[Hello] \
#emoji.face \
#"hello".len() \
#(1 + 2) \
#{
  let x = 1
  x + 2
}

#{
  let a = [from]
  let b = [*world*]
  [hello ]
  a + [ the ] + b
}
#list[A][B]

#show heading: set text(rgb("#664499"))
= This is rebeccapurple
While this is still black.
#show: template
I'm learning something cool today.
It's going great so far! And there's something nice in @rustcode

You are #amazed[beautiful]
I am #amazed(color: purple)[amazed]!

#show: doc => amazed(doc, color: black)
#lorem(100)

#show: amazed
#lorem(100)

