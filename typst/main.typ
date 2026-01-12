#set document(
  title: "My first Typst document",
  author: "Joxtacy",
  description: "Just a test doc for learning Typst",
  keywords: ("typst", "test", "document"),
  date: auto,
)
#set page(
  paper: "a6",
  margin: (x: 1.8cm, y: 1.5cm),
)
#set text(
  font: "New Computer Modern",
  size: 10pt,
)
#set par(
  justify: true,
  leading: 0.52em,
)
#set heading(numbering: "1.")

#align(center)[= Introduction]
In this report, we will explore the
various factors that influence _fluid
dynamics_ in glaciers and how they
contribute to the formation and
behaviour of these natural structures.

#show "ArtosFlow": name => box[
  #box(
    image(
      "logo.svg",
      height: 0.7em,
    ),
  )
  #name
]

This report is embedded in the
ArtosFlow project. ArtosFlow is a
project of the Artos Institute.

== Sub heading
New paragraph

#text(font: "New Computer Modern")[
  = Background
  In the case of glaciers, fluid
  dynamics principles can be used
  to understand how the movement
  and behaviour of the ice is
  influenced by factors such as
  temperature, pressure, and the
  presence of other fluids (such as
  water).
]

=== Sub sub heading
And some text to go with it.

==== Sub sub sub heading?
Is it? Or not.

===== Looks the same
_Glaciers_ as the one shown in @glaciers will cease to exist if we don't take action soon.

+ The Climate
  - Temperature
  - Precipitation
+ The Topography
+ The Geography

#align(center + bottom)[
  #image("glacier.png", width: 70%)

  _Glaciers_ form an important part of the
  Earth's climate system.
]

#figure(
  image("glacier.png", width: 70%),
  caption: [
    _Glaciers_ form an important part of the
    Earth's climate system.
  ],
) <glaciers>

= Some mafs

The equation $Q = rho A v + C$
defines the glacial flow rate.

The flow rate of a glacier is
defined by the following equation:

$ Q = rho A v + C $

The flow rate of a glacier is given
by the following equation:

$ Q = rho A v + "time offset" $

Total displaced soil by glacial flow:

$
  7.32 beta +
  sum_(i=0)^nabla Q_i / 2
$

Total displaced soil by glacial flow:

$
  7.32 beta +
  sum_(i=0)^nabla
  (Q_i (a_i - epsilon)) / 2
$

$ v := vec(x_1, x_2, x_3) $

$ a arrow.squiggly b $

